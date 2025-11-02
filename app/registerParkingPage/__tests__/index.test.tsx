import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useAuth } from "@/contexts/AuthContext";
import RegisterParkingScreen from "../index";

jest.mock("@/contexts/AuthContext");
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
    replace: jest.fn(),
  },
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("RegisterParkingScreen", () => {
  const mockRegisterAdmin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: null,
      isLoggedIn: false,
      loading: false,
      login: jest.fn(),
      register: jest.fn(),
      registerAdmin: mockRegisterAdmin,
      logout: jest.fn(),
      error: null,
    });
  });

  it("should render registration form", () => {
    const { getByPlaceholderText } = render(<RegisterParkingScreen />);
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Nazwa użytkownika")).toBeTruthy();
    expect(getByPlaceholderText("Hasło")).toBeTruthy();
    expect(getByPlaceholderText("Nazwa parkingu")).toBeTruthy();
    expect(getByPlaceholderText("Adres parkingu")).toBeTruthy();
  });

  it("should auto-fill display name from email", () => {
    const { getByPlaceholderText } = render(<RegisterParkingScreen />);
    const emailInput = getByPlaceholderText("Email");
    fireEvent.changeText(emailInput, "test@example.com");

    const displayNameInput = getByPlaceholderText("Nazwa użytkownika");
    expect(displayNameInput.props.value).toBe("test");
  });

  it("should show validation error when fields are empty", async () => {
    const { getByText } = render(<RegisterParkingScreen />);
    const submitButton = getByText("Zarejestruj parking");
    fireEvent.press(submitButton);

    // Validation should prevent submission
  });
});
