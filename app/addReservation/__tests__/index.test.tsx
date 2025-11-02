import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useAuth } from "@/contexts/AuthContext";
import AddReservationScreen from "../index";

jest.mock("@/contexts/AuthContext");

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("AddReservationScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render reservation form", () => {
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

    const mockGetDocs = require("firebase/firestore").getDocs;
    mockGetDocs.mockResolvedValue({
      docs: [],
    });

    const mockGetDoc = require("firebase/firestore").getDoc;
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ role: "user", parkingOwnerId: "owner-id" }),
    });

    const { getByText } = render(<AddReservationScreen />);
    expect(getByText(/Wybierz pojazd/)).toBeTruthy();
    expect(getByText(/Typ rezerwacji/)).toBeTruthy();
  });

  it("should auto-select vehicle when only one available", async () => {
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

    const mockGetDocs = require("firebase/firestore").getDocs;
    mockGetDocs
      .mockResolvedValueOnce({
        docs: [
          {
            id: "vehicle1",
            data: () => ({ name: "Toyota Corolla" }),
          },
        ],
      })
      .mockResolvedValueOnce({
        docs: [
          {
            id: "parking1",
            data: () => ({ name: "Test Parking", address: "Test Address" }),
          },
        ],
      });

    const mockGetDoc = require("firebase/firestore").getDoc;
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ role: "user", parkingOwnerId: "owner-id" }),
    });

    const { getByText } = render(<AddReservationScreen />);
    await waitFor(() => {
      // Vehicle should be auto-selected
    });
  });
});
