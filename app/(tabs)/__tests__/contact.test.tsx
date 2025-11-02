import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ContactScreen from "../contact";

jest.mock("react-native/Libraries/Linking/Linking", () => ({
  openURL: jest.fn().mockResolvedValue(undefined),
}));

describe("ContactScreen", () => {
  it("should render contact information", () => {
    const { getByText } = render(<ContactScreen />);
    expect(getByText("Telefon")).toBeTruthy();
    expect(getByText("123 456 789")).toBeTruthy();
    expect(getByText("E-mail")).toBeTruthy();
  });

  it("should have call button that opens phone app", () => {
    const { getByText } = render(<ContactScreen />);
    const callButton = getByText("Zadzwoń");
    expect(callButton).toBeTruthy();
  });

  it("should have email button that opens email app", () => {
    const { getByText } = render(<ContactScreen />);
    const emailButton = getByText("Napisz");
    expect(emailButton).toBeTruthy();
  });
});
