import React from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { styles } from "./_styles";
import { useRegisterParking } from "./_hooks";

export default function RegisterParkingScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    displayName,
    setDisplayName,
    parkingName,
    setParkingName,
    parkingAddress,
    setParkingAddress,
    parkingImage,
    setParkingImage,
    loading,
    handleRegister,
  } = useRegisterParking();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Zarejestruj swój parking</Text>
        <Text style={styles.subtitle}>
          Utwórz konto administratora parkingu
        </Text>

        <Text style={styles.sectionTitle}>Dane konta administratora</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <TextInput
          style={styles.input}
          placeholder="Nazwa użytkownika"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Hasło"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />

        <Text style={styles.sectionTitle}>Dane parkingu</Text>

        <TextInput
          style={styles.input}
          placeholder="Nazwa parkingu"
          value={parkingName}
          onChangeText={setParkingName}
        />

        <TextInput
          style={styles.input}
          placeholder="Adres parkingu"
          value={parkingAddress}
          onChangeText={setParkingAddress}
        />

        <TextInput
          style={styles.input}
          placeholder="URL zdjęcia parkingu (opcjonalne)"
          value={parkingImage}
          onChangeText={setParkingImage}
          autoCapitalize="none"
        />

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#6200ff"
            style={{ marginTop: 20 }}
          />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Zarejestruj parking</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Powrót do logowania</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

