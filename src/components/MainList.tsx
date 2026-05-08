import { useState, useEffect } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import {
  fetchNearbyRestaurants,
  type RankPreference,
  type Restaurant,
} from "../services/places";
import { RestaurantCard } from "./RestaurantCard";
import { FilterControls, type SortOption } from "./FilterControls";

export function MainList() {
  const { location, error: geoError, getLocation } = useGeolocation();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [surpriseMe, setSurpriseMe] = useState(false);
  const [surprisePick, setSurprisePick] = useState<Restaurant | null>(null);

  // Sort state
  const [sortBy, setSortBy] = useState<SortOption>("distance");

  useEffect(() => {
    async function getRestaurants() {
      if (!location) return;
      setLoading(true);
      setApiError(null);
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

        {geoError && (
          <div
            className="card"
            style={{
              backgroundColor: "var(--accent)",
              color: "white",
              marginBottom: "1rem",
            }}
          >
            <p>ERROR: {geoError}</p>
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
          <FilterControls sortBy={sortBy} onSortChange={setSortBy} />
        )}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2>SEARCHING...</h2>
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
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <h2>YOUR PICK</h2>
          </div>
          <RestaurantCard restaurant={surprisePick} />
          <div
            style={{
              textAlign: "center",
              marginTop: "1rem",
              marginBottom: "2rem",
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => {
                if (restaurants.length > 0) {
                  setSurprisePick(
                    restaurants[Math.floor(Math.random() * restaurants.length)],
                  );
                }
              }}
            >
              PICK AGAIN
            </button>
            <button onClick={() => setSurpriseMe(false)}>VIEW ALL</button>
          </div>
        </div>
      )}

      {!loading && !surpriseMe && restaurants.length > 0 && (
        <div>
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}

      {!loading && location && restaurants.length === 0 && !apiError && (
        <div className="card">
          <p>No restaurants found nearby. Maybe try a different spot?</p>
        </div>
      )}
    </div>
  );
}
