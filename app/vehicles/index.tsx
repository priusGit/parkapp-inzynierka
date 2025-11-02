import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { IconButton } from "react-native-paper";
import { styles } from "./_styles";
import { VehicleList } from "./components/VehicleList";
import { AddVehicleForm } from "./components/AddVehicleForm";
import { useVehicles } from "./hooks";

export default function VehiclesScreen() {
  const { user } = useAuth();

  const {
    vehicles,
    loading,
    showAddForm,
    setShowAddForm,
    newVehicleName,
    setNewVehicleName,
    addingVehicle,
    editingVehicle,
    editedName,
    setEditedName,
    actions,
  } = useVehicles(user);

  const isAddButtonVisible = !showAddForm && !editingVehicle;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Twoje Pojazdy</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6200ff" style={styles.loader} />
      ) : (
        <>
          <VehicleList
            vehicles={vehicles}
            showAddForm={showAddForm}
            editingVehicle={editingVehicle}
            editedName={editedName}
            setEditedName={setEditedName}
            actions={actions}
          />

          {showAddForm && (
            <AddVehicleForm
              vehicleName={newVehicleName}
              setVehicleName={setNewVehicleName}
              isLoading={addingVehicle}
              actions={actions.add}
            />
          )}

          {isAddButtonVisible && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddForm(true)}
            >
              <IconButton icon="plus" iconColor="white" size={24} />
              <Text style={styles.addButtonText}>Dodaj pojazd</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </KeyboardAvoidingView>
  );
}
