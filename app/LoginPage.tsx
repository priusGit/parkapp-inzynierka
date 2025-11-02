import { useAuth } from "@/contexts/AuthContext";
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";

export default function LoginScreen() {
  const { login, register, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (email && email.includes("@")) {
      const username = email.split("@")[0];
      setDisplayName(username);
    }
  }, [email]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Błąd", "Proszę wypełnić wszystkie pola");
      return;
    }

    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      let errorMessage = "Wystąpił błąd podczas logowania";

      if (error.code === "auth/invalid-email") {
        errorMessage = "Nieprawidłowy adres email";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "Użytkownik nie istnieje";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Nieprawidłowe hasło";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Nieprawidłowe dane logowania";
      }

      Alert.alert("Błąd logowania", errorMessage);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !displayName) {
      Alert.alert("Błąd", "Proszę wypełnić wszystkie pola");
      return;
    }

    if (!accessCode || accessCode.length !== 6) {
      Alert.alert(
        "Błąd",
        "Proszę wprowadzić 6-znakowy kod dostępu od administratora parkingu"
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert("Błąd", "Hasło musi mieć co najmniej 6 znaków");
      return;
    }

    try {
      await register(email, password, displayName, accessCode.toUpperCase());
      Alert.alert("Sukces", "Konto zostało utworzone pomyślnie!");
      router.replace("/(tabs)");
    } catch (error: any) {
      let errorMessage = "Wystąpił błąd podczas rejestracji";

      if (error.message === "Nieprawidłowy kod dostępu") {
        errorMessage =
          "Nieprawidłowy kod dostępu. Sprawdź czy kod jest poprawny.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "Ten adres email jest już używany";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Nieprawidłowy adres email";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Hasło jest zbyt słabe";
      }

      Alert.alert("Błąd rejestracji", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ParkApp</Text>
      <Text style={styles.subtitle}>
        {isRegistering ? "Utwórz nowe konto" : "Zaloguj się"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />

      {isRegistering && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nazwa użytkownika"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Kod dostępu (6 znaków)"
            value={accessCode}
            onChangeText={setAccessCode}
            autoCapitalize="characters"
            maxLength={6}
          />
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Hasło"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#6200ff" />
      ) : (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={isRegistering ? handleRegister : handleLogin}
            testID="login-button"
          >
            <Text style={styles.buttonText}>
              {isRegistering ? "Zarejestruj się" : "Zaloguj się"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsRegistering(!isRegistering)}
          >
            <Text style={styles.switchButtonText}>
              {isRegistering
                ? "Masz już konto? Zaloguj się"
                : "Nie masz konta? Zarejestruj się"}
            </Text>
          </TouchableOpacity>

          {isRegistering && (
            <TouchableOpacity
              style={styles.registerParkingButton}
              onPress={() => router.push("/registerParkingPage")}
            >
              <Text style={styles.registerParkingButtonText}>
                Zarejestruj swój parking
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#6200ff",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: "center",
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#6200ff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchButton: {
    marginTop: 20,
    alignItems: "center",
  },
  switchButtonText: {
    color: "#6200ff",
    fontSize: 14,
  },
  registerParkingButton: {
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "#6200ff",
  },
  registerParkingButtonText: {
    color: "#6200ff",
    fontSize: 16,
    fontWeight: "600",
  },
});
