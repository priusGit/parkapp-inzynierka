import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AddVehicleForm } from "../components/AddVehicleForm";

describe("AddVehicleForm", () => {
  const mockSetVehicleName = jest.fn();
  const mockSubmit = jest.fn();
  const mockCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form with input field", () => {
    const { getByPlaceholderText } = render(
      <AddVehicleForm
        vehicleName=""
        setVehicleName={mockSetVehicleName}
        isLoading={false}
        actions={{
          submit: mockSubmit,
          cancel: mockCancel,
        }}
      />
    );
    expect(getByPlaceholderText(/Nazwa pojazdu/)).toBeDefined();
  });

  it("displays vehicle name in input", () => {
    const { getByDisplayValue } = render(
      <AddVehicleForm
        vehicleName="Toyota Corolla"
        setVehicleName={mockSetVehicleName}
        isLoading={false}
        actions={{
          submit: mockSubmit,
          cancel: mockCancel,
        }}
      />
    );
    expect(getByDisplayValue("Toyota Corolla")).toBeDefined();
  });

  it("calls setVehicleName when input changes", () => {
    const { getByPlaceholderText } = render(
      <AddVehicleForm
        vehicleName=""
        setVehicleName={mockSetVehicleName}
        isLoading={false}
        actions={{
          submit: mockSubmit,
          cancel: mockCancel,
        }}
      />
    );
    const input = getByPlaceholderText(/Nazwa pojazdu/);
    fireEvent.changeText(input, "Honda Civic");
    expect(mockSetVehicleName).toHaveBeenCalledWith("Honda Civic");
  });

  it("calls submit action when submit button is pressed", () => {
    const { getByText } = render(
      <AddVehicleForm
        vehicleName="Toyota"
        setVehicleName={mockSetVehicleName}
        isLoading={false}
        actions={{
          submit: mockSubmit,
          cancel: mockCancel,
        }}
      />
    );
    const submitButton = getByText("Dodaj");
    fireEvent.press(submitButton);
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  it("does not call submit when button is disabled during loading", () => {
    const { getByTestId } = render(
      <AddVehicleForm
        vehicleName="Toyota"
        setVehicleName={mockSetVehicleName}
        isLoading={true}
        actions={{
          submit: mockSubmit,
          cancel: mockCancel,
        }}
      />
    );
    const submitButton = getByTestId("loading-indicator");
    fireEvent.press(submitButton!);
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("calls cancel action when cancel button is pressed", () => {
    const { getByText } = render(
      <AddVehicleForm
        vehicleName=""
        setVehicleName={mockSetVehicleName}
        isLoading={false}
        actions={{
          submit: mockSubmit,
          cancel: mockCancel,
        }}
      />
    );
    const cancelButton = getByText("Anuluj");
    fireEvent.press(cancelButton);
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it("shows loading indicator when isLoading is true", () => {
    const { queryByText } = render(
      <AddVehicleForm
        vehicleName="Toyota"
        setVehicleName={mockSetVehicleName}
        isLoading={true}
        actions={{
          submit: mockSubmit,
          cancel: mockCancel,
        }}
      />
    );
    expect(queryByText("Dodaj")).toBeNull();
  });

  it("calls submit when input is submitted via return key", () => {
    const { getByPlaceholderText } = render(
      <AddVehicleForm
        vehicleName="Toyota"
        setVehicleName={mockSetVehicleName}
        isLoading={false}
        actions={{
          submit: mockSubmit,
          cancel: mockCancel,
        }}
      />
    );
    const input = getByPlaceholderText(/Nazwa pojazdu/);
    fireEvent(input, "submitEditing");
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });
});
