import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ContactScreen from "../contact";
import { Linking } from "react-native";

jest.spyOn(Linking, "openURL").mockResolvedValue(undefined);

jest.mock("@/components/ParallaxScrollView", () => {
  return ({ children }: { children: React.ReactNode }) => <>{children}</>;
});

describe("ContactScreen", () => {
  it("should render contact information", () => {
    const { getByText } = render(<ContactScreen />);
    expect(getByText("Telefon")).toBeTruthy();
    expect(getByText("123 456 789")).toBeTruthy();
    expect(getByText("E-mail")).toBeTruthy();
    expect(getByText("kontakt@eparking.com")).toBeTruthy();
  });

  it("should have call button that opens phone app", () => {
    const { getByText } = render(<ContactScreen />);
    const callButton = getByText("Zadzwoń");
    fireEvent.press(callButton);
    expect(Linking.openURL).toHaveBeenCalledWith("tel:123456789");
  });

  it("should have email button that opens email app", () => {
    const { getByText } = render(<ContactScreen />);
    const emailButton = getByText("Napisz");
    fireEvent.press(emailButton);
    expect(Linking.openURL).toHaveBeenCalledWith("mailto:kontakt@eparking.com");
  });
});
