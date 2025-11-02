import type { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { ThemedView } from "@/components/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { IconButton, MD3Colors } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

const HEADER_HEIGHT = 250;
type Props = PropsWithChildren<{
  style?: object;
}>;
const names = {
  index: "Strona główna",
  reservations: "Rezerwacje",
  navigate: "Nawiguj",
  contact: "Kontakt",
  more: "Więcej",
};

export default function ParallaxScrollView({ style, children }: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const bottom = useBottomTabOverflow();
  const { name } = useRoute() as { name: keyof typeof names };
  const { user } = useAuth();

  const isHomeScreen = name === "index";

  const headerContent = isHomeScreen ? (
    <View>
      <Text style={styles.headerText}>Cześć,</Text>
      <Text style={[styles.headerText, styles.name]}>
        {user?.displayName || user?.email?.split("@")[0] || "Użytkowniku"}
      </Text>
    </View>
  ) : (
    <View>
      <Text style={styles.headerText}>{names[name]}</Text>
    </View>
  );

  return (
    <ThemedView style={[styles.container, style]}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        <View style={styles.headerContainer}>
          {headerContent}
          <View style={{ flexDirection: "row" }}>
            <IconButton
              icon="lightbulb-outline"
              iconColor={MD3Colors.neutral0}
              size={32}
              style={{ margin: 0, padding: 0 }}
              onPress={() => console.log("Pressed")}
            />
            <IconButton
              icon="account-outline"
              iconColor={MD3Colors.neutral0}
              size={32}
              style={{ margin: 0, padding: 0 }}
              onPress={() => router.push("/AccountPage")}
            />
          </View>
        </View>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  headerText: {
    fontSize: 18,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4257EF",
  },
  headerContainer: {
    paddingHorizontal: 24,
    position: "relative",
    height: 70,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: "hidden",
  },
});
