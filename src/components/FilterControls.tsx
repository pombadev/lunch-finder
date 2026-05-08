import { useState } from "react";

export type SortOption = "distance" | "popularity";
export type FilterChip = "openNow" | "under500m" | "topRated";

const CHIPS: { id: FilterChip; label: string }[] = [
  { id: "openNow", label: "Open now" },
  { id: "under500m", label: "Under 500m" },
  { id: "topRated", label: "Top rated 4+" },
];

interface FilterControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  activeChips: Set<FilterChip>;
  onChipToggle: (chip: FilterChip) => void;
}

export function FilterControls({
  sortBy,
  onSortChange,
  activeChips,
  onChipToggle,
}: FilterControlsProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="card" style={{ marginBottom: "2rem" }}>
      <button
        className="filter-toggle"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
      >
        <span>Filters</span>
        <span aria-hidden="true">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="filter-body">
          <div className="filter-row">
            <label htmlFor="sortBy" className="filter-label">
              Sort:
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="filter-select"
            >
              <option value="distance">Closest first</option>
              <option value="popularity">Most popular</option>
            </select>
            {sortBy === "popularity" && (
              <small className="filter-hint">Ranked by Google Places</small>
            )}
          </div>

          <div className="chip-row">
            {CHIPS.map((chip) => (
              <button
                key={chip.id}
                className={`chip${activeChips.has(chip.id) ? " chip--active" : ""}`}
                onClick={() => onChipToggle(chip.id)}
                aria-pressed={activeChips.has(chip.id)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
