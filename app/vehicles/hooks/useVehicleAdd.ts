import { useState } from "react";
import { Alert } from "react-native";
import { User } from "firebase/auth";
import { addVehicle, dismissKeyboard } from "../_helpers";

export const useVehicleAdd = (user: User | null) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicleName, setNewVehicleName] = useState("");
  const [addingVehicle, setAddingVehicle] = useState(false);

  const handleAddVehicle = async () => {
    if (!user) {
      Alert.alert("Błąd", "Musisz być zalogowany");
      return;
    }

    try {
      setAddingVehicle(true);

      await addVehicle({
        vehicleName: newVehicleName,
        userId: user.uid,
        userEmail: user.email,
      });

      setNewVehicleName("");
      setShowAddForm(false);
      dismissKeyboard();
      Alert.alert("Sukces", "Pojazd został dodany!");
    } catch (error: any) {
      console.error("Error adding vehicle:", error);
      const errorMessage = error.message || "Nie udało się dodać pojazdu";
      Alert.alert("Błąd", errorMessage);
    } finally {
      setAddingVehicle(false);
    }
  };

  const cancelAdd = () => {
    setShowAddForm(false);
    setNewVehicleName("");
    dismissKeyboard();
  };

  return {
    showAddForm,
    setShowAddForm,
    newVehicleName,
    setNewVehicleName,
    addingVehicle,
    handleAddVehicle,
    cancelAdd,
  };
};
