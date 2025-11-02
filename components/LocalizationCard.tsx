import { ACCENT_COLOR } from "@/constants/Colors";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { openNavigation } from "@/helpers/openNavigation";

interface Parking {
  id: string;
  name: string;
  address: string;
  img: string;
}

const LocalizationCard = ({ parking }: { parking: Parking }) => {
  const { name, address, img } = parking;

  const onNavigateButtonPress = () => openNavigation(address);

  return (
    <View
      key={parking.id}
      style={styles.reservationContainer}
      onTouchEnd={onNavigateButtonPress}
    >
      <Image
        source={{ uri: img }}
        style={styles.parkingImage}
        resizeMode="cover"
      />
      <View style={{ width: "60%" }}>
        <View style={styles.titleContainer}>
          <Text style={styles.date}>{name}</Text>
        </View>
        <Text style={styles.car}>{address}</Text>
      </View>
      <Button
        icon="directions"
        mode="contained"
        onPress={onNavigateButtonPress}
        buttonColor={ACCENT_COLOR}
      >
        Nawiguj
      </Button>
    </View>
  );
};

export default LocalizationCard;

const styles = StyleSheet.create({
  parkingImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: ACCENT_COLOR,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reservationContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: ACCENT_COLOR,
    marginVertical: 8,
  },
  date: {
    color: "white",
    fontWeight: 500,
    fontSize: 14,
  },
  car: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  placeTitle: {
    color: "white",
    fontSize: 14,
    marginTop: 4,
  },
});
