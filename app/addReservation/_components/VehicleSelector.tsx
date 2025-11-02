import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { IconButton } from "react-native-paper";
import { router } from "expo-router";
import { styles } from "../_styles";

interface VehicleSelectorProps {
  vehicles: any[];
  loading: boolean;
  selectedVehicleId: string | null;
  onSelect: (id: string) => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  vehicles,
  loading,
  selectedVehicleId,
  onSelect,
}) => {
  if (loading) {
    return <ActivityIndicator size="small" color="#6200ff" />;
  }

  if (vehicles.length === 0) {
    return (
      <View style={styles.noVehiclesContainer}>
        <Text style={styles.noVehiclesText}>
          Brak pojazdów. Dodaj pojazd w zakładce Więcej → Twoje Pojazdy
        </Text>
        <TouchableOpacity
          style={styles.addVehicleButton}
          onPress={() => router.push("/vehicles")}
        >
          <Text style={styles.addVehicleButtonText}>Dodaj pojazd</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      {vehicles.map((vehicle) => (
        <TouchableOpacity
          key={vehicle.id}
          style={[
            styles.vehicleOption,
            selectedVehicleId === vehicle.id && styles.vehicleOptionActive,
          ]}
          onPress={() => onSelect(vehicle.id)}
        >
          <View style={styles.vehicleOptionContent}>
            <IconButton icon="car" size={24} iconColor="#6200ff" />
            <Text style={styles.vehicleOptionText}>{vehicle.name}</Text>
          </View>
          {selectedVehicleId === vehicle.id && (
            <IconButton icon="check-circle" iconColor="#6200ff" size={24} />
          )}
        </TouchableOpacity>
      ))}
    </>
  );
};
