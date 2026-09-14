"use client";

import * as React from "react";
import { useState } from "react";
import { useIsDark } from "@/lib/useIsDark";

/*
 * ============================================================
 * WHEEL COMPARISON CHART  —  Pre-Training vs Post-Training
 *
 * A grouped column chart: each competency shows a PRE bar with
 * its POST bar beside it, on a 0–10 self-rating scale.
 *
 * Colour (both modes validated against the surface each actually
 * renders on — light card #ffffff, dark card #143a41 — all five
 * checks pass; see the theme tables below):
 *   PRE  = #409d78  brand green
 *   POST = #eb6834 light / #d95926 dark  (warm orange)
 *
 * The POST bar also carries a 45° hatch, tone-on-tone in a
 * darker step of its own hue. That is the visual language from
 * the hand-drawn reference, and it doubles as the secondary
 * encoding the colour checks ask for — identity never rests on
 * hue alone (legend + hatch + value labels + table view).
 *
 * Rendered as plain SVG rather than through a chart library so
 * the paired layout and the hatch match the reference exactly.
 * ============================================================
 */

export type WheelComparisonRow = {
  name: string;
  pre: number | null;
  post: number | null;
};

type Props = {
  rows: WheelComparisonRow[];
  hasPost?: boolean;
};

/* --- colours -------------------------------------------------
 * Two series, and they must survive colour-blindness. The brand's
 * own greens cannot do that — #409d78 vs #66a770 measure dE 4.1
 * under protanopia (indistinguishable), and five of the eight
 * palette colours sit below the chroma floor and read as grey. So
 * PRE takes the brand green and POST a warm orange that reads as
 * its opposite.
 *
 * Every value below is validated against the surface it actually
 * renders on — light card #ffffff, dark card #143a41 — not against
 * the page: all five checks pass in both modes (worst CVD dE 9.3
 * light / 10.0 dark, normal-vision dE 25.2 / 24.7).
 */

type ChartTheme = {
  pre: string;
  post: string;
  postHatch: string;
  ink: string;
  muted: string;
  grid: string;
  axis: string;
  up: string;
  down: string;
};

const LIGHT_THEME: ChartTheme = {
  pre: "#409d78",
  post: "#eb6834",
  postHatch: "#b8461c", // tone-on-tone darker step of the POST hue
  ink: "#1b4b51",
  muted: "#3f6d68",
  grid: "#e2f5ee", // hairline, one step off the card
  axis: "#a8cbc0",
  up: "#006300", // success text needs a darker step on light (3.27 -> 7.0)
  down: "#d03b3b",
};

const DARK_THEME: ChartTheme = {
  pre: "#409d78",
  post: "#d95926",
  postHatch: "#9c3a12", // tone-on-tone darker step of the POST hue
  ink: "#caece2",
  muted: "#89b6a6",
  grid: "#1b4b51", // hairline, one step off the card
  axis: "#1c5960",
  up: "#0ca30c",
  down: "#d03b3b",
};

/* --- geometry ------------------------------------------------ */

const W = 720;
const H = 380;

const PAD_L = 46;
const PAD_R = 18;
const PAD_T = 26;
const PAD_B = 78; // room for a wrapped two-line x-axis label band

const PLOT_L = PAD_L;
const PLOT_R = W - PAD_R;
const PLOT_T = PAD_T;
const PLOT_B = H - PAD_B;

const MAX_VALUE = 10;
const BAR_W = 24;
const BAR_GAP = 2; // the surface gap between the paired bars

const Y_TICKS = [0, 2, 4, 6, 8, 10];

/* --- helpers ------------------------------------------------- */

function yFor(value: number) {
  const span = PLOT_B - PLOT_T;
  return PLOT_B - (Math.min(Math.max(value, 0), MAX_VALUE) / MAX_VALUE) * span;
}

/*
 * Column with a 4px rounded cap and a square foot on the baseline.
 */
function barPath(x: number, value: number, width: number) {
  const top = yFor(value);
  const h = PLOT_B - top;

  if (h <= 0) return "";

  const r = Math.min(4, width / 2, h);

  return [
    `M ${x} ${PLOT_B}`,
    `L ${x} ${top + r}`,
    `Q ${x} ${top} ${x + r} ${top}`,
    `L ${x + width - r} ${top}`,
    `Q ${x + width} ${top} ${x + width} ${top + r}`,
    `L ${x + width} ${PLOT_B}`,
    "Z",
  ].join(" ");
}

