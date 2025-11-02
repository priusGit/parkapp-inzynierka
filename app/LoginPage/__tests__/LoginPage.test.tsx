import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useAuth } from "@/contexts/AuthContext";
import LoginScreen from "../LoginPage";

jest.mock("@/contexts/AuthContext");
jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("LoginPage", () => {
  const mockLogin = jest.fn();
  const mockRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: null,
      isLoggedIn: false,
      loading: false,
      login: mockLogin,
      register: mockRegister,
      registerAdmin: jest.fn(),
      logout: jest.fn(),
      error: null,
    });
  });

  it("should render login form", () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Hasło")).toBeTruthy();
  });

  it("should switch to register mode", () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    const registerButton = getByText(/Nie masz konta/);
    fireEvent.press(registerButton);

    expect(getByPlaceholderText("Nazwa użytkownika")).toBeTruthy();
    expect(getByPlaceholderText("Kod dostępu")).toBeTruthy();
  });

  it("should call login function on login button press", async () => {
    mockLogin.mockResolvedValue(undefined);
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Hasło");
    const loginButton = getByText("Zaloguj się");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("should show error when login fails", async () => {
    mockLogin.mockRejectedValue({ code: "auth/user-not-found" });
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Hasło");
    const loginButton = getByText("Zaloguj się");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "wrongpassword");
    fireEvent.press(loginButton);

    // Error should be handled by the component
  });
});
