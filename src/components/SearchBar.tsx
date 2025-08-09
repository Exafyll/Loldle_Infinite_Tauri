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

interface SearchBarProps {
  query: string;
  setQuery: (val: string) => void;
  suggestions: Champion[];
  setSuggestions: (val: Champion[]) => void;
  guessedChampions: Champion[];
  isInputFocused: boolean;
  setIsInputFocused: (val: boolean) => void;
  onSelect: (champ: Champion) => void;
}

export default function SearchBar({
  query,
  setQuery,
  suggestions,
  setSuggestions,
  guessedChampions,
  isInputFocused,
  setIsInputFocused,
  onSelect,
}: SearchBarProps) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search champions"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsInputFocused(true)}
        autoComplete="off"
      />
      {isInputFocused && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((c) => (
            <li
              key={c.name}
              onClick={() => onSelect(c)}
              className="suggestion-item"
            >
              <img
                src={c.icon_path}
                alt={`${c.name} icon`}
                className="suggestion-icon"
              />
              <span>{c.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
