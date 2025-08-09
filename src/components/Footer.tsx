import { useState } from "react";
import BugReportModal from "./BugReportModal";

interface BugReportModalProps {
  onClose: () => void;
}

export default function Footer({ guessedCount }: { guessedCount?: number }) {
  const [showBug, setShowBug] = useState(false);

  return (
    <footer className="footer" style={{ WebkitAppRegion: "no-drag" } as any}>
      <button onClick={() => setShowBug(true)}>Report a bug</button>
      <p>Made by Exafyll</p>

      {showBug && <BugReportModal onClose={() => setShowBug(false)} />}
    </footer>
  );
}
