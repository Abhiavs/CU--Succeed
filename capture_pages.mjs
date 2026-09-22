import { spawn } from "node:child_process";
import fs from "node:fs";
import { encode } from "next-auth/jwt";

const env = Object.fromEntries(
  fs.readFileSync(".env", "utf8")
    .split("\n")
    .filter(l => l.includes("=") && !l.trim().startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")]; })
);

const studentToken = await encode({
  secret: env.NEXTAUTH_SECRET,
  maxAge: 3600,
  token: {
    id: "cmtsw4ure0000s1s36pq4tx5i",
    sub: "cmtsw4ure0000s1s36pq4tx5i",
    email: "abhi1@gmail.com",
    name: "Abhilaash",
    role: "STUDENT"
  },
});

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const chrome = spawn(CHROME, [
  "--headless=new",
  "--remote-debugging-port=9222",
  "--user-data-dir=/tmp/cu-chrome-test",
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-gpu",
  "--window-size=1280,1000",
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function waitPort() {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch("http://127.0.0.1:9222/json/version"); if (r.ok) return; } catch {}
    await sleep(250);
  }
  throw new Error("chrome devtools never came up");
}

let id = 0;
function makeClient(ws) {
  const pending = new Map();
  const listeners = [];
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    } else {
      listeners.forEach(fn => fn(msg));
    }
  });
  return {
    send(method, params = {}) {
      const mid = ++id;
      return new Promise((res, rej) => {
        pending.set(mid, (m) => m.error ? rej(new Error(method + ": " + m.error.message)) : res(m.result));
        ws.send(JSON.stringify({ id: mid, method, params }));
      });
    }
  };
}

try {
  await waitPort();
  const tabs = await (await fetch("http://127.0.0.1:9222/json/list")).json();
  const wsUrl = tabs[0].webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.addEventListener("open", r));
  const cdp = makeClient(ws);

  await cdp.send("Page.enable");
  await cdp.send("Network.enable");

  // Set auth cookie
  await cdp.send("Network.setCookie", {
    name: "next-auth.session-token",
    value: studentToken,
    domain: "localhost",
    path: "/",
    httpOnly: true,
  });

  const pagesToTest = [
    { name: "home-light", url: "http://localhost:4300/", dark: false },
    { name: "home-dark", url: "http://localhost:4300/", dark: true },
    { name: "login-light", url: "http://localhost:4300/login", dark: false },
    { name: "results-light", url: "http://localhost:4300/student/results", dark: false },
    { name: "results-dark", url: "http://localhost:4300/student/results", dark: true },
  ];

  for (const page of pagesToTest) {
    console.log(`Navigating to ${page.url} (${page.name})...`);
    await cdp.send("Page.navigate", { url: page.url });
    await sleep(2000);

    if (page.dark) {
      await cdp.send("Runtime.evaluate", {
        expression: `document.documentElement.classList.add("dark"); localStorage.setItem("sa_theme", "dark");`,
      });
    } else {
      await cdp.send("Runtime.evaluate", {
        expression: `document.documentElement.classList.remove("dark"); localStorage.setItem("sa_theme", "light");`,
      });
    }
    await sleep(600);

    const shot = await cdp.send("Page.captureScreenshot", { format: "png" });
    const outPath = `/tmp/cu-shot-${page.name}.png`;
    fs.writeFileSync(outPath, Buffer.from(shot.data, "base64"));
    console.log(`Captured ${outPath}`);
  }

  ws.close();
} finally {
  chrome.kill();
  fs.unlinkSync("/Users/apple/Claude/cusucceed/SucceedAcademy/capture_pages.mjs");
}
