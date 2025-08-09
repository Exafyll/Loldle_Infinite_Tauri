import React, { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";

type BackgroundStyle = "default" | "kian";

interface SettingsModalProps {
  onClose: () => void;
  selectedBackground: BackgroundStyle;
  setSelectedBackground: React.Dispatch<React.SetStateAction<BackgroundStyle>>;
  colorblindMode: boolean;
  setColorblindMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  selectedBackground,
  setSelectedBackground,
  colorblindMode,
  setColorblindMode,
}) => {
  const [version, setVersion] = useState<string | null>(null);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    getVersion().then(setVersion);
    setIsDev(process.env.NODE_ENV !== "production");
  }, []);

  return (
    <div className="modal">
      <div className="modal-content settings-modal">
        <h2>Settings</h2>

        <div className="settingsRow">
          <label>
            Background Style:
            <select
              value={selectedBackground}
              onChange={(e) =>
                setSelectedBackground(e.target.value as BackgroundStyle)
              }
            >
              <option value="default">Default</option>
              <option value="kian">Kian</option>
            </select>
          </label>
        </div>

        <div className="settingsRow">
          <label>
            Red-Green Color Blind Mode:
            <input
              type="checkbox"
              checked={colorblindMode}
              onChange={(e) => setColorblindMode(e.target.checked)}
            />
          </label>
        </div>
        <div className="subSettingsRow">
          <p>Correct</p>
          <div className="colorBox correctBackground"></div>
        </div>
        <div className="subSettingsRow">
          <p>Partial</p>
          <div className="colorBox partialBackground"></div>
        </div>
        <div className="subSettingsRow">
          <p>Incorrect</p>
          <div className="colorBox incorrectBackground"></div>
        </div>

        <button onClick={onClose}>Close</button>

        <p style={{ marginTop: "40px", fontSize: "14px", opacity: 0.7 }}>
          Version: {version ?? "Loading..."} {isDev ? "(Dev)" : "(Build)"}
        </p>
      </div>
    </div>
  );
};

export default SettingsModal;
