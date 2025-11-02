import { getDate, getPlaceName, getPlace } from "../homeHelpers";
import { PLACES } from "@/constants/Data";

describe("homeHelpers", () => {
  describe("getDate", () => {
    it("should format date to DD.MM format", () => {
      const dateString = "2025-06-15";
      const result = getDate(dateString);
      expect(result).toBe("15.06");
    });

    it("should add leading zero for single digit days", () => {
      const dateString = "2025-06-05";
      const result = getDate(dateString);
      expect(result).toBe("05.06");
    });

    it("should add leading zero for single digit months", () => {
      const dateString = "2025-01-15";
      const result = getDate(dateString);
      expect(result).toBe("15.01");
    });
  });

  describe("getPlaceName", () => {
    it("should return place name for existing ID", () => {
      const placeId = 1;
      const result = getPlaceName(placeId);
      expect(result).toBe(PLACES[0].name);
    });

    it("should return default name for non-existing ID", () => {
      const placeId = 999;
      const result = getPlaceName(placeId);
      expect(result).toBe("Parking (sprawdź szczegóły)");
    });
  });

  describe("getPlace", () => {
    it("should return place object for existing ID", () => {
      const placeId = 1;
      const result = getPlace(placeId);
      expect(result).toEqual(PLACES[0]);
    });

    it("should return default object for non-existing ID", () => {
      const placeId = 999;
      const result = getPlace(placeId);
      expect(result).toEqual({
        id: 0,
        name: "Parking",
        adress: "Nieznany",
        img: "https://i.imgur.com/F7PBwz3J.png",
      });
    });
  });
});
