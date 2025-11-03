import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { IconButton } from "react-native-paper";
import { styles } from "./_styles";
import {
  VehicleSelector,
  ParkingSelector,
  TypeSelector,
  DateSelector,
} from "./_components";
import { useAddReservation } from "./_hooks";

export default function AddReservationScreen() {
  const { user } = useAuth();

  const {
    vehicles,
    loadingVehicles,
    parkings,
    loadingParkings,
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
    actions,
  } = useAddReservation(user);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.header}>
        <IconButton
          testID="back-button"
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Nowa rezerwacja</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Wybierz pojazd</Text>
        <VehicleSelector
          vehicles={vehicles}
          loading={loadingVehicles}
          selectedVehicleId={selectedVehicleId}
          onSelect={setSelectedVehicleId}
        />

        <Text style={styles.label}>Typ rezerwacji</Text>
        <TypeSelector type={type} onChange={actions.changeType} />

        <DateSelector
          type={type}
          startDate={startDate}
          endDate={endDate}
          showStartDatePicker={showStartDatePicker}
          showEndDatePicker={showEndDatePicker}
          onStartDatePress={() => setShowStartDatePicker(true)}
          onEndDatePress={() => setShowEndDatePicker(true)}
          onStartDateChange={actions.changeStartDate}
          onEndDateChange={actions.changeEndDate}
        />

        <Text style={styles.label}>Wybierz parking</Text>
        <ParkingSelector
          parkings={parkings}
          loading={loadingParkings}
          selectedPlaceId={selectedPlaceId}
          onSelect={setSelectedPlaceId}
        />

        <TouchableOpacity
          testID="submit-button"
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={actions.submit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator testID="loading-indicator" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Dodaj rezerwację</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
