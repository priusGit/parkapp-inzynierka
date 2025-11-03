import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useAuth } from "@/contexts/AuthContext";
import LoginScreen from "../../LoginPage";
import { router } from "expo-router";

jest.mock("@/contexts/AuthContext");
jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockRouter = router;

describe("LoginPage", () => {
  let mockLogin: jest.Mock;
  let mockRegister: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLogin = jest.fn().mockResolvedValue(undefined);
    mockRegister = jest.fn().mockResolvedValue(undefined);
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

  it("renders loading indicator when loading", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoggedIn: false,
      loading: true,
      login: mockLogin,
      register: mockRegister,
      registerAdmin: jest.fn(),
      logout: jest.fn(),
      error: null,
    });
    const { getByTestId } = render(<LoginScreen />);
    expect(getByTestId("loading-indicator")).toBeDefined();
  });

  it("renders all login form elements when not loading", () => {
    const { getAllByText, getByPlaceholderText, getByTestId } = render(
      <LoginScreen />
    );

    expect(getAllByText("ParkApp")[0]).toBeDefined();
    expect(getAllByText("Zaloguj się").length).toBeGreaterThan(0);
    expect(getByPlaceholderText("Email")).toBeDefined();
    expect(getByPlaceholderText("Hasło")).toBeDefined();
    expect(getByTestId("login-button")).toBeDefined();
    expect(getByTestId("switch-mode-button")).toBeDefined();
  });

  it("updates email input value when typing", () => {
    const { getByPlaceholderText, getByDisplayValue } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText("Email");
    fireEvent.changeText(emailInput, "test@example.com");
    expect(getByDisplayValue("test@example.com")).toBeDefined();
  });

  it("updates password input value when typing", () => {
    const { getByPlaceholderText, getByDisplayValue } = render(<LoginScreen />);
    const passwordInput = getByPlaceholderText("Hasło");
    fireEvent.changeText(passwordInput, "password123");
    expect(getByDisplayValue("password123")).toBeDefined();
  });

  it("auto-fills display name from email when switching to register mode", async () => {
    const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText("Email");
    fireEvent.changeText(emailInput, "testuser@example.com");

    const switchButton = getByTestId("switch-mode-button");
    fireEvent.press(switchButton);

    await waitFor(() => {
      const displayNameInput = getByPlaceholderText("Nazwa użytkownika");
      expect(displayNameInput.props.value).toBe("testuser");
    });
  });

  it("switches to register mode and shows all register fields", () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <LoginScreen />
    );
    const switchButton = getByTestId("switch-mode-button");
    fireEvent.press(switchButton);

    expect(getByText("Utwórz nowe konto")).toBeDefined();
    expect(getByPlaceholderText("Email")).toBeDefined();
    expect(getByPlaceholderText("Nazwa użytkownika")).toBeDefined();
    expect(getByPlaceholderText("Kod dostępu (6 znaków)")).toBeDefined();
    expect(getByPlaceholderText("Hasło")).toBeDefined();
    expect(getByTestId("register-parking-button")).toBeDefined();
  });

  it("switches back to login mode", () => {
    const { getAllByText, getByTestId, queryByPlaceholderText } = render(
      <LoginScreen />
    );
    const switchButton = getByTestId("switch-mode-button");
    fireEvent.press(switchButton);
    fireEvent.press(switchButton);

    expect(getAllByText("Zaloguj się").length).toBeGreaterThan(0);
    expect(queryByPlaceholderText("Nazwa użytkownika")).toBeNull();
    expect(queryByPlaceholderText("Kod dostępu (6 znaków)")).toBeNull();
  });

  it("updates display name input value when typing in register mode", async () => {
    const { getByPlaceholderText, getByTestId, getByDisplayValue } = render(
      <LoginScreen />
    );
    const switchButton = getByTestId("switch-mode-button");
    fireEvent.press(switchButton);

    await waitFor(() => {
      const displayNameInput = getByPlaceholderText("Nazwa użytkownika");
      fireEvent.changeText(displayNameInput, "newuser");
      expect(getByDisplayValue("newuser")).toBeDefined();
    });
  });

  it("updates access code input value when typing", async () => {
    const { getByPlaceholderText, getByTestId, getByDisplayValue } = render(
      <LoginScreen />
    );
    const switchButton = getByTestId("switch-mode-button");
    fireEvent.press(switchButton);

    await waitFor(() => {
      const accessCodeInput = getByPlaceholderText("Kod dostępu (6 znaków)");
      fireEvent.changeText(accessCodeInput, "ABC123");
      expect(getByDisplayValue("ABC123")).toBeDefined();
    });
  });

  it("calls login with correct values when login button is pressed", async () => {
    const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Hasło"), "password123");

    const loginButton = getByTestId("login-button");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
      expect(mockRouter.replace).toHaveBeenCalledWith("/(tabs)");
    });
  });

  it("calls register with correct values when register button is pressed", async () => {
    const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);
    const switchButton = getByTestId("switch-mode-button");
    fireEvent.press(switchButton);

    await waitFor(() => {
      expect(getByPlaceholderText("Nazwa użytkownika")).toBeDefined();
    });

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Hasło"), "password123");
    fireEvent.changeText(getByPlaceholderText("Nazwa użytkownika"), "testuser");
    fireEvent.changeText(
      getByPlaceholderText("Kod dostępu (6 znaków)"),
      "abc123"
    );

    const registerButton = getByTestId("login-button");
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        "testuser",
        "ABC123"
      );
      expect(mockRouter.replace).toHaveBeenCalledWith("/(tabs)");
    });
  });

  it("calls router.push when register parking button is pressed", async () => {
    const { getByTestId } = render(<LoginScreen />);
    const switchButton = getByTestId("switch-mode-button");
    fireEvent.press(switchButton);

    await waitFor(() => {
      expect(getByTestId("register-parking-button")).toBeDefined();
    });

    const registerParkingButton = getByTestId("register-parking-button");
    fireEvent.press(registerParkingButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/registerParkingPage");
  });

  it("hides form buttons when loading", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoggedIn: false,
      loading: true,
      login: mockLogin,
      register: mockRegister,
      registerAdmin: jest.fn(),
      logout: jest.fn(),
      error: null,
    });
    const { queryByTestId } = render(<LoginScreen />);
    expect(queryByTestId("login-button")).toBeNull();
    expect(queryByTestId("switch-mode-button")).toBeNull();
  });
});
