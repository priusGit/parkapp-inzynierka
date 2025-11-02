import React from "react";
import { render } from "@testing-library/react-native";
import { VehicleList } from "../components/VehicleList";

describe("VehicleList", () => {
  const mockSetEditedName = jest.fn();
  const mockActions = {
    edit: {
      start: jest.fn(),
      save: jest.fn(),
      cancel: jest.fn(),
    },
    delete: {
      remove: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty state when no vehicles and form not shown", () => {
    const { getByText } = render(
      <VehicleList
        vehicles={[]}
        showAddForm={false}
        editingVehicle={null}
        editedName=""
        setEditedName={mockSetEditedName}
        actions={mockActions}
      />
    );
    expect(getByText("Brak pojazdów")).toBeDefined();
    expect(getByText(/Dodaj swój pierwszy pojazd/)).toBeDefined();
  });

  it("does not render empty state when add form is shown", () => {
    const { queryByText } = render(
      <VehicleList
        vehicles={[]}
        showAddForm={true}
        editingVehicle={null}
        editedName=""
        setEditedName={mockSetEditedName}
        actions={mockActions}
      />
    );
    expect(queryByText("Brak pojazdów")).toBeNull();
  });

  it("renders vehicle cards when vehicles exist", () => {
    const vehicles = [
      { id: "vehicle1", name: "Toyota Corolla" },
      { id: "vehicle2", name: "Honda Civic" },
    ];

    const { getByText } = render(
      <VehicleList
        vehicles={vehicles}
        showAddForm={false}
        editingVehicle={null}
        editedName=""
        setEditedName={mockSetEditedName}
        actions={mockActions}
      />
    );
    expect(getByText("Toyota Corolla")).toBeDefined();
    expect(getByText("Honda Civic")).toBeDefined();
  });

  it("renders EditVehicleCard when vehicle is being edited", () => {
    const vehicles = [
      { id: "vehicle1", name: "Toyota Corolla" },
      { id: "vehicle2", name: "Honda Civic" },
    ];

    const { getByDisplayValue } = render(
      <VehicleList
        vehicles={vehicles}
        showAddForm={false}
        editingVehicle={vehicles[0]}
        editedName="Toyota Updated"
        setEditedName={mockSetEditedName}
        actions={mockActions}
      />
    );
    expect(getByDisplayValue("Toyota Updated")).toBeDefined();
  });

  it("renders VehicleCard for non-editing vehicles", () => {
    const vehicles = [
      { id: "vehicle1", name: "Toyota Corolla" },
      { id: "vehicle2", name: "Honda Civic" },
    ];

    const { getByText } = render(
      <VehicleList
        vehicles={vehicles}
        showAddForm={false}
        editingVehicle={vehicles[0]}
        editedName="Toyota Updated"
        setEditedName={mockSetEditedName}
        actions={mockActions}
      />
    );
    expect(getByText("Honda Civic")).toBeDefined();
  });

  it("renders multiple vehicles in list", () => {
    const vehicles = [
      { id: "vehicle1", name: "Toyota Corolla" },
      { id: "vehicle2", name: "Honda Civic" },
      { id: "vehicle3", name: "BMW X5" },
    ];

    const { getByText } = render(
      <VehicleList
        vehicles={vehicles}
        showAddForm={false}
        editingVehicle={null}
        editedName=""
        setEditedName={mockSetEditedName}
        actions={mockActions}
      />
    );
    expect(getByText("Toyota Corolla")).toBeDefined();
    expect(getByText("Honda Civic")).toBeDefined();
    expect(getByText("BMW X5")).toBeDefined();
  });
});
