import { useState, useEffect, useMemo } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import {
  fetchNearbyRestaurants,
  type RankPreference,
  type Restaurant,
} from "../services/places";
import { RestaurantCard } from "./RestaurantCard";
import { RestaurantCardSkeleton } from "./RestaurantCardSkeleton";
import {
  FilterControls,
  type SortOption,
  type FilterChip,
} from "./FilterControls";

function getGeoErrorDetails(error: string): { message: string; hint: string } {
  const lower = error.toLowerCase();
  if (lower.includes("denied") || lower.includes("permission")) {
    return {
      message: "Location access was denied.",
      hint: 'Open your browser settings → "Location" → allow this site.',
    };
  }
  if (lower.includes("unavailable")) {
    return {
      message: "Your location could not be determined.",
      hint: "Make sure GPS or Wi-Fi is enabled and try again.",
    };
  }
  if (lower.includes("timeout")) {
    return {
      message: "Location request timed out.",
      hint: "Your GPS is taking too long. Try again in a moment.",
    };
  }
  return { message: error, hint: "Please try again." };
}

export function MainList() {
  const { location, error: geoError, getLocation } = useGeolocation();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [surpriseMe, setSurpriseMe] = useState(false);
  const [surprisePick, setSurprisePick] = useState<Restaurant | null>(null);
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>("distance");
  const [activeChips, setActiveChips] = useState<Set<FilterChip>>(new Set());

  useEffect(() => {
    async function getRestaurants() {
      if (!location) return;
      setLoading(true);
      setApiError(null);
      setExcludedIds(new Set());
      try {
        const rankPreference: RankPreference =
          sortBy === "distance" ? "DISTANCE" : "POPULARITY";
        const data = await fetchNearbyRestaurants(location, rankPreference);
        setRestaurants(data);
        if (surpriseMe && data.length > 0) {
          setSurprisePick(data[Math.floor(Math.random() * data.length)]);
        }
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    getRestaurants();
  }, [location, surpriseMe, sortBy]);

  function handleChipToggle(chip: FilterChip) {
    setActiveChips((prev) => {
      const next = new Set(prev);
      if (next.has(chip)) {
        next.delete(chip);
      } else {
        next.add(chip);
      }
      return next;
    });
  }

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      if (activeChips.has("openNow") && !r.openNow) return false;
      if (activeChips.has("under500m") && r.distance > 500) return false;
      if (activeChips.has("topRated") && (r.rating ?? 0) < 4.0) return false;
      return true;
    });
  }, [restaurants, activeChips]);

  function handlePickAgain() {
    const available = restaurants.filter((r) => !excludedIds.has(r.id));
    const pool = available.length > 0 ? available : restaurants;
    setSurprisePick(pool[Math.floor(Math.random() * pool.length)]);
  }

  function handleExclude() {
    if (!surprisePick) return;
    const newExcluded = new Set([...excludedIds, surprisePick.id]);
    setExcludedIds(newExcluded);
    const available = restaurants.filter((r) => !newExcluded.has(r.id));
    if (available.length > 0) {
      setSurprisePick(available[Math.floor(Math.random() * available.length)]);
    } else {
      // All excluded — reset and start over
      setExcludedIds(new Set());
      setSurprisePick(
        restaurants[Math.floor(Math.random() * restaurants.length)],
      );
    }
  }

  const geoErrorDetails = geoError ? getGeoErrorDetails(geoError) : null;

  return (
    <div>
      <div
        id="controls-container"
        style={{
          position: "sticky",
          top: "85px",
          zIndex: 50,
          backgroundColor: "var(--bg)",
        }}
      >
        {!location && !geoError && (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => {
                setSurpriseMe(false);
                getLocation();
              }}
              style={{ fontSize: "1.5rem" }}
            >
              FIND LUNCH
            </button>
            <button
              onClick={() => {
                setSurpriseMe(true);
                getLocation();
              }}
              style={{
                fontSize: "1.5rem",
                backgroundColor: "var(--accent)",
                color: "white",
              }}
            >
              SURPRISE ME
            </button>
          </div>
        )}

        {geoError && geoErrorDetails && (
          <div
            className="card"
            style={{
              backgroundColor: "var(--accent)",
              color: "white",
              marginBottom: "1rem",
            }}
          >
            <p style={{ fontWeight: "bold" }}>{geoErrorDetails.message}</p>
            <p
              style={{
                fontSize: "0.9rem",
                marginTop: "0.25rem",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {geoErrorDetails.hint}
            </p>
            <button
              onClick={getLocation}
              style={{
                marginTop: "1rem",
                backgroundColor: "white",
                color: "black",
              }}
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {location && (
          <FilterControls
            sortBy={sortBy}
            onSortChange={setSortBy}
            activeChips={activeChips}
            onChipToggle={handleChipToggle}
          />
        )}
      </div>

      {loading && (
        <div>
          {[1, 2, 3].map((n) => (
            <RestaurantCardSkeleton key={n} />
          ))}
        </div>
      )}

      {apiError && (
        <div
          className="card"
          style={{ backgroundColor: "var(--accent)", color: "white" }}
        >
          <p>API ERROR: {apiError}</p>
        </div>
      )}

      {!loading && surpriseMe && surprisePick && (
        <div>
          <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            <h2>Your Pick</h2>
            <div className="surprise-why">
              <span className="surprise-tag">
                {surprisePick.distance}m away
              </span>
              {surprisePick.rating && (
                <span className="surprise-tag">★ {surprisePick.rating}</span>
              )}
              {surprisePick.openNow === true && (
                <span className="surprise-tag surprise-tag--open">
                  Open now
                </span>
              )}
              {surprisePick.openNow === false && (
                <span className="surprise-tag surprise-tag--closed">
                  Closed
                </span>
              )}
            </div>
          </div>
          <div key={surprisePick.id} className="surprise-card">
            <RestaurantCard restaurant={surprisePick} />
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: "1rem",
              marginBottom: "2rem",
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button onClick={handlePickAgain}>PICK AGAIN</button>
            <button
              onClick={handleExclude}
              style={{ backgroundColor: "white" }}
            >
              EXCLUDE THIS
            </button>
            <button onClick={() => setSurpriseMe(false)}>VIEW ALL</button>
          </div>
        </div>
      )}

      {!loading && !surpriseMe && filteredRestaurants.length > 0 && (
        <div>
          {filteredRestaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}

      {!loading && location && !apiError && restaurants.length === 0 && (
        <div className="card">
          <p style={{ marginBottom: "0.5rem" }}>No restaurants found nearby.</p>
          <p
            style={{
              fontSize: "0.9rem",
              fontFamily: "Arial, sans-serif",
              color: "#555",
            }}
          >
            Try switching to <strong>Most popular</strong> sort or searching
            from a different location.
          </p>
        </div>
      )}

      {!loading &&
        location &&
        !apiError &&
        restaurants.length > 0 &&
        filteredRestaurants.length === 0 && (
          <div className="card">
            <p style={{ marginBottom: "0.5rem" }}>
              No restaurants match your filters.
            </p>
            <p
              style={{
                fontSize: "0.9rem",
                fontFamily: "Arial, sans-serif",
                color: "#555",
              }}
            >
              Try removing a filter to see more options.
            </p>
            <button
              onClick={() => setActiveChips(new Set())}
              style={{ marginTop: "0.75rem" }}
            >
              CLEAR FILTERS
            </button>
          </div>
        )}
    </div>
  );
}
