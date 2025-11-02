import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { useAuth } from "@/contexts/AuthContext";
import NavigateScreen from "../navigate";

jest.mock("@/contexts/AuthContext");

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("NavigateScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render empty state when no parkings", async () => {
    const mockGetDoc = require("firebase/firestore").getDoc;
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ role: "admin" }),
    });

    const mockGetDocs = require("firebase/firestore").getDocs;
    mockGetDocs.mockResolvedValue({
      docs: [],
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

    const { getByText } = render(<NavigateScreen />);
    await waitFor(() => {
      expect(getByText(/Brak dostępnych parkingów/)).toBeTruthy();
    });
  });

  it("should render parking cards when parkings exist", async () => {
    const mockGetDoc = require("firebase/firestore").getDoc;
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ role: "admin" }),
    });

    const mockGetDocs = require("firebase/firestore").getDocs;
    mockGetDocs.mockResolvedValue({
      docs: [
        {
          id: "parking1",
          data: () => ({
            name: "Test Parking",
            address: "Test Address",
            img: "test.jpg",
          }),
        },
      ],
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

    const { getByText } = render(<NavigateScreen />);
    await waitFor(() => {
      expect(getByText("Test Parking")).toBeTruthy();
    });
  });
});
