import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import { useAuth } from "@/contexts/AuthContext";
import ClientsScreen from "../index";

jest.mock("@/contexts/AuthContext");
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("ClientsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show error message for non-admin users", async () => {
    const mockGetDoc = require("firebase/firestore").getDoc;
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ role: "user" }),
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

    const { getByText } = render(<ClientsScreen />);
    await waitFor(() => {
      expect(
        getByText(/Ta strona jest dostępna tylko dla administratorów/)
      ).toBeTruthy();
    });
  });

  it("should display access code for admin users", async () => {
    const mockGetDoc = require("firebase/firestore").getDoc;
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ role: "admin", accessCode: "ABC123" }),
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

    const { getByText } = render(<ClientsScreen />);
    await waitFor(() => {
      expect(getByText("ABC123")).toBeTruthy();
    });
  });

  it("should display clients list for admin", async () => {
    const mockGetDoc = require("firebase/firestore").getDoc;
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ role: "admin", accessCode: "ABC123" }),
    });

    const mockGetDocs = require("firebase/firestore").getDocs;
    mockGetDocs.mockResolvedValue({
      docs: [
        {
          id: "client1",
          data: () => ({
            displayName: "Jan Kowalski",
            email: "jan@example.com",
            createdAt: "2025-01-01",
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

    const { getByText } = render(<ClientsScreen />);
    await waitFor(() => {
      expect(getByText("Jan Kowalski")).toBeTruthy();
      expect(getByText("jan@example.com")).toBeTruthy();
    });
  });
});
