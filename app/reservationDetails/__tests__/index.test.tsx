import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ReservationDetailsScreen from "../index";
import { useParkingDetails } from "../_hooks";
import { openNavigation } from "@/helpers/openNavigation";
import { useLocalSearchParams, router } from "expo-router";

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
  router: {
    back: jest.fn(),
  },
}));

jest.mock("../_hooks");
jest.mock("@/helpers/openNavigation");

const mockUseLocalSearchParams = useLocalSearchParams as jest.MockedFunction<
  typeof useLocalSearchParams
>;
const mockRouter = router;
const mockUseParkingDetails = useParkingDetails as jest.MockedFunction<
  typeof useParkingDetails
>;
const mockOpenNavigation = openNavigation as jest.MockedFunction<
  typeof openNavigation
>;

describe("ReservationDetailsScreen", () => {
  const defaultSearchParams = {
    name: "Toyota Corolla",
    startDate: "2025-06-01",
    endDate: "2025-06-05",
    placeId: "parking1",
  };

  const defaultParking = {
    name: "Test Parking",
    address: "Test Address 123",
    img: "https://example.com/parking.jpg",
  };

  const getDefaultMockParkingDetails = (overrides = {}) => ({
    parking: defaultParking,
    loading: false,
    navigate: jest.fn(),
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseLocalSearchParams.mockReturnValue(defaultSearchParams);
    mockUseParkingDetails.mockReturnValue(getDefaultMockParkingDetails());
  });

  it("renders loading indicator when loading", () => {
    mockUseParkingDetails.mockReturnValue(
      getDefaultMockParkingDetails({ loading: true })
    );
    const { getByTestId } = render(<ReservationDetailsScreen />);
    expect(getByTestId("loading-indicator")).toBeDefined();
  });

  it("renders all reservation details when data is loaded", () => {
    const { getByText, getByTestId } = render(<ReservationDetailsScreen />);

    expect(getByText("Szczegóły rezerwacji")).toBeDefined();
    expect(getByText("Toyota Corolla")).toBeDefined();
    expect(getByText("Od:")).toBeDefined();
    expect(getByText("2025-06-01")).toBeDefined();
    expect(getByText("Do:")).toBeDefined();
    expect(getByText("2025-06-05")).toBeDefined();
    expect(getByText("Test Parking")).toBeDefined();
    const parkingImage = getByTestId("parking-image");
    expect(parkingImage).toBeDefined();
    expect(parkingImage.props.source.uri).toBe(
      "https://example.com/parking.jpg"
    );
    expect(getByText("Nawiguj")).toBeDefined();
  });

  it("calls router.back when back button is pressed", () => {
    const { getByTestId } = render(<ReservationDetailsScreen />);
    const backButton = getByTestId("back-button");
    fireEvent.press(backButton);
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it("calls navigate function from hook when navigate button is pressed", () => {
    const mockNavigate = jest.fn();
    mockUseParkingDetails.mockReturnValue(
      getDefaultMockParkingDetails({ navigate: mockNavigate })
    );
    const { getByText } = render(<ReservationDetailsScreen />);
    const navigateButton = getByText("Nawiguj");
    fireEvent.press(navigateButton);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it("renders different reservation data correctly", () => {
    mockUseLocalSearchParams.mockReturnValue({
      name: "Honda Civic",
      startDate: "2025-07-15",
      endDate: "2025-07-20",
      placeId: "parking2",
    });
    const { getByText } = render(<ReservationDetailsScreen />);
    expect(getByText("Honda Civic")).toBeDefined();
    expect(getByText("Od:")).toBeDefined();
    expect(getByText("2025-07-15")).toBeDefined();
    expect(getByText("Do:")).toBeDefined();
    expect(getByText("2025-07-20")).toBeDefined();
  });
});
