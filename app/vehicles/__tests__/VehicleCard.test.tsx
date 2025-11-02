import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { VehicleCard } from "../components/VehicleCard";

describe("VehicleCard", () => {
  const mockVehicle = {
    id: "vehicle1",
    name: "Toyota Corolla",
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders vehicle name", () => {
    const { getByText } = render(
      <VehicleCard
        item={mockVehicle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    expect(getByText("Toyota Corolla")).toBeDefined();
  });

  it("calls onEdit when edit button is pressed", () => {
    const { getByTestId } = render(
      <VehicleCard
        item={mockVehicle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    const editButton = getByTestId("edit-button");
    fireEvent.press(editButton);
    expect(mockOnEdit).toHaveBeenCalledWith(mockVehicle);
  });

  it("calls onDelete with correct parameters when delete button is pressed", () => {
    const { getByTestId } = render(
      <VehicleCard
        item={mockVehicle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    const deleteButton = getByTestId("delete-button");
    fireEvent.press(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith("vehicle1", "Toyota Corolla");
  });
});
