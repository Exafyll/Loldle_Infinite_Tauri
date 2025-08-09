import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import SettingsModal from "./components/SettingsModal";
import SearchBar from "./components/SearchBar";
import ChampionRow from "./components/ChampionRow";
import VictoryModal from "./components/VictoryModal";
import InfoPanel from "./components/InfoPanel";
import Footer from "./components/Footer";

import { getCurrentWindow } from "@tauri-apps/api/window";

// =======================
// Champion Interface
// =======================
interface Champion {
  name: string;
  gender: string;
  positions: string[];
  species: string[];
  resource: string;
  range_type: string[];
  regions: string[];
  release_year: number;
  icon_path: string;
}

// =======================
// Component Start
// =======================
export default function App() {
  // -----------------------
  // State Management
  // -----------------------
  const [guessedChampions, setGuessedChampions] = useState<Champion[]>([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Champion[]>([]);
  const [secretChampion, setSecretChampion] = useState<Champion | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [isRandomGame, setIsRandomGame] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [allChampions, setAllChampions] = useState<Champion[]>([]);
  const [selectedBackground, setSelectedBackground] = useState<
    "default" | "kian"
  >("default");
  const [colorblindMode, setColorblindMode] = useState(false);
  const appWindow = getCurrentWindow();
  document
    .getElementById("btn-min")
    ?.addEventListener("click", () => appWindow.minimize());
  document
    .getElementById("btn-max")
    ?.addEventListener("click", () => appWindow.toggleMaximize());
  document
    .getElementById("btn-close")
    ?.addEventListener("click", () => appWindow.close());

  // -----------------------
  // Load Secret Champion on Mount
  // -----------------------
  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const champ: Champion = await invoke("get_daily_champion");

        setSecretChampion(champ);
        console.log("Secret champ is:", champ);
      } catch (err) {
        console.error("Failed to fetch secret champ", err);
      }
    };
    fetchSecret();
  }, []);

  // -----------------------
  // I dont eveb know what to call this
  // -----------------------
  useEffect(() => {
    invoke<Champion[]>("get_all_champions").then(setAllChampions);
  }, []);

  // -----------------------
  // Search Suggestion
  // -----------------------
  useEffect(() => {
    if (query.length === 0) {
      setSuggestions([]);
      return;
    }

    const debounce = setTimeout(() => {
      invoke<Champion[]>("search_champions", { prefix: query })
        .then((results) => {
          const filtered = results.filter(
            (c) => !guessedChampions.some((g) => g.name === c.name)
          );
          setSuggestions(filtered);
        })
        .catch(console.error);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const input = document.querySelector("input[type='text']");
      const suggestions = document.querySelector(".suggestions");

      if (
        input &&
        suggestions &&
        !input.contains(e.target as Node) &&
        !suggestions.contains(e.target as Node)
      ) {
        setIsInputFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =======================
  // Settings
  // =======================
  useEffect(() => {
    document.body.classList.remove("bg-default", "bg-kian");
    document.body.classList.add(`bg-${selectedBackground}`);
  }, [selectedBackground]);
  useEffect(() => {
    document.documentElement.classList.toggle(
      "colorblind-mode",
      colorblindMode
    );
  }, [colorblindMode]);

  // =======================
  // Event Handlers
  // =======================

  // Handle champion selection
  const onSelect = (champ: Champion) => {
    if (!secretChampion) return;
    setGuessedChampions((prev) => [...prev, champ]);
    setQuery("");
    setSuggestions([]);
    if (champ.name === secretChampion.name) {
      setHasWon(true);
    }
  };

  function startRandomGame() {
    setIsRandomGame(true);
    setGuessedChampions([]);
    setHasWon(false);

    invoke<Champion>("get_champ")
      .then((champ) => {
        setSecretChampion(champ);
        console.log(champ);
      })
      .catch(console.error);
  }

  // =======================
  // Comparison Logic
  // =======================

  function getMatchClass<T>(guess: T | T[], secret: T | T[]): string {
    const guessed = Array.isArray(guess) ? guess : [guess];
    const target = Array.isArray(secret) ? secret : [secret];

    const matchCount = guessed.filter((g) => target.includes(g)).length;

    if (matchCount === guessed.length && guessed.length === target.length)
      return "match";
    if (matchCount > 0) return "partial-match";
    return "mismatch";
  }

  function getYearClass(guess: number, secret: number): string {
    if (guess === secret) return "match";
    return guess > secret ? "higher" : "lower";
  }

  // =======================
  // Utility Functions
  // =======================

  function wrapCapitals(text: string): string {
    return text.replace(/([A-Z])/g, "\u200B$1");
  }

  // =======================
  // Sound Functions
  // =======================

  function playSound(path: string) {
    const audio = new Audio(path);
    audio.volume = 0.5; // optional volume control
    audio.play();
  }
  useEffect(() => {
    if (hasWon) {
      setShowVictoryModal(true);
      console.log("🏆 Victory modal shown");
      playSound("/Sounds/Victory.mp3");
    }
  }, [hasWon]);

  useEffect(() => {
    const appWindow = getCurrentWindow();

    const minBtn = document.getElementById("btn-min");
    const maxBtn = document.getElementById("btn-max");
    const closeBtn = document.getElementById("btn-close");

    if (!minBtn || !maxBtn || !closeBtn) {
      console.warn("⛔ Window buttons not found in DOM");
      return;
    }

    const handleMinimize = () => appWindow.minimize();
    const handleMaximize = () => appWindow.toggleMaximize();
    const handleClose = () => appWindow.close();

    minBtn.addEventListener("click", handleMinimize);
    maxBtn.addEventListener("click", handleMaximize);
    closeBtn.addEventListener("click", handleClose);

    return () => {
      minBtn.removeEventListener("click", handleMinimize);
      maxBtn.removeEventListener("click", handleMaximize);
      closeBtn.removeEventListener("click", handleClose);
    };
  }, []);

  useEffect(() => {
    invoke<Champion[]>("get_all_champions")
      .then((data) => {
        console.log("✅ All champions fetched:", data);
        setAllChampions(data);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch champions:", err);
      });
  }, []);

  // =======================
  // JSX Rendering
  // =======================
  return (
    <div className="returnBody">
      <div className="topBar">
        <img
          src="/Images/Cogwheel.png"
          alt="Settings"
          className="settingsButton"
          onClick={() => setShowSettings(true)}
        />

        <div>
          <img
            src="/Images/Minimise.png"
            alt="Minimise"
            className="windowButton"
            id="btn-min"
          />
          <img
            src="/Images/Maximise.png"
            alt="Maximise"
            className="windowButton"
            id="btn-max"
          />
          <img
            src="/Images/Exit.png"
            alt="Exit"
            className="windowButton"
            id="btn-close"
          />
        </div>
      </div>

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          selectedBackground={selectedBackground}
          setSelectedBackground={setSelectedBackground}
          colorblindMode={colorblindMode}
          setColorblindMode={setColorblindMode}
        />
      )}

      {/* Logo */}
      <div>
        <img src="/Images/logo.png" alt="logo" className="logo" />
      </div>

      {/* Search Input */}
      <SearchBar
        query={query}
        setQuery={setQuery}
        suggestions={suggestions}
        setSuggestions={setSuggestions}
        guessedChampions={guessedChampions}
        isInputFocused={isInputFocused}
        setIsInputFocused={setIsInputFocused}
        onSelect={onSelect}
      />

      {/* Info Panel */}
      {allChampions && allChampions.length > 0 ? (
        <InfoPanel
          guessedCount={guessedChampions.length}
          allChampions={allChampions}
        />
      ) : (
        <div style={{ color: "white", opacity: 0.5 }}>
          Loading champion info...
        </div>
      )}

      {/* Table Headers */}
      <div className="champContainer">
        {[
          "Champion",
          "Gender",
          "Positions",
          "Species",
          "Resource",
          "Range type",
          "Regions",
          "Release Year",
        ].map((label) => (
          <div key={label} className="champHeader">
            <h6>{label}</h6>
          </div>
        ))}
      </div>

      <div className="champWrapper">
        {secretChampion &&
          guessedChampions.map((champion, index) => (
            <ChampionRow
              key={index}
              champion={champion}
              secretChampion={secretChampion}
              getMatchClass={getMatchClass}
              getYearClass={getYearClass}
              wrapCapitals={wrapCapitals}
            />
          ))}
      </div>

      {showVictoryModal && (
        <VictoryModal
          attempts={guessedChampions.length}
          onPlayAgain={() => {
            startRandomGame();
            setShowVictoryModal(false);
          }}
        />
      )}
      <Footer />
    </div>
  );
}
