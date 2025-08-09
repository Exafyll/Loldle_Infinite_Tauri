import React from "react";

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

interface ChampionRowProps {
  champion: Champion;
  secretChampion: Champion;
  getMatchClass: <T>(guess: T | T[], secret: T | T[]) => string;
  getYearClass: (guess: number, secret: number) => string;
  wrapCapitals: (text: string) => string;
}

export default function ChampionRow({
  champion,
  secretChampion,
  getMatchClass,
  getYearClass,
  wrapCapitals,
}: ChampionRowProps) {
  return (
    <div className="champContainer">
      <div className="champBox">
        <img
          src={champion.icon_path}
          alt={`${champion.name} icon`}
          width="100%"
        />
      </div>
      <div
        className={`champBox ${getMatchClass(
          champion.gender,
          secretChampion.gender
        )}`}
      >
        <p>{champion.gender}</p>
      </div>
      <div
        className={`champBox ${getMatchClass(
          champion.positions,
          secretChampion.positions
        )} position-${champion.positions[0]}`}
      >
        <p
          dangerouslySetInnerHTML={{
            __html: wrapCapitals(champion.positions.join(", ")),
          }}
        />
      </div>
      <div
        className={`champBox ${getMatchClass(
          champion.species,
          secretChampion.species
        )}`}
      >
        <p
          dangerouslySetInnerHTML={{
            __html: wrapCapitals(champion.species.join(", ")),
          }}
        />
      </div>
      <div
        className={`champBox ${getMatchClass(
          champion.resource,
          secretChampion.resource
        )}`}
      >
        <p>{champion.resource}</p>
      </div>
      <div
        className={`champBox ${getMatchClass(
          champion.range_type,
          secretChampion.range_type
        )} rangeType-${champion.range_type}`}
      >
        <p
          dangerouslySetInnerHTML={{
            __html: wrapCapitals(champion.range_type.join(", ")),
          }}
        />
      </div>
      <div
        className={`champBox ${getMatchClass(
          champion.regions,
          secretChampion.regions
        )}`}
      >
        <p
          dangerouslySetInnerHTML={{
            __html: wrapCapitals(champion.regions.join(", ")),
          }}
        />
      </div>
      <div
        className={`champBox ${getYearClass(
          champion.release_year,
          secretChampion.release_year
        )}`}
      >
        <p>{champion.release_year}</p>
      </div>
    </div>
  );
}
