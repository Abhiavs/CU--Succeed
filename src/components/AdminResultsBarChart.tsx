"use client";

import * as React from "react";
import { useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  LabelList,
  Cell,
} from "recharts";
import { Download, ImageDown, FileCode2 } from "lucide-react";

import { useIsDark } from "@/lib/useIsDark";

/*
 * ============================================================
 * ADMIN RESULTS BAR CHART
 *
 * One bar per candidate attempt for the active tab, plotted on
 * that tab's native scale (0–100 for Psychometric / Post, 0–10
 * for Wheel). Every value is the real persisted `Attempt.score`
 * — nothing here is derived or estimated.
 *
 * Downloads:
 *   PNG — high-resolution raster (2× DPR), for reports & slides
 *   SVG — vector, for print / further editing
 *
 * Both exports are rendered on a white surface with dark ink so
 * the file is legible regardless of the viewer's theme.
 * ============================================================
 */

export type AdminChartRow = {
  id: string;
  name: string;
  score: number | null;
};

type Props = {
  rows: AdminChartRow[];
  tab: "PSYCHOMETRIC" | "WHEEL" | "POST";
  batchLabel: string;
};

/* --- palette ------------------------------------------------
 * Single-series bars use the brand green; the average marker and
 * chrome are recessive. Exports always use the light ink so the
 * downloaded file prints correctly.
 * ------------------------------------------------------------ */

const BAR_COLOR = "#409d78";

const LIGHT_INK = {
  ink: "#1e293b",
  muted: "#64748b",
  grid: "#e2e8f0",
  axis: "#94a3b8",
  surface: "#ffffff",
  halo: "#ffffff",
};

const DARK_INK = {
  ink: "#e2f5ee",
  muted: "#89b6a6",
  grid: "#1b4b51",
  axis: "#1c5960",
  surface: "transparent",
  halo: "#143a41",
};

const CHART_H = 380;
const MIN_W = 640;
const PER_BAR = 68;

function scoreScale(tab: Props["tab"]) {
  return tab === "WHEEL"
    ? {
        max: 10,
        domain: [0, 10] as [number, number],
        ticks: [0, 2, 4, 6, 8, 10],
        suffix: "/10",
      }
    : {
        max: 100,
        domain: [0, 100] as [number, number],
        ticks: [0, 25, 50, 75, 100],
        suffix: "%",
      };
}

/*
 * `Attempt.score` is stored 0–100 for every tab, but a Wheel attempt
 * keeps average × 10 (e.g. 8.2 → 82). The chart plots Wheel on its
 * meaningful 0–10 scale, so divide it back down.
 */
function toNativeScore(tab: Props["tab"], raw: number) {
  return tab === "WHEEL" ? raw / 10 : raw;
}

function fmtScore(value: number, tab: Props["tab"]) {
  if (tab === "WHEEL") {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }
  return `${Math.round(value)}%`;
}

function shortName(name: string, max = 16) {
  if (name.length <= max) return name;
  return `${name.slice(0, max - 1)}…`;
}

/* ============================================================ */

