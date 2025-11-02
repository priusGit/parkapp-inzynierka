import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import ReservationDetailsScreen from "../index";

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({
    name: "Toyota Corolla",
    startDate: "2025-06-01",
    endDate: "2025-06-05",
    placeId: "parking1",
  }),
  router: {
    back: jest.fn(),
  },
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

describe("ReservationDetailsScreen", () => {
  it("should render reservation details", async () => {
    const mockGetDoc = require("firebase/firestore").getDoc;
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        name: "Test Parking",
        address: "Test Address",
        img: "test.jpg",
      }),
    });

    const { getByText } = render(<ReservationDetailsScreen />);
    await waitFor(() => {
      expect(getByText("Toyota Corolla")).toBeTruthy();
    });
  });

  it("should display parking information", async () => {
    const mockGetDoc = require("firebase/firestore").getDoc;
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        name: "Test Parking",
        address: "Test Address",
        img: "test.jpg",
      }),
    });

    const { getByText } = render(<ReservationDetailsScreen />);
    await waitFor(() => {
      expect(getByText("Test Parking")).toBeTruthy();
    });
  });

  it("should have navigate button", async () => {
    const mockGetDoc = require("firebase/firestore").getDoc;
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        name: "Test Parking",
        address: "Test Address",
        img: "test.jpg",
      }),
    });

    const { getByText } = render(<ReservationDetailsScreen />);
    await waitFor(() => {
      expect(getByText("Nawiguj")).toBeTruthy();
    });
  });
});
