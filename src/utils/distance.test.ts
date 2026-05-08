import { calculateDistance } from "./distance";
import { describe, it, expect } from "vitest";

describe("calculateDistance", () => {
  it("should calculate distance between two points correctly (Haversine)", () => {
    // New York to London ~5570km
    const nyc = { lat: 40.7128, lng: -74.006 };
    const london = { lat: 51.5074, lng: -0.1278 };

    const distance = calculateDistance(nyc, london);

    // Allow small margin of error for Earth curvature approximations
    expect(distance).toBeGreaterThan(5560000);
    expect(distance).toBeLessThan(5580000);
  });

  it("should return 0 for same point", () => {
    const p = { lat: 10, lng: 10 };
    expect(calculateDistance(p, p)).toBe(0);
  });
});
