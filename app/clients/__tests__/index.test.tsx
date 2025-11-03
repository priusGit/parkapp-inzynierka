import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { useAuth } from "@/contexts/AuthContext";
import ClientsScreen from "../index";
import { useClients } from "../_hooks";

jest.mock("@/contexts/AuthContext");
jest.mock("../_hooks");

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseClients = useClients as jest.MockedFunction<typeof useClients>;

describe("ClientsScreen", () => {
  const mockUser = { uid: "test-user-id" } as any;

  const getDefaultMockClients = (overrides = {}) => ({
    clients: [],
    loading: false,
    accessCode: "",
    isAdmin: false,
    copyAccessCode: jest.fn(),
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isLoggedIn: true,
      loading: false,
      login: jest.fn(),
      register: jest.fn(),
      registerAdmin: jest.fn(),
      logout: jest.fn(),
      error: null,
    });
    mockUseClients.mockReturnValue(getDefaultMockClients());
  });

  it("renders loading indicator when loading", () => {
    mockUseClients.mockReturnValue(getDefaultMockClients({ loading: true }));
    const { getByTestId } = render(<ClientsScreen />);
    expect(getByTestId("loading-indicator")).toBeDefined();
  });

  it("renders error message when user is not admin", () => {
    mockUseClients.mockReturnValue(
      getDefaultMockClients({ isAdmin: false, loading: false })
    );
    const { getByText } = render(<ClientsScreen />);
    expect(
      getByText(/Ta strona jest dostępna tylko dla administratorów/)
    ).toBeDefined();
  });

  it("renders access code section and empty state when admin has no clients", () => {
    mockUseClients.mockReturnValue(
      getDefaultMockClients({
        isAdmin: true,
        accessCode: "ABC123",
        clients: [],
      })
    );
    const { getByText, getByTestId } = render(<ClientsScreen />);

    expect(getByText("Kod zaproszeniowy")).toBeDefined();
    expect(getByText("ABC123")).toBeDefined();
    expect(getByText(/Udostępnij ten kod użytkownikom/)).toBeDefined();
    expect(getByText("Lista klientów (0)")).toBeDefined();
    expect(getByText("Brak klientów")).toBeDefined();
    expect(getByText(/Udostępnij kod zaproszeniowy/)).toBeDefined();
    expect(getByTestId("copy-access-code-button")).toBeDefined();
  });

  it("renders clients list when admin has clients", () => {
    const mockClients = [
      {
        id: "client1",
        displayName: "Jan Kowalski",
        email: "jan@example.com",
        createdAt: "2025-01-15T10:00:00Z",
      },
      {
        id: "client2",
        displayName: "Anna Nowak",
        email: "anna@example.com",
        createdAt: "2025-01-20T14:30:00Z",
      },
    ];

    mockUseClients.mockReturnValue(
      getDefaultMockClients({
        isAdmin: true,
        accessCode: "ABC123",
        clients: mockClients,
      })
    );
    const { getByText } = render(<ClientsScreen />);

    expect(getByText("ABC123")).toBeDefined();
    expect(getByText("Lista klientów (2)")).toBeDefined();
    expect(getByText("Jan Kowalski")).toBeDefined();
    expect(getByText("jan@example.com")).toBeDefined();
    expect(getByText("Anna Nowak")).toBeDefined();
    expect(getByText("anna@example.com")).toBeDefined();
  });

  it("calls copyAccessCode when copy button is pressed", () => {
    const mockCopyAccessCode = jest.fn();
    mockUseClients.mockReturnValue(
      getDefaultMockClients({
        isAdmin: true,
        accessCode: "ABC123",
        copyAccessCode: mockCopyAccessCode,
      })
    );
    const { getByTestId } = render(<ClientsScreen />);
    const copyButton = getByTestId("copy-access-code-button");
    fireEvent.press(copyButton);

    expect(mockCopyAccessCode).toHaveBeenCalledTimes(1);
  });

  it("displays formatted client join dates", () => {
    const mockClients = [
      {
        id: "client1",
        displayName: "Jan Kowalski",
        email: "jan@example.com",
        createdAt: "2025-01-15T10:00:00Z",
      },
    ];

    mockUseClients.mockReturnValue(
      getDefaultMockClients({
        isAdmin: true,
        clients: mockClients,
      })
    );
    const { getByText } = render(<ClientsScreen />);

    expect(getByText(/Dołączył:/)).toBeDefined();
  });
});
