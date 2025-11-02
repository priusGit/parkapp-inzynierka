import { Text, StyleSheet, View, Linking } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Button } from "react-native-paper";
import { ACCENT_COLOR } from "@/constants/Colors";

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView>
      <View style={styles.contactCardContainer}>
        <View>
          <Text style={styles.topText}>Telefon</Text>
          <Text style={styles.middleText}>123 456 789</Text>
          <Text style={styles.bottomText}>Darek</Text>
        </View>
        <View>
          <Button
            icon="phone"
            mode="contained"
            onPress={() => Linking.openURL("tel:123456789")}
            style={{ backgroundColor: ACCENT_COLOR }}
          >
            Zadzwoń
          </Button>
        </View>
      </View>
      <View style={styles.contactCardContainer}>
        <View>
          <Text style={styles.topText}>E-mail</Text>
          <Text style={styles.topText}>kontakt@eparking.com</Text>
        </View>
        <View>
          <Button
            icon="forum-outline"
            mode="contained"
            onPress={() => Linking.openURL("mailto:kontakt@eparking.com")}
            style={{ backgroundColor: ACCENT_COLOR }}
          >
            Napisz
          </Button>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  contactCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 3,
    borderColor: ACCENT_COLOR,
    borderRadius: 8,
    borderStyle: "solid",
    padding: 16,
  },
  topText: {
    fontSize: 16,
    fontWeight: "bold",
    color: ACCENT_COLOR,
  },
  middleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: ACCENT_COLOR,
  },
  bottomText: {
    fontSize: 16,
    fontWeight: "bold",
    color: ACCENT_COLOR,
  },
});
