export type SortOption = "distance" | "popularity";

interface FilterControlsProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
}

export function FilterControls({ sortBy, onSortChange }: FilterControlsProps) {
  return (
    <div
      className="card"
      style={{
        marginBottom: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0 }}>Filters</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label htmlFor="sortBy" style={{ fontWeight: "bold" }}>
            Sort By:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            style={{
              padding: "0.3rem",
              border: "2px solid black",
              fontFamily: "inherit",
              fontWeight: "bold",
              backgroundColor: "white",
            }}
          >
            <option value="distance">Distance</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
      </div>
    </div>
  );
}