/*
 * Wrap a dimension name onto at most two lines so the x-axis
 * band stays a fixed height and nothing overflows the plot.
 */
function wrap(name: string, maxChars = 13): string[] {
  const words = name.split(/[\s-]+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);

  if (lines.length <= 2) return lines;

  // Collapse the overflow onto the second line rather than growing.
  const head = lines[0];
  const tail = lines.slice(1).join(" ");
  return [head, tail.length > maxChars + 4 ? `${tail.slice(0, maxChars + 1)}…` : tail];
}

function fmt(v: number | null) {
  if (v === null || v === undefined) return "—";
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

/* ============================================================ */

export function WheelComparisonChart({ rows, hasPost = true }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  const isDark = useIsDark();
  const t = isDark ? DARK_THEME : LIGHT_THEME;

  if (!rows || rows.length === 0) {
    return (
      <p className="text-xs text-slate-400">
        No wheel dimensions are configured yet.
      </p>
    );
  }

  const bandW = (PLOT_R - PLOT_L) / rows.length;
  const pairW = BAR_W * 2 + BAR_GAP;

  /* Average improvement across dimensions where both sides exist. */
  const paired = rows.filter((r) => r.pre !== null && r.post !== null);
  const avgDelta =
    paired.length > 0
      ? paired.reduce((sum, r) => sum + ((r.post as number) - (r.pre as number)), 0) /
        paired.length
      : null;

  return (
    <div className="w-full">
      {/* Legend — always present for two series */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <span className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-[3px]"
              style={{ backgroundColor: t.pre }}
            />
            Pre-Training
          </span>
          <span className="flex items-center gap-2">
            <svg width="14" height="14" aria-hidden="true">
              <defs>
                <pattern
                  id="legend-hatch"
                  width="6"
                  height="6"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <rect width="6" height="6" fill={t.post} />
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="6"
                    stroke={t.postHatch}
                    strokeWidth="2.5"
                  />
                </pattern>
              </defs>
              <rect
                width="14"
                height="14"
                rx="3"
                fill="url(#legend-hatch)"
              />
            </svg>
            Post-Training
          </span>
        </div>

        {avgDelta !== null && (
          <span className="text-xs text-slate-400">
            Average change{" "}
            <strong
              className="font-mono"
              style={{ color: avgDelta >= 0 ? t.up : t.down }}
            >
              {avgDelta >= 0 ? "+" : ""}
              {avgDelta.toFixed(1)}
            </strong>{" "}
            / 10
          </span>
        )}
      </div>

      {/* Plot — container height includes the x-axis label band */}
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          role="img"
          aria-label="Grouped column chart comparing pre-training and post-training self-ratings across competency dimensions"
        >
          <defs>
            {/* 45° hatch, tone-on-tone in a darker step of the POST hue */}
            <pattern
              id="post-hatch"
              width="7"
              height="7"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="7" height="7" fill={t.post} />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="7"
                stroke={t.postHatch}
                strokeWidth="3"
              />
            </pattern>
          </defs>

          {/* Gridlines + y ticks — solid hairlines, recessive */}
          {Y_TICKS.map((tick) => {
            const y = yFor(tick);
            return (
              <g key={tick}>
                <line
                  x1={PLOT_L}
                  y1={y}
                  x2={PLOT_R}
                  y2={y}
                  stroke={tick === 0 ? t.axis : t.grid}
                  strokeWidth="1"
                />
                <text
                  x={PLOT_L - 10}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="central"
                  fontSize="11"
                  fill={t.muted}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Y axis title */}
          <text
            x={14}
            y={(PLOT_T + PLOT_B) / 2}
            textAnchor="middle"
            fontSize="11"
            fill={t.muted}
            transform={`rotate(-90 14 ${(PLOT_T + PLOT_B) / 2})`}
          >
            Scores given to yourself
          </text>

          {/* Groups */}
          {rows.map((row, i) => {
            const bandCentre = PLOT_L + bandW * i + bandW / 2;
            const preX = bandCentre - pairW / 2;
            const postX = preX + BAR_W + BAR_GAP;
            const isHovered = hovered === i;

            const lines = wrap(row.name);
            const labelY = PLOT_B + 18;

            return (
              <g
                key={row.name}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                style={{ outline: "none" }}
              >
                {/* Hit target: whole band, well past the 24px minimum */}
                <rect
                  x={PLOT_L + bandW * i}
                  y={PLOT_T}
                  width={bandW}
                  height={PLOT_B - PLOT_T}
                  fill="transparent"
                />

                {/* subtle hover wash */}
                {isHovered && (
                  <rect
                    x={PLOT_L + bandW * i + 4}
                    y={PLOT_T}
                    width={bandW - 8}
                    height={PLOT_B - PLOT_T}
                    fill={isDark ? "rgba(202,236,226,0.06)" : "rgba(27,75,81,0.05)"}
                    rx="6"
                  />
                )}

                {/* PRE bar */}
                {row.pre !== null && (
                  <path d={barPath(preX, row.pre, BAR_W)} fill={t.pre} />
                )}

                {/* POST bar — hatched */}
                {row.post !== null && (
                  <path
                    d={barPath(postX, row.post, BAR_W)}
                    fill="url(#post-hatch)"
                  />
                )}

                {/* Value labels — muted ink, never the data colour */}
                {row.pre !== null && (
                  <text
                    x={preX + BAR_W / 2}
                    y={yFor(row.pre) - 7}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill={t.ink}
                  >
                    {fmt(row.pre)}
                  </text>
                )}
                {row.post !== null && (
                  <text
                    x={postX + BAR_W / 2}
                    y={yFor(row.post) - 7}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill={t.ink}
                  >
                    {fmt(row.post)}
                  </text>
                )}

                {/* X labels, wrapped to two lines */}
                {lines.map((line, li) => (
                  <text
                    key={li}
                    x={bandCentre}
                    y={labelY + li * 12}
                    textAnchor="middle"
                    fontSize="10.5"
                    fill={t.muted}
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hovered !== null && rows[hovered] && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-950/95"
            style={{
              left: `${((PLOT_L + bandW * hovered + bandW / 2) / W) * 100}%`,
              top: 8,
              transform: "translateX(-50%)",
            }}
          >
            <div className="text-[11px] font-semibold text-slate-100 whitespace-nowrap">
              {rows[hovered].name}
            </div>
            <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-[2px]"
                  style={{ backgroundColor: t.pre }}
                />
                Pre <strong className="font-mono text-slate-200">{fmt(rows[hovered].pre)}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-[2px]"
                  style={{ backgroundColor: t.post }}
                />
                Post <strong className="font-mono text-slate-200">{fmt(rows[hovered].post)}</strong>
              </span>
            </div>
            {rows[hovered].pre !== null && rows[hovered].post !== null && (
              <div className="mt-1 text-[11px] font-mono text-slate-400">
                {(() => {
                  const d = (rows[hovered].post as number) - (rows[hovered].pre as number);
                  return (
                    <span style={{ color: d >= 0 ? t.up : t.down }}>
                      {d >= 0 ? "+" : ""}
                      {d.toFixed(1)} change
                    </span>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>

      {!hasPost && (
        <p className="mt-3 text-[11px] text-amber-700 dark:text-amber-400/90">
          Post-training results aren&apos;t available yet — only your pre-training self-ratings
          are shown. This comparison fills in once you complete the POST competency wheel.
        </p>
      )}

      {/* Table-view twin — every value reachable without hovering */}
      <div className="mt-4">
        <button
          onClick={() => setShowTable((v) => !v)}
          className="text-[11px] font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          {showTable ? "Hide data table" : "Show data table"}
        </button>

        {showTable && (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <caption className="sr-only">
                Pre-training versus post-training self-ratings per competency dimension
              </caption>
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th scope="col" className="text-left font-semibold py-2 pr-3">Dimension</th>
                  <th scope="col" className="text-right font-semibold py-2 px-3">Pre</th>
                  <th scope="col" className="text-right font-semibold py-2 px-3">Post</th>
                  <th scope="col" className="text-right font-semibold py-2 pl-3">Change</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const d =
                    r.pre !== null && r.post !== null ? r.post - r.pre : null;
                  return (
                    <tr key={r.name} className="border-b border-slate-800/60">
                      <td className="py-2 pr-3 text-slate-200">{r.name}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-300">
                        {fmt(r.pre)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-300">
                        {fmt(r.post)}
                      </td>
                      <td
                        className="py-2 pl-3 text-right font-mono"
                        style={{
                          color:
                            d === null ? t.muted : d >= 0 ? t.up : t.down,
                        }}
                      >
                        {d === null ? "—" : `${d >= 0 ? "+" : ""}${d.toFixed(1)}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default WheelComparisonChart;
