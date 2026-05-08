import { fetchNearbyRestaurants } from "./places";
import { vi, describe, it, expect, beforeEach } from "vitest";

describe("places service", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("should fetch and map restaurants correctly", async () => {
    const mockResponse = {
      places: [
        {
          id: "1",
          displayName: { text: "Pizza Place" },
          formattedAddress: "123 Pizza St",
          rating: 4.5,
          currentOpeningHours: { openNow: true },
          location: { latitude: 51.5, longitude: 0.1 },
        },
      ],
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const restaurants = await fetchNearbyRestaurants(
      { lat: 51.5, lng: 0.1 },
      "DISTANCE",
    );

    expect(restaurants).toHaveLength(1);
    expect(restaurants[0]).toEqual({
      id: "1",
      name: "Pizza Place",
      address: "123 Pizza St",
      rating: 4.5,
      openNow: true,
      lat: 51.5,
      lng: 0.1,
      distance: 0,
    });
  });

  it("should use POPULARITY rank preference when requested", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ places: [] }),
    } as Response);

    await fetchNearbyRestaurants({ lat: 51.5, lng: 0.1 }, "POPULARITY");

    expect(fetch).toHaveBeenCalledTimes(1);
    const fetchCall = vi.mocked(fetch).mock.calls[0];
    const requestInit = fetchCall[1] as RequestInit;
    const body = JSON.parse(requestInit.body as string);
    expect(body.rankPreference).toBe("POPULARITY");
  });

  it("should throw error on API failure", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      statusText: "Forbidden",
    } as Response);

    await expect(
      fetchNearbyRestaurants({ lat: 51.5, lng: 0.1 }, "DISTANCE"),
    ).rejects.toThrow("API error: Forbidden");
  });
});
