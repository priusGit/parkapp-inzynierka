import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/config/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { generateAccessCode, getErrorMessage } from "../_helpers";

export const useRegisterParking = () => {
  const { registerAdmin, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [parkingName, setParkingName] = useState("");
  const [parkingAddress, setParkingAddress] = useState("");
  const [parkingImage, setParkingImage] = useState("");

  useEffect(() => {
    if (email && email.includes("@")) {
      const username = email.split("@")[0];
      setDisplayName(username);
    }
  }, [email]);

  const handleRegister = async () => {
    if (!email || !password || !displayName) {
      Alert.alert("Błąd", "Proszę wypełnić wszystkie dane użytkownika");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Błąd", "Hasło musi mieć co najmniej 6 znaków");
      return;
    }

    if (!parkingName || !parkingAddress) {
      Alert.alert("Błąd", "Proszę wypełnić wszystkie dane parkingu");
      return;
    }

    try {
      const accessCode = generateAccessCode();
      const userId = await registerAdmin(email, password, displayName, accessCode);

      await addDoc(collection(db, "parkings"), {
        name: parkingName,
        address: parkingAddress,
        img: parkingImage || "https://i.imgur.com/F7PBz3J.png",
        ownerId: userId,
        createdAt: new Date().toISOString(),
      });

      Alert.alert(
        "Sukces! 🎉",
        `Parking został zarejestrowany pomyślnie!\n\nTwój kod dostępu: ${accessCode}\n\nUdostępnij ten kod użytkownikom, którzy mają mieć dostęp do Twojego parkingu.`,
        [{ text: "OK", onPress: () => router.replace("/(tabs)") }]
      );
    } catch (error: any) {
      console.log(error);
      const errorMessage = getErrorMessage(error.code);
      Alert.alert("Błąd rejestracji", errorMessage);
    }
  };

  return {
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
  };
};


