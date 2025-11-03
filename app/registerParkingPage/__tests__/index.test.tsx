import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useAuth } from "@/contexts/AuthContext";
import RegisterParkingScreen from "../index";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { router } from "expo-router";
import { generateAccessCode } from "../_helpers";

jest.mock("@/contexts/AuthContext");
jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
    replace: jest.fn(),
  },
}));
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
}));
jest.mock("@/config/firebaseConfig", () => ({
  db: {},
}));
jest.mock("../_helpers", () => ({
  generateAccessCode: jest.fn(() => "ABC123"),
  getErrorMessage: jest.fn((code) => `Error: ${code}`),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockRouter = router;
const mockAddDoc = addDoc as jest.MockedFunction<typeof addDoc>;
const mockCollection = collection as jest.MockedFunction<typeof collection>;
const mockGenerateAccessCode = generateAccessCode as jest.MockedFunction<
  typeof generateAccessCode
>;

describe("RegisterParkingScreen", () => {
  let mockRegisterAdmin: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRegisterAdmin = jest.fn().mockResolvedValue("user-id-123");
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
    mockCollection.mockReturnValue({} as any);
    mockAddDoc.mockResolvedValue({ id: "parking-id" } as any);
  });

  it("renders loading indicator when loading", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoggedIn: false,
      loading: true,
      login: jest.fn(),
      register: jest.fn(),
      registerAdmin: mockRegisterAdmin,
      logout: jest.fn(),
      error: null,
    });
    const { getByTestId } = render(<RegisterParkingScreen />);
    expect(getByTestId("loading-indicator")).toBeDefined();
  });

  it("renders all form fields and buttons when not loading", () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(
      <RegisterParkingScreen />
    );

    expect(getByText("Zarejestruj swój parking")).toBeDefined();
    expect(getByText("Utwórz konto administratora parkingu")).toBeDefined();
    expect(getByText("Dane konta administratora")).toBeDefined();
    expect(getByText("Dane parkingu")).toBeDefined();

    expect(getByPlaceholderText("Email")).toBeDefined();
    expect(getByPlaceholderText("Nazwa użytkownika")).toBeDefined();
    expect(getByPlaceholderText("Hasło")).toBeDefined();
    expect(getByPlaceholderText("Nazwa parkingu")).toBeDefined();
    expect(getByPlaceholderText("Adres parkingu")).toBeDefined();
    expect(
      getByPlaceholderText("URL zdjęcia parkingu (opcjonalne)")
    ).toBeDefined();

    expect(getByTestId("register-button")).toBeDefined();
    expect(getByTestId("back-button")).toBeDefined();
  });

  it("updates email input value when typing", () => {
    const { getByPlaceholderText, getByDisplayValue } = render(
      <RegisterParkingScreen />
    );
    const emailInput = getByPlaceholderText("Email");
    fireEvent.changeText(emailInput, "test@example.com");
    expect(getByDisplayValue("test@example.com")).toBeDefined();
  });

  it("updates password input value when typing", () => {
    const { getByPlaceholderText, getByDisplayValue } = render(
      <RegisterParkingScreen />
    );
    const passwordInput = getByPlaceholderText("Hasło");
    fireEvent.changeText(passwordInput, "password123");
    expect(getByDisplayValue("password123")).toBeDefined();
  });

  it("auto-fills display name from email", async () => {
    const { getByPlaceholderText, getByDisplayValue } = render(
      <RegisterParkingScreen />
    );
    const emailInput = getByPlaceholderText("Email");
    fireEvent.changeText(emailInput, "testuser@example.com");

    await waitFor(() => {
      expect(getByDisplayValue("testuser")).toBeDefined();
    });
  });

  it("updates display name input value when typing", () => {
    const { getByPlaceholderText, getByDisplayValue } = render(
      <RegisterParkingScreen />
    );
    const displayNameInput = getByPlaceholderText("Nazwa użytkownika");
    fireEvent.changeText(displayNameInput, "newuser");
    expect(getByDisplayValue("newuser")).toBeDefined();
  });

  it("updates parking name input value when typing", () => {
    const { getByPlaceholderText, getByDisplayValue } = render(
      <RegisterParkingScreen />
    );
    const parkingNameInput = getByPlaceholderText("Nazwa parkingu");
    fireEvent.changeText(parkingNameInput, "Test Parking");
    expect(getByDisplayValue("Test Parking")).toBeDefined();
  });

  it("updates parking address input value when typing", () => {
    const { getByPlaceholderText, getByDisplayValue } = render(
      <RegisterParkingScreen />
    );
    const parkingAddressInput = getByPlaceholderText("Adres parkingu");
    fireEvent.changeText(parkingAddressInput, "Test Address 123");
    expect(getByDisplayValue("Test Address 123")).toBeDefined();
  });

  it("updates parking image input value when typing", () => {
    const { getByPlaceholderText, getByDisplayValue } = render(
      <RegisterParkingScreen />
    );
    const parkingImageInput = getByPlaceholderText(
      "URL zdjęcia parkingu (opcjonalne)"
    );
    fireEvent.changeText(parkingImageInput, "https://example.com/image.jpg");
    expect(getByDisplayValue("https://example.com/image.jpg")).toBeDefined();
  });

  it("calls registerAdmin with correct values when register button is pressed", async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <RegisterParkingScreen />
    );
    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Hasło"), "password123");
    fireEvent.changeText(getByPlaceholderText("Nazwa użytkownika"), "testuser");
    fireEvent.changeText(
      getByPlaceholderText("Nazwa parkingu"),
      "Test Parking"
    );
    fireEvent.changeText(
      getByPlaceholderText("Adres parkingu"),
      "Test Address"
    );
    fireEvent.changeText(
      getByPlaceholderText("URL zdjęcia parkingu (opcjonalne)"),
      "https://example.com/image.jpg"
    );

    const registerButton = getByTestId("register-button");
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(mockRegisterAdmin).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        "testuser",
        "ABC123"
      );
      expect(mockAddDoc).toHaveBeenCalledWith(
        {},
        {
          name: "Test Parking",
          address: "Test Address",
          img: "https://example.com/image.jpg",
          ownerId: "user-id-123",
          createdAt: expect.any(String),
        }
      );
    });
  });

  it("calls router.back when back button is pressed", () => {
    const { getByTestId } = render(<RegisterParkingScreen />);
    const backButton = getByTestId("back-button");
    fireEvent.press(backButton);
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it("hides register button when loading", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoggedIn: false,
      loading: true,
      login: jest.fn(),
      register: jest.fn(),
      registerAdmin: mockRegisterAdmin,
      logout: jest.fn(),
      error: null,
    });
    const { queryByTestId } = render(<RegisterParkingScreen />);
    expect(queryByTestId("register-button")).toBeNull();
  });
});
