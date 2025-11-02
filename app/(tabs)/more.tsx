import { Image } from "expo-image";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconButton } from "react-native-paper";
import { router } from "expo-router";

export default function TabTwoScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ParallaxScrollView>
        <View style={styles.cardsRow}>
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => router.push("/vehicles")}
          >
            <IconButton
              icon="car"
              iconColor="white"
              size={32}
              style={styles.button}
            />
            <Text style={styles.titleContainer}>Twoje Pojazdy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => router.push("/clients")}
          >
            <IconButton
              icon="account-multiple"
              iconColor="white"
              size={32}
              style={styles.button}
            />
            <Text style={styles.titleContainer}>Klienci</Text>
          </TouchableOpacity>
          <View style={styles.optionContainer}>
            <IconButton
              icon="parking"
              iconColor="white"
              size={32}
              onPress={() => console.log(`add reservation`)}
              style={styles.button}
            />
            <Text style={styles.titleContainer}>Nasze Parkingi</Text>
          </View>
          <View style={styles.optionContainer}>
            <IconButton
              icon="information-outline"
              iconColor="white"
              size={32}
              onPress={() => console.log(`add reservation`)}
              style={styles.button}
            />
            <Text style={styles.titleContainer}>O nas</Text>
          </View>
          <View style={styles.optionContainer}>
            <IconButton
              icon="history"
              iconColor="white"
              size={32}
              onPress={() => console.log(`add reservation`)}
              style={styles.button}
            />
            <Text style={styles.titleContainer}>Historia</Text>
          </View>
          <View style={styles.optionContainer}>
            <IconButton
              icon="remote"
              iconColor="white"
              size={32}
              onPress={() => console.log(`add reservation`)}
              style={styles.button}
            />
            <Text style={styles.titleContainer}>Otwórz Szlaban</Text>
          </View>
        </View>
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    margin: 16,
    flexWrap: "wrap",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    backgroundColor: "#6200ee",
    borderRadius: 8,
  },
  optionContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    minWidth: 130,
    maxWidth: 150,
  },
});