export function AdminResultsBarChart({ rows, tab, batchLabel }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [busy, setBusy] = useState<null | "png" | "svg">(null);

  const isDark = useIsDark();
  const ink = isDark ? DARK_INK : LIGHT_INK;
  const scale = scoreScale(tab);

  const scored = rows
    .filter(
      (row): row is AdminChartRow & { score: number } =>
        row.score !== null && Number.isFinite(row.score)
    )
    .map((row) => ({ ...row, score: toNativeScore(tab, row.score) }));

  const average =
    scored.length > 0
      ? scored.reduce((sum, row) => sum + row.score, 0) / scored.length
      : null;

  const width = Math.max(MIN_W, scored.length * PER_BAR + 96);
  const tabTitle =
    tab === "WHEEL"
      ? "Wheel of Competencies"
      : tab === "POST"
      ? "Post Assessment"
      : "Psychometric Assessment";

  /* ----------------------------------------------------------
   * Build a standalone SVG string for export: clone the rendered
   * chart, force light ink, lay it on an opaque white surface and
   * give it a title band (the on-screen title is HTML, so a naive
   * clone would download an unlabelled image).
   * ---------------------------------------------------------- */
  const buildExportSvg = (): SVGSVGElement | null => {
    const source = wrapRef.current?.querySelector("svg");
    if (!source) return null;

    const SVGNS = "http://www.w3.org/2000/svg";
    const TITLE_BAND = 58;
    const exportH = CHART_H + TITLE_BAND;

    const clone = source.cloneNode(true) as SVGSVGElement;

    /* Recolour chrome for a light, printable surface. */
    clone.querySelectorAll("text").forEach((node) => {
      const el = node as SVGTextElement;
      const current = el.getAttribute("fill") || "";
      /* Keep the value/bar labels dark; damp the tick labels. */
      el.setAttribute(
        "fill",
        current === BAR_COLOR ? LIGHT_INK.ink : LIGHT_INK.muted
      );

      /*
       * Only the average-line label carries a deliberate halo (marked
       * by paint-order). Everything else must lose its stroke: an
       * inherited `stroke="none"` would otherwise be rewritten to a
       * white outline that swallows 10px glyphs on the white surface.
       */
      if (el.getAttribute("paint-order") === "stroke") {
        el.setAttribute("stroke", LIGHT_INK.surface);
      } else {
        el.removeAttribute("stroke");
      }
    });

    clone.querySelectorAll("line").forEach((node) => {
      const el = node as SVGLineElement;
      if (el.getAttribute("stroke-dasharray")) {
        el.setAttribute("stroke", "#9ca3af");
      } else {
        el.setAttribute("stroke", LIGHT_INK.grid);
      }
    });
    clone.querySelectorAll("path").forEach((node) => {
      const el = node as SVGPathElement;
      if (el.getAttribute("fill") === "none") {
        el.setAttribute("stroke", LIGHT_INK.axis);
      }
    });

    /* Push the chart below the title band. */
    const plotGroup = document.createElementNS(SVGNS, "g");
    plotGroup.setAttribute("transform", `translate(0 ${TITLE_BAND})`);
    while (clone.firstChild) {
      plotGroup.appendChild(clone.firstChild);
    }
    clone.appendChild(plotGroup);
    clone.setAttribute("width", String(width));
    clone.setAttribute("height", String(exportH));
    clone.setAttribute("viewBox", `0 0 ${width} ${exportH}`);
    clone.setAttribute("xmlns", SVGNS);
    /* The live chart sizes itself with 100%/100%; that has no
       containing block in an <img>, so pin it. */
    clone.removeAttribute("style");

    /* Opaque backdrop so image consumers see white. */
    const bg = document.createElementNS(SVGNS, "rect");
    bg.setAttribute("x", "0");
    bg.setAttribute("y", "0");
    bg.setAttribute("width", String(width));
    bg.setAttribute("height", String(exportH));
    bg.setAttribute("fill", LIGHT_INK.surface);
    clone.insertBefore(bg, clone.firstChild);

    /* Title + subtitle, matching what the page shows. */
    const titleEl = document.createElementNS(SVGNS, "text");
    titleEl.setAttribute("x", String(width / 2));
    titleEl.setAttribute("y", "28");
    titleEl.setAttribute("text-anchor", "middle");
    titleEl.setAttribute("font-size", "17");
    titleEl.setAttribute("font-weight", "700");
    titleEl.setAttribute("fill", LIGHT_INK.ink);
    titleEl.textContent = `${tabTitle} — Candidate Scores`;

    const subEl = document.createElementNS(SVGNS, "text");
    subEl.setAttribute("x", String(width / 2));
    subEl.setAttribute("y", "46");
    subEl.setAttribute("text-anchor", "middle");
    subEl.setAttribute("font-size", "11");
    subEl.setAttribute("fill", LIGHT_INK.muted);
    subEl.textContent = `${scored.length} completed attempt${
      scored.length === 1 ? "" : "s"
    } • ${batchLabel || "All Batches"}${
      average !== null ? ` • average ${fmtScore(average, tab)}` : ""
    }`;

    clone.insertBefore(titleEl, plotGroup);
    clone.insertBefore(subEl, plotGroup);

    return clone;
  };

  const fileStem = `cu-succeed-${tab.toLowerCase()}-chart${
    batchLabel && batchLabel !== "All Batches"
      ? `-${batchLabel.replace(/\s+/g, "-").toLowerCase()}`
      : "-all-batches"
  }`;

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSvg = () => {
    const clone = buildExportSvg();
    if (!clone) return;

    setBusy("svg");
    try {
      const xml = new XMLSerializer().serializeToString(clone);
      downloadBlob(
        new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${xml}`], {
          type: "image/svg+xml;charset=utf-8",
        }),
        `${fileStem}.svg`
      );
    } finally {
      setBusy(null);
    }
  };

  const handleDownloadPng = () => {
    const clone = buildExportSvg();
    if (!clone) return;

    setBusy("png");
    try {
      const xml = new XMLSerializer().serializeToString(clone);
      const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;

      /* The export carries a title band, so it is taller than the
         on-screen plot; rasterise at the export's own dimensions. */
      const expW = Number(clone.getAttribute("width")) || width;
      const expH = Number(clone.getAttribute("height")) || CHART_H;

      const img = new Image();
      img.onload = () => {
        const dpr = 2; // high-resolution export
        const canvas = document.createElement("canvas");
        canvas.width = expW * dpr;
        canvas.height = expH * dpr;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setBusy(null);
          return;
        }

        ctx.scale(dpr, dpr);
        ctx.fillStyle = LIGHT_INK.surface;
        ctx.fillRect(0, 0, expW, expH);
        ctx.drawImage(img, 0, 0, expW, expH);

        canvas.toBlob((blob) => {
          if (blob) downloadBlob(blob, `${fileStem}.png`);
          setBusy(null);
        }, "image/png");
      };
      img.onerror = () => setBusy(null);
      img.src = svgUrl;
    } catch {
      setBusy(null);
    }
  };

  /* ---------------------------------------------------------- */

  if (scored.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          No scored attempts to chart for this filter yet.
        </p>
      </div>
    );
  }

  const data = scored.map((row) => ({
    name: shortName(row.name),
    fullName: row.name,
    score: row.score,
  }));

  const showValueLabels = data.length <= 20;

  return (
    <div>
      {/* Header + download actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {tabTitle} — Candidate Scores
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {scored.length} completed attempt
            {scored.length === 1 ? "" : "s"}
            {batchLabel && batchLabel !== "All Batches"
              ? ` • ${batchLabel}`
              : " • All Batches"}
            {average !== null
              ? ` • average ${fmtScore(average, tab)}`
              : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 cursor-pointer"
          >
            <ImageDown className="w-4 h-4" />
            {busy === "png" ? "Preparing…" : "Download PNG"}
          </button>

          <button
            type="button"
            onClick={handleDownloadSvg}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-60 cursor-pointer"
          >
            <FileCode2 className="w-4 h-4" />
            SVG
          </button>
        </div>
      </div>

      {/* Scrollable plot so long cohorts keep legible bar widths */}
      <div className="overflow-x-auto">
        <div ref={wrapRef} style={{ width }}>
          <BarChart
            width={width}
            height={CHART_H}
            data={data}
            margin={{ top: 28, right: 64, bottom: 72, left: 8 }}
          >
            <CartesianGrid
              stroke={ink.grid}
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              interval={0}
              angle={-35}
              textAnchor="end"
              height={72}
              tick={{ fill: ink.muted, fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: ink.axis }}
            />

            <YAxis
              domain={scale.domain}
              ticks={scale.ticks}
              tick={{ fill: ink.muted, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={44}
            />

            <Tooltip
              cursor={{ fill: isDark ? "rgba(202,236,226,0.06)" : "rgba(27,75,81,0.05)" }}
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${ink.grid}`,
                background: isDark ? "#0e2a2f" : "#ffffff",
                fontSize: 12,
              }}
              labelStyle={{ color: ink.ink, fontWeight: 600 }}
              formatter={(value: any) => [
                fmtScore(Number(value), tab),
                "Score",
              ]}
              labelFormatter={(label: any, payload: any) =>
                payload?.[0]?.payload?.fullName ?? label
              }
            />

            {average !== null && (
              <ReferenceLine
                y={average}
                stroke="#eb6834"
                strokeDasharray="5 4"
                label={(props: any) => {
                  const vb = props?.viewBox || {};
                  const plotRight =
                    (vb.x ?? 0) + (vb.width ?? 0);
                  const y = vb.y ?? 0;

                  return (
                    <text
                      x={plotRight + 8}
                      y={y}
                      textAnchor="start"
                      dominantBaseline="central"
                      fill={ink.muted}
                      fontSize={10}
                      fontWeight={600}
                      stroke={ink.halo}
                      strokeWidth={3}
                      paintOrder="stroke"
                    >
                      avg {fmtScore(average, tab)}
                    </text>
                  );
                }}
              />
            )}

            <Bar
              dataKey="score"
              fill={BAR_COLOR}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
              isAnimationActive={false}
            >
              {showValueLabels && (
                <LabelList
                  dataKey="score"
                  position="top"
                  formatter={(value: any) =>
                    fmtScore(Number(value), tab)
                  }
                  style={{ fill: ink.ink, fontSize: 10, fontWeight: 600 }}
                />
              )}
            </Bar>
          </BarChart>
        </div>
      </div>

      <p className="mt-3 text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        <Download className="w-3 h-3" />
        Downloads capture the full cohort at high resolution — PNG for
        sharing, SVG for print.
      </p>
    </div>
  );
}

export default AdminResultsBarChart;
