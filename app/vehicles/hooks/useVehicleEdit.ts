import { useState } from "react";
import { Alert } from "react-native";
import { updateVehicle, dismissKeyboard } from "../_helpers";

export const useVehicleEdit = () => {
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [editedName, setEditedName] = useState("");

  const startEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setEditedName(vehicle.name);
  };

  const saveEdit = async () => {
    try {
      await updateVehicle({
        vehicleId: editingVehicle.id,
        newName: editedName,
      });

      setEditingVehicle(null);
      setEditedName("");
      dismissKeyboard();
      Alert.alert("Sukces", "Pojazd został zaktualizowany!");
    } catch (error: any) {
      console.error("Error updating vehicle:", error);
      const errorMessage =
        error.message || "Nie udało się zaktualizować pojazdu";
      Alert.alert("Błąd", errorMessage);
    }
  };

  const cancelEdit = () => {
    setEditingVehicle(null);
    setEditedName("");
    dismissKeyboard();
  };

  return {
    editingVehicle,
    editedName,
    setEditedName,
    startEdit,
    saveEdit,
    cancelEdit,
  };
};
