import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useAuth } from "@/contexts/AuthContext";
import AddReservationScreen from "../index";
import { router } from "expo-router";
import { getDocs, getDoc, addDoc } from "firebase/firestore";

jest.mock("@/contexts/AuthContext");
jest.mock("expo-router", () => ({
  router: { back: jest.fn() },
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockRouter = router;
const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
const mockAddDoc = addDoc as jest.MockedFunction<typeof addDoc>;

describe("AddReservationScreen", () => {
  const mockUser = {
    uid: "test-user-id",
    email: "[test@example.com](mailto:test@example.com)",
  } as any;

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
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ role: "user", parkingOwnerId: "owner-id" }),
    } as any);
    mockAddDoc.mockResolvedValue({ id: "reservation-id" } as any);
  });

  it("renders all form elements when loaded", async () => {
    mockGetDocs
      .mockResolvedValueOnce({ docs: [] } as any)
      .mockResolvedValueOnce({ docs: [] } as any);
    const { getByText, getByTestId } = render(<AddReservationScreen />);
    await waitFor(() => {
      expect(getByText("Nowa rezerwacja")).toBeDefined();
      expect(getByText("Wybierz pojazd")).toBeDefined();
      expect(getByText("Typ rezerwacji")).toBeDefined();
      expect(getByText("Wybierz parking")).toBeDefined();
      expect(getByTestId("submit-button")).toBeDefined();
      expect(getByTestId("back-button")).toBeDefined();
    });
  });

  it("calls router.back when back button is pressed", async () => {
    mockGetDocs
      .mockResolvedValueOnce({ docs: [] } as any)
      .mockResolvedValueOnce({ docs: [] } as any);
    const { getByTestId } = render(<AddReservationScreen />);
    await waitFor(() => {
      fireEvent.press(getByTestId("back-button"));
      expect(mockRouter.back).toHaveBeenCalledTimes(1);
    });
  });

  it("renders vehicles and parkings correctly and submits with correct data", async () => {
    mockGetDocs
      .mockResolvedValueOnce({
        docs: [
          { id: "vehicle1", data: () => ({ name: "Toyota Corolla" }) },
          { id: "vehicle2", data: () => ({ name: "Honda Civic" }) },
        ],
      } as any)
      .mockResolvedValueOnce({
        docs: [
          {
            id: "parking1",
            data: () => ({ name: "Test Parking", address: "Addr" }),
          } as any,
        ],
      } as any);

    const { getByText, findByTestId, getAllByText, getByTestId } = render(
      <AddReservationScreen />
    );

    await waitFor(() => {
      expect(getByText("Toyota Corolla")).toBeDefined();
      expect(getByText("Honda Civic")).toBeDefined();
      expect(getByText("Test Parking")).toBeDefined();
    });

    fireEvent.press(getByText("Toyota Corolla"));

    const dateButtons = getAllByText("Wybierz datę");
    expect(dateButtons.length).toBeGreaterThan(0);

    fireEvent.press(getByTestId("startDateButton"));
    const startDateTimePicker = await findByTestId("startDateTimePicker");
    fireEvent.press(startDateTimePicker);
    fireEvent(startDateTimePicker, "onChange", {
      nativeEvent: { timestamp: "06/01/2025" },
    });
    fireEvent.press(getByTestId("endDateButton"));
    const endDateTimePicker = await findByTestId("endDateTimePicker");
    fireEvent.press(endDateTimePicker);
    fireEvent(endDateTimePicker, "onChange", {
      nativeEvent: { timestamp: "06/06/2025" },
    });

    fireEvent.press(getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockAddDoc).toHaveBeenCalled();
      const callArgs = mockAddDoc.mock.calls[0];
      expect(callArgs[1]).toMatchObject({
        name: "Toyota Corolla",
        vehicleId: "vehicle1",
        type: "limited",
        placeId: "parking1",
        userId: "test-user-id",
        userEmail: "[test@example.com](mailto:test@example.com)",
        startDate: "2025-06-01",
        endDate: "2025-06-06",
      });
    });
  });
});
