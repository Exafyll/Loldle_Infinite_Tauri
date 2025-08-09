import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getVersion } from "@tauri-apps/api/app";

export default function BugReportModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  const [appVersion, setAppVersion] = useState("unknown");
  const [sys, setSys] = useState({
    platform: "unknown",
    os: "unknown",
    arch: "unknown",
  });

  function prettyOsFromUa() {
    const ua = navigator.userAgent || "";
    // Windows
    const win = ua.match(/Windows NT ([0-9.]+)/i);
    if (win) {
      const map: Record<string, string> = {
        "10.0": "Windows 10/11",
        "6.3": "Windows 8.1",
        "6.2": "Windows 8",
        "6.1": "Windows 7",
        "6.0": "Windows Vista",
        "5.1": "Windows XP",
      };
      return map[win[1]] || `Windows NT ${win[1]}`;
    }
    // macOS
    const mac = ua.match(/Mac OS X ([0-9_]+)/i);
    if (mac) {
      return `macOS ${mac[1].replace(/_/g, ".")}`;
    }
    // Linux
    if (/Linux/i.test(ua)) return "Linux";
    // Fallback
    return "Unknown OS";
  }

  function archFromUa() {
    const ua = navigator.userAgent || "";
    if (/x86_64|Win64|x64|amd64/i.test(ua)) return "x64";
    if (/arm64|aarch64/i.test(ua)) return "arm64";
    if (/arm/i.test(ua)) return "arm";
    return "unknown";
  }

  useEffect(() => {
    getVersion()
      .then(setAppVersion)
      .catch(() => setAppVersion("unknown"));

    (async () => {
      try {
        const mod = await import("@tauri-apps/plugin-os");
        const [p, v, a] = await Promise.all([
          mod.platform(),
          mod.version(),
          mod.arch(),
        ]);
        setSys({
          platform: p ?? "unknown",
          os: v ?? "unknown",
          arch: a ?? "unknown",
        });
      } catch {
        setSys({
          platform: (navigator as any).platform || "unknown",
          os: prettyOsFromUa(),
          arch: archFromUa(),
        });
      }
    })();
  }, []);

  const sendReport = async () => {
    setStatus("");
    if (!description.trim()) {
      setStatus("❌ Please describe the bug.");
      return;
    }
    setSending(true);
    try {
      const finalMessage =
        `[Reporter] ${name.trim() || "Anonymous"}\n` +
        `[App] v${appVersion}\n` +
        `[OS] ${sys.platform} ${sys.os} (${sys.arch})\n\n` +
        `Description:\n${description.trim()}`;

      await invoke("send_bug_report", { description: finalMessage });

      setStatus("✅ Bug report sent! Thank you 💙");
      setDescription("");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to send bug report.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ maxWidth: 600, width: "90%" }}>
        <h2>Report a Bug</h2>

        <label style={{ display: "block", marginTop: 10 }}>
          Name (optional)
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", marginTop: 6 }}
            placeholder="How should we identify you?"
          />
        </label>

        <label style={{ display: "block", marginTop: 10 }}>
          What happened / What is wrong?
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            style={{ width: "100%", marginTop: 6, resize: "vertical" }}
            placeholder="Steps to reproduce, expected vs actual, etc."
          />
        </label>

        <div style={{ marginTop: 12, opacity: 0.8, fontSize: 13 }}>
          <div>App: v{appVersion}</div>
          <div>
            OS: {sys.platform} {sys.os} ({sys.arch})
          </div>
        </div>

        {status && <p style={{ marginTop: 12 }}>{status}</p>}

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            marginTop: 14,
          }}
        >
          <button onClick={sendReport} disabled={sending}>
            {sending ? "Sending…" : "Send"}
          </button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
