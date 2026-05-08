import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MainList } from "./MainList";
import { vi, describe, it, expect, beforeEach } from "vitest";
import * as geolocationHook from "../hooks/useGeolocation";
import * as placesService from "../services/places";
import type { RankPreference } from "../services/places";

vi.mock("../hooks/useGeolocation");
vi.mock("../services/places");

describe("MainList", () => {
  const mockGetLocation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(geolocationHook.useGeolocation).mockReturnValue({
      location: null,
      error: null,
      getLocation: mockGetLocation,
    });
  });

  it("should show initial state with find button", () => {
    render(<MainList />);
    expect(
      screen.getByRole("button", { name: /find lunch/i }),
    ).toBeInTheDocument();
  });

  it("should request popularity sort from the API when selected", async () => {
    vi.mocked(geolocationHook.useGeolocation).mockReturnValue({
      location: { lat: 51.5, lng: 0.1 },
      error: null,
      getLocation: mockGetLocation,
    });

    const mockRestaurants = [
      {
        id: "1",
        name: "Low Rating",
        distance: 100,
        rating: 2,
        address: "123 St",
        lat: 51.5,
        lng: 0.1,
        openNow: true,
      },
      {
        id: "2",
        name: "High Rating",
        distance: 200,
        rating: 5,
        address: "456 St",
        lat: 51.5,
        lng: 0.1,
        openNow: true,
      },
    ];
    vi.mocked(placesService.fetchNearbyRestaurants).mockImplementation(
      async (
        _location: { lat: number; lng: number },
        rankPreference: RankPreference = "DISTANCE",
      ) => {
        if (rankPreference === "POPULARITY") {
          return [mockRestaurants[1], mockRestaurants[0]];
        }
        return [mockRestaurants[0], mockRestaurants[1]];
      },
    );

    render(<MainList />);

    await waitFor(() => {
      expect(placesService.fetchNearbyRestaurants).toHaveBeenCalledWith(
        { lat: 51.5, lng: 0.1 },
        "DISTANCE",
      );
    });

    const sortSelect = screen.getByLabelText(/sort/i);
    fireEvent.change(sortSelect, { target: { value: "popularity" } });

    await waitFor(() => {
      expect(placesService.fetchNearbyRestaurants).toHaveBeenLastCalledWith(
        { lat: 51.5, lng: 0.1 },
        "POPULARITY",
      );
    });
  });
});
