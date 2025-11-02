import { Text, StyleSheet, View, Alert } from "react-native";
import { IconButton } from "react-native-paper";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";

export default function TabTwoScreen() {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/LoginPage");
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się wylogować");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.title}>Konto</Text>
        {user && (
          <>
            <Text style={styles.infoText}>Email: {user.email}</Text>
            <Text style={styles.infoText}>UID: {user.uid}</Text>
          </>
        )}
      </View>

      <View style={styles.cardsRow}>
        <View style={styles.optionContainer}>
          <IconButton
            icon="logout"
            iconColor="white"
            size={32}
            onPress={handleLogout}
            style={styles.button}
          />
          <Text style={styles.titleContainer}>Wyloguj</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userInfoContainer: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#6200ff",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
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
    backgroundColor: "#6200ff",
    borderRadius: 8,
  },
  optionContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#bbb",
    borderRadius: 8,
    minWidth: 130,
    maxWidth: 150,
  },
});
