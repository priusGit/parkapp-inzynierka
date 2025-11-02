import { getReservationsForDate } from "../date";

describe("date helpers", () => {
  const mockReservations = [
    {
      id: 1,
      type: "limited" as const,
      startDate: "2025-06-01",
      endDate: "2025-06-05",
      name: "Toyota",
      placeId: 1,
    },
    {
      id: 2,
      type: "monthly" as const,
      startDate: "2025-06-01",
      endDate: "2025-06-31",
      name: "Mazda",
      placeId: 1,
    },
    {
      id: 3,
      type: "limited" as const,
      startDate: "2025-06-10",
      endDate: "2025-06-15",
      name: "BMW",
      placeId: 2,
    },
  ];

  describe("getReservationsForDate", () => {
    it("should return limited reservations for date within range", () => {
      const dateStr = "2025-06-03";
      const result = getReservationsForDate(dateStr, mockReservations);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
    });

    it("should return monthly reservations for date in same month", () => {
      const dateStr = "2025-06-15";
      const result = getReservationsForDate(dateStr, mockReservations);
      expect(result.length).toBeGreaterThan(0);
      expect(result.some((r) => r.type === "monthly")).toBe(true);
    });

    it("should return empty array for date without reservations", () => {
      const dateStr = "2025-07-01";
      const result = getReservationsForDate(dateStr, mockReservations);
      expect(result).toHaveLength(0);
    });

    it("should return empty array when no reservations provided", () => {
      const dateStr = "2025-06-01";
      const result = getReservationsForDate(dateStr, []);
      expect(result).toHaveLength(0);
    });
  });
});
