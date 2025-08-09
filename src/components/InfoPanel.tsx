import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

const count = await invoke<number>("all_champions_count");

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

interface Props {
  guessedCount: number;
  allChampions: Champion[];
}

function getChampionOfDate(date: Date, allChampions: Champion[]): Champion {
  const dateString = date.toISOString().split("T")[0];
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash += dateString.charCodeAt(i);
  }

  const index = hash % allChampions.length;
  return allChampions[index];
}

export default function InfoPanel({ guessedCount, allChampions }: Props) {
  const [yesterdayChampion, setYesterdayChampion] = useState<Champion | null>(
    null
  );
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const champ = getChampionOfDate(yesterday, allChampions);
    setYesterdayChampion(champ);
  }, [allChampions]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextDay = new Date();
      nextDay.setUTCHours(24, 0, 0, 0);
      const msLeft = nextDay.getTime() - now.getTime();

      const hours = Math.floor(msLeft / (1000 * 60 * 60));
      const minutes = Math.floor((msLeft / (1000 * 60)) % 60);
      const seconds = Math.floor((msLeft / 1000) % 60);

      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="info-panel">
      {yesterdayChampion && (
        <p>🧠 Yesterday's Champion: {yesterdayChampion.name}</p>
      )}
      <p>
        📊 Guesses so far: {guessedCount} / {count}
      </p>
      <p>⏰ New champion in: {countdown}</p>
    </div>
  );
}
