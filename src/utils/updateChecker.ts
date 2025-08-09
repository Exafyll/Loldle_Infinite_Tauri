// src/utils/updateChecker.ts
import { getVersion } from "@tauri-apps/api/app";
import { fetch as httpFetch } from "@tauri-apps/plugin-http";
import { confirm as dialogConfirm } from "@tauri-apps/plugin-dialog";
import { cmp } from "./semver";

function cmpSemver(a: string, b: string) {
  const pa = a.split(".").map(n => parseInt(n || "0", 10));
  const pb = b.split(".").map(n => parseInt(n || "0", 10));
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const da = pa[i] ?? 0, db = pb[i] ?? 0;
    if (da < db) return -1;
    if (da > db) return 1;
  }
  return 0;
}

export async function checkForUpdates() {
  try {
    const current = await getVersion();          // e.g. "0.1.1"
    const res = await fetch("https://api.github.com/repos/Exafyll/Loldle_Infinite_Tauri/releases/latest", {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const latest = await res.json() as { tag_name?: string; html_url?: string; };
    const latestTag = (latest.tag_name || "").replace(/^v/i, "");  // e.g. "0.1.0"

    if (!latestTag) return; // nothing to compare

    if (cmp(latestTag, current) === 1) {
      // latest > current
      // show your prompt / open release page, etc.
    } else {
      // up to date
    }
  } catch (e) {
    console.error("Update check exception:", e);
  }
}

