import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { useAuth } from "@/contexts/AuthContext";
import VehiclesScreen from "../index";
import { useVehicles } from "../hooks";
import { addVehicle, updateVehicle, deleteVehicle } from "../_helpers";

jest.mock("@/contexts/AuthContext");
jest.mock("../hooks");
jest.mock("../_helpers");
jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));

const mockAddVehicle = addVehicle as jest.MockedFunction<typeof addVehicle>;
const mockUpdateVehicle = updateVehicle as jest.MockedFunction<
  typeof updateVehicle
>;
const mockDeleteVehicle = deleteVehicle as jest.MockedFunction<
  typeof deleteVehicle
>;

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseVehicles = useVehicles as jest.MockedFunction<typeof useVehicles>;

describe("VehiclesScreen", () => {
  const mockUser = { uid: "test-user-id" } as any;
  const mockSetShowAddForm = jest.fn();
  const mockSetNewVehicleName = jest.fn();
  const mockSetEditedName = jest.fn();
  const mockHandleAddVehicle = jest.fn();
  const mockCancelAdd = jest.fn();
  const mockStartEdit = jest.fn();
  const mockSaveEdit = jest.fn();
  const mockCancelEdit = jest.fn();
  const mockHandleDeleteVehicle = jest.fn();

  const getDefaultMockVehicles = (overrides = {}) => ({
    vehicles: [],
    loading: false,
    showAddForm: false,
    setShowAddForm: mockSetShowAddForm,
    newVehicleName: "",
    setNewVehicleName: mockSetNewVehicleName,
    addingVehicle: false,
    editingVehicle: null,
    editedName: "",
    setEditedName: mockSetEditedName,
    actions: {
      add: {
        submit: mockHandleAddVehicle,
        cancel: mockCancelAdd,
      },
      edit: {
        start: mockStartEdit,
        save: mockSaveEdit,
        cancel: mockCancelEdit,
      },
      delete: {
        remove: mockHandleDeleteVehicle,
      },
    },
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockAddVehicle.mockResolvedValue(undefined);
    mockUpdateVehicle.mockResolvedValue(undefined);
    mockDeleteVehicle.mockResolvedValue(undefined);

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

    mockUseVehicles.mockReturnValue(getDefaultMockVehicles());
  });

  it("renders header with title", () => {
    const { getByText } = render(<VehiclesScreen />);
    expect(getByText("Twoje Pojazdy")).toBeDefined();
  });

  it("renders loading indicator when loading", () => {
    mockUseVehicles.mockReturnValue(getDefaultMockVehicles({ loading: true }));
    const { queryByText } = render(<VehiclesScreen />);
    expect(queryByText("Dodaj pojazd")).toBeNull();
    expect(queryByText("Brak pojazdów")).toBeNull();
  });

  it("renders empty state when no vehicles", () => {
    const { getByText } = render(<VehiclesScreen />);
    expect(getByText("Brak pojazdów")).toBeDefined();
    expect(getByText(/Dodaj swój pierwszy pojazd/)).toBeDefined();
  });

  it("renders add button when not editing and form not shown", () => {
    const { getByText } = render(<VehiclesScreen />);
    expect(getByText("Dodaj pojazd")).toBeDefined();
  });

  it("hides add button when add form is shown", () => {
    mockUseVehicles.mockReturnValue(
      getDefaultMockVehicles({ showAddForm: true })
    );
    const { queryByText } = render(<VehiclesScreen />);
    expect(queryByText("Dodaj pojazd")).toBeNull();
  });

  it("hides add button when editing vehicle", () => {
    mockUseVehicles.mockReturnValue(
      getDefaultMockVehicles({
        vehicles: [{ id: "vehicle1", name: "Toyota" }],
        editingVehicle: { id: "vehicle1", name: "Toyota" },
        editedName: "Toyota",
      })
    );
    const { queryByText } = render(<VehiclesScreen />);
    expect(queryByText("Dodaj pojazd")).toBeNull();
  });

  it("calls setShowAddForm when add button is pressed", () => {
    const { getByText } = render(<VehiclesScreen />);
    const addButton = getByText("Dodaj pojazd");
    fireEvent.press(addButton);
    expect(mockSetShowAddForm).toHaveBeenCalledWith(true);
  });

  it("renders vehicle list when vehicles exist", () => {
    mockUseVehicles.mockReturnValue(
      getDefaultMockVehicles({
        vehicles: [
          { id: "vehicle1", name: "Toyota Corolla" },
          { id: "vehicle2", name: "Honda Civic" },
        ],
      })
    );
    const { getByText } = render(<VehiclesScreen />);
    expect(getByText("Toyota Corolla")).toBeDefined();
    expect(getByText("Honda Civic")).toBeDefined();
  });

  it("renders edit form when vehicle is being edited", () => {
    mockUseVehicles.mockReturnValue(
      getDefaultMockVehicles({
        vehicles: [{ id: "vehicle1", name: "Toyota" }],
        editingVehicle: { id: "vehicle1", name: "Toyota" },
        editedName: "Toyota Updated",
      })
    );
    const { getByDisplayValue } = render(<VehiclesScreen />);
    expect(getByDisplayValue("Toyota Updated")).toBeDefined();
  });

  it("renders add form when showAddForm is true", () => {
    mockUseVehicles.mockReturnValue(
      getDefaultMockVehicles({
        showAddForm: true,
        newVehicleName: "New Vehicle",
      })
    );
    const { getByPlaceholderText, getByDisplayValue } = render(
      <VehiclesScreen />
    );
    expect(getByPlaceholderText(/Nazwa pojazdu/)).toBeDefined();
    expect(getByDisplayValue("New Vehicle")).toBeDefined();
  });

  it("calls handleAddVehicle with correct vehicle name and user data when submit button is pressed", async () => {
    const vehicleName = "Toyota Corolla";
    const userEmail = "user@example.com";
    const userId = "test-user-id";

    mockUseAuth.mockReturnValue({
      user: { uid: userId, email: userEmail } as any,
      isLoggedIn: true,
      loading: false,
      login: jest.fn(),
      register: jest.fn(),
      registerAdmin: jest.fn(),
      logout: jest.fn(),
      error: null,
    });

    mockUseVehicles.mockReturnValue(
      getDefaultMockVehicles({
        showAddForm: true,
        newVehicleName: vehicleName,
      })
    );

    mockHandleAddVehicle.mockImplementation(async () => {
      await mockAddVehicle({
        vehicleName,
        userId,
        userEmail,
      });
    });

    const { getByText } = render(<VehiclesScreen />);
    const submitButton = getByText("Dodaj");

    await fireEvent.press(submitButton);

    expect(mockHandleAddVehicle).toHaveBeenCalledTimes(1);
    expect(mockAddVehicle).toHaveBeenCalledTimes(1);
    expect(mockAddVehicle).toHaveBeenCalledWith({
      vehicleName: "Toyota Corolla",
      userId: "test-user-id",
      userEmail: "user@example.com",
    });
  });

  it("calls startEdit with correct vehicle when edit button is pressed", () => {
    const vehicle = { id: "vehicle1", name: "Toyota Corolla" };
    mockUseVehicles.mockReturnValue(
      getDefaultMockVehicles({
        vehicles: [vehicle],
      })
    );
    const { getByTestId } = render(<VehiclesScreen />);
    const editButton = getByTestId("edit-button");
    fireEvent.press(editButton);
    expect(mockStartEdit).toHaveBeenCalledTimes(1);
    expect(mockStartEdit).toHaveBeenCalledWith(vehicle);
  });

  it("calls saveEdit and updateVehicle with correct vehicle ID and updated name when save button is pressed", async () => {
    const vehicleId = "vehicle1";
    const originalName = "Toyota";
    const newName = "Toyota Updated";

    mockUseVehicles.mockReturnValue(
      getDefaultMockVehicles({
        vehicles: [{ id: vehicleId, name: originalName }],
        editingVehicle: { id: vehicleId, name: originalName },
        editedName: newName,
      })
    );

    mockSaveEdit.mockImplementation(async () => {
      await mockUpdateVehicle({
        vehicleId,
        newName,
      });
    });

    const { getByText } = render(<VehiclesScreen />);
    const saveButton = getByText("Zapisz");

    await fireEvent.press(saveButton);

    expect(mockSaveEdit).toHaveBeenCalledTimes(1);
    expect(mockUpdateVehicle).toHaveBeenCalledTimes(1);
    expect(mockUpdateVehicle).toHaveBeenCalledWith({
      vehicleId: "vehicle1",
      newName: "Toyota Updated",
    });
    expect(mockUpdateVehicle).not.toHaveBeenCalledWith(
      expect.objectContaining({
        newName: originalName,
      })
    );
  });

  it("calls handleDeleteVehicle with correct vehicle ID and name when delete button is pressed", () => {
    const vehicle = { id: "vehicle1", name: "Toyota Corolla" };
    mockUseVehicles.mockReturnValue(
      getDefaultMockVehicles({
        vehicles: [vehicle],
      })
    );
    const { getByTestId } = render(<VehiclesScreen />);
    const deleteButton = getByTestId("delete-button");
    fireEvent.press(deleteButton);
    expect(mockHandleDeleteVehicle).toHaveBeenCalledTimes(1);
    expect(mockHandleDeleteVehicle).toHaveBeenCalledWith(
      "vehicle1",
      "Toyota Corolla"
    );
  });

  it("calls cancelAdd when cancel button is pressed in add form", () => {
    mockUseVehicles.mockReturnValue(
      getDefaultMockVehicles({
        showAddForm: true,
        newVehicleName: "Toyota",
      })
    );
    const { getByText } = render(<VehiclesScreen />);
    const cancelButton = getByText("Anuluj");
    fireEvent.press(cancelButton);
    expect(mockCancelAdd).toHaveBeenCalledTimes(1);
  });

  it("calls cancelEdit when cancel button is pressed in edit form", () => {
    mockUseVehicles.mockReturnValue(
      getDefaultMockVehicles({
        vehicles: [{ id: "vehicle1", name: "Toyota" }],
        editingVehicle: { id: "vehicle1", name: "Toyota" },
        editedName: "Toyota Updated",
      })
    );
    const { getByText } = render(<VehiclesScreen />);
    const cancelButton = getByText("Anuluj");
    fireEvent.press(cancelButton);
    expect(mockCancelEdit).toHaveBeenCalledTimes(1);
  });
});
