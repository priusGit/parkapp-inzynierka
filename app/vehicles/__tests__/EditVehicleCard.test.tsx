import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { EditVehicleCard } from "../components/EditVehicleCard";

describe("EditVehicleCard", () => {
  const mockOnChangeText = jest.fn();
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input with current value", () => {
    const { getByDisplayValue } = render(
      <EditVehicleCard
        value="Toyota Corolla"
        onChangeText={mockOnChangeText}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    expect(getByDisplayValue("Toyota Corolla")).toBeDefined();
  });

  it("calls onChangeText when input changes", () => {
    const { getByDisplayValue } = render(
      <EditVehicleCard
        value="Toyota"
        onChangeText={mockOnChangeText}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    const input = getByDisplayValue("Toyota");
    fireEvent.changeText(input, "Toyota Updated");
    expect(mockOnChangeText).toHaveBeenCalledWith("Toyota Updated");
  });

  it("calls onSave when save button is pressed", () => {
    const { getByText } = render(
      <EditVehicleCard
        value="Toyota"
        onChangeText={mockOnChangeText}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    const saveButton = getByText("Zapisz");
    fireEvent.press(saveButton);
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button is pressed", () => {
    const { getByText } = render(
      <EditVehicleCard
        value="Toyota"
        onChangeText={mockOnChangeText}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    const cancelButton = getByText("Anuluj");
    fireEvent.press(cancelButton);
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("updates input value when onChangeText is called", () => {
    const { getByDisplayValue, rerender } = render(
      <EditVehicleCard
        value="Toyota"
        onChangeText={mockOnChangeText}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    expect(getByDisplayValue("Toyota")).toBeDefined();

    rerender(
      <EditVehicleCard
        value="Toyota Updated"
        onChangeText={mockOnChangeText}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    expect(getByDisplayValue("Toyota Updated")).toBeDefined();
  });
});
