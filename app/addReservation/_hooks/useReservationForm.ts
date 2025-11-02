import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { User } from "firebase/auth";
import { router } from "expo-router";
import { db } from "@/config/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { formatDateForFirestore, calculateMonthEndDate } from "../_helpers";

export const useReservationForm = (
  user: User | null,
  vehicles: any[],
  parkings: any[]
) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null
  );
  const [type, setType] = useState<"limited" | "monthly">("limited");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Automatycznie wybierz pojazd jeśli jest tylko jeden
  useEffect(() => {
    if (vehicles.length === 1 && !selectedVehicleId && vehicles[0]?.id) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles, selectedVehicleId]);

  // Automatycznie wybierz parking jeśli jest tylko jeden
  useEffect(() => {
    if (parkings.length === 1 && !selectedPlaceId && parkings[0]?.id) {
      setSelectedPlaceId(parkings[0].id);
    }
  }, [parkings, selectedPlaceId]);

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowStartDatePicker(false);
      return;
    }

    if (selectedDate) {
      setStartDate(selectedDate);
      setShowStartDatePicker(false);

      if (type === "monthly") {
        const lastDay = calculateMonthEndDate(selectedDate);
        setEndDate(lastDay);
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowEndDatePicker(false);
      return;
    }

    if (selectedDate) {
      setEndDate(selectedDate);
      setShowEndDatePicker(false);
    }
  };

  const handleTypeChange = (newType: "limited" | "monthly") => {
    setType(newType);
    if (newType === "monthly" && startDate) {
      const lastDay = calculateMonthEndDate(startDate);
      setEndDate(lastDay);
    } else if (newType === "limited") {
      setEndDate(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedVehicleId || !startDate || !endDate || !selectedPlaceId) {
      Alert.alert("Błąd", "Proszę wypełnić wszystkie pola");
      return;
    }

    if (!user) {
      Alert.alert("Błąd", "Musisz być zalogowany");
      return;
    }

    const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);
    if (!selectedVehicle) {
      Alert.alert("Błąd", "Nie znaleziono wybranego pojazdu");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "reservations"), {
        name: selectedVehicle.name,
        vehicleId: selectedVehicleId,
        type,
        startDate: formatDateForFirestore(startDate),
        endDate: formatDateForFirestore(endDate),
        placeId: selectedPlaceId,
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Sukces", "Rezerwacja została dodana!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error("Error adding reservation:", error);
      Alert.alert("Błąd", "Nie udało się dodać rezerwacji: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedVehicleId,
    setSelectedVehicleId,
    type,
    startDate,
    endDate,
    selectedPlaceId,
    setSelectedPlaceId,
    loading,
    showStartDatePicker,
    setShowStartDatePicker,
    showEndDatePicker,
    setShowEndDatePicker,
    actions: {
      changeType: handleTypeChange,
      changeStartDate: handleStartDateChange,
      changeEndDate: handleEndDateChange,
      submit: handleSubmit,
    },
  };
};
