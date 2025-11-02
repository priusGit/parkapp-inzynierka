import { Alert } from "react-native";
import { deleteVehicle, showDeleteConfirmation } from "../_helpers";

export const useVehicleDelete = () => {
  const handleDeleteVehicle = (vehicleId: string, vehicleName: string) => {
    showDeleteConfirmation({ vehicleId, vehicleName }, async () => {
      try {
        await deleteVehicle(vehicleId);
        Alert.alert("Sukces", "Pojazd został usunięty");
      } catch (error: any) {
        console.error("Error deleting vehicle:", error);
        Alert.alert("Błąd", "Nie udało się usunąć pojazdu");
      }
    });
  };

  return {
    handleDeleteVehicle,
  };
};
