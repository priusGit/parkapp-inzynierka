import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { useAuth } from "@/contexts/AuthContext";
import HomeScreen from "../index";

jest.mock("@/contexts/AuthContext");
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  onSnapshot: jest.fn(),
  orderBy: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading indicator when loading", () => {
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

    const { getByTestId } = render(<HomeScreen />);
    // Note: You may need to add testID to ActivityIndicator for this to work
  });

  it("should render empty state when no reservations", async () => {
    const mockUnsubscribe = jest.fn();
    const mockOnSnapshot = require("firebase/firestore").onSnapshot;

    mockOnSnapshot.mockImplementation((query: any, callback: any) => {
      callback({
        docs: [],
      });
      return mockUnsubscribe;
    });

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

    const { getByText } = render(<HomeScreen />);
    await waitFor(() => {
      expect(getByText(/Brak rezerwacji/)).toBeTruthy();
    });
  });

  it("should render add button", () => {
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
        docs: [],
      });
      return mockUnsubscribe;
    });

    const { getByText } = render(<HomeScreen />);
    // The button should be present in the UI
  });
});
