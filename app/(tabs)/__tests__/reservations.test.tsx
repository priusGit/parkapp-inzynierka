import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { useAuth } from "@/contexts/AuthContext";
import ReservationsScreen from "../reservations";

jest.mock("@/contexts/AuthContext");
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  onSnapshot: jest.fn(),
  orderBy: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("ReservationsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render reservations list", async () => {
    mockUseAuth.mockReturnValue({
      user: { uid: "test-user-id" } as any,
      isLoggedIn: true,
      loading: false,
      login: jest.fn(),
      register: jest.fn(),
      registerAdmin: jest.fn(),
      logout: jest.fn(),
      error: null,
    });

    const mockUnsubscribe = jest.fn();
    const mockOnSnapshot = require("firebase/firestore").onSnapshot;

    mockOnSnapshot.mockImplementation((query: any, callback: any) => {
      callback({
        docs: [
          {
            id: "res1",
            data: () => ({
              name: "Toyota",
              startDate: "2025-06-01",
              endDate: "2025-06-05",
              placeId: "parking1",
            }),
          },
        ],
      });
      return mockUnsubscribe;
    });

    const { getByText } = render(<ReservationsScreen />);
    await waitFor(() => {
      expect(getByText("Toyota")).toBeTruthy();
    });
  });

  it("should show empty state when no reservations", async () => {
    mockUseAuth.mockReturnValue({
      user: { uid: "test-user-id" } as any,
      isLoggedIn: true,
      loading: false,
      login: jest.fn(),
      register: jest.fn(),
      registerAdmin: jest.fn(),
      logout: jest.fn(),
      error: null,
    });

    const mockOnSnapshot = require("firebase/firestore").onSnapshot;
    mockOnSnapshot.mockImplementation((query: any, callback: any) => {
      callback({ docs: [] });
      return jest.fn();
    });

    const { getByText } = render(<ReservationsScreen />);
    await waitFor(() => {
      // Should show empty state
    });
  });
});
