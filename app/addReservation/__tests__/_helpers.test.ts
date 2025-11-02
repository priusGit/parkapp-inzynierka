import {
  formatDate,
  formatDateForFirestore,
  calculateMonthEndDate,
} from "../_helpers";

describe("addReservation helpers", () => {
  describe("formatDate", () => {
    it("should format date to Polish locale format", () => {
      const date = new Date(2025, 5, 15); // June 15, 2025
      const result = formatDate(date);
      expect(result).toContain("czerwca");
      expect(result).toContain("2025");
    });

    it("should return empty string for null date", () => {
      const result = formatDate(null);
      expect(result).toBe("");
    });
  });

  describe("formatDateForFirestore", () => {
    it("should format date to YYYY-MM-DD format", () => {
      const date = new Date(2025, 5, 15); // June 15, 2025
      const result = formatDateForFirestore(date);
      expect(result).toBe("2025-06-15");
    });

    it("should add leading zeros for single digit days and months", () => {
      const date = new Date(2025, 0, 5); // January 5, 2025
      const result = formatDateForFirestore(date);
      expect(result).toBe("2025-01-05");
    });
  });

  describe("calculateMonthEndDate", () => {
    it("should return last day of the month", () => {
      const startDate = new Date(2025, 5, 15); // June 15, 2025
      const result = calculateMonthEndDate(startDate);
      expect(result.getDate()).toBe(30);
      expect(result.getMonth()).toBe(5);
    });

    it("should handle months with 31 days", () => {
      const startDate = new Date(2025, 0, 15); // January 15, 2025
      const result = calculateMonthEndDate(startDate);
      expect(result.getDate()).toBe(31);
    });

    it("should handle February in leap year", () => {
      const startDate = new Date(2024, 1, 15); // February 15, 2024 (leap year)
      const result = calculateMonthEndDate(startDate);
      expect(result.getDate()).toBe(29);
    });
  });
});
