import { Linking, Platform, Alert } from "react-native";

export const openNavigation = (address: string) => {
  console.log("Opening navigation for address:", address);

  const encodedAddress = encodeURIComponent(address.trim());

  const url = Platform.select({
    ios: `http://maps.apple.com/?daddr=${encodedAddress}`,
    android: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
  });

  if (!url) {
    Alert.alert("Error", "Platform not supported for navigation");
    return;
  }

  console.log("Navigation URL:", url);

  Linking.openURL(url).catch((err) => {
    console.error("An error occurred", err);
    Alert.alert("Error", "Could not open maps app.");
  });
};
