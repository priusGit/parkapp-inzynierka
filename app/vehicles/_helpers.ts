import { Alert, Keyboard } from "react-native";
import { db } from "@/config/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

interface AddVehicleParams {
  vehicleName: string;
  userId: string;
  userEmail: string | null;
}

interface UpdateVehicleParams {
  vehicleId: string;
  newName: string;
}

interface DeleteVehicleParams {
  vehicleId: string;
  vehicleName: string;
}

export const addVehicle = async (params: AddVehicleParams): Promise<void> => {
  const { vehicleName, userId, userEmail } = params;

  if (!vehicleName.trim()) {
    throw new Error("Proszę podać nazwę pojazdu");
  }

  await addDoc(collection(db, "vehicles"), {
    name: vehicleName.trim(),
    userId: userId,
    userEmail: userEmail,
    createdAt: serverTimestamp(),
  });
};

export const updateVehicle = async (
  params: UpdateVehicleParams
): Promise<void> => {
  const { vehicleId, newName } = params;

  if (!newName.trim()) {
    throw new Error("Proszę podać nazwę pojazdu");
  }

  await updateDoc(doc(db, "vehicles", vehicleId), {
    name: newName.trim(),
  });
};

export const deleteVehicle = async (vehicleId: string): Promise<void> => {
  await deleteDoc(doc(db, "vehicles", vehicleId));
};

export const showDeleteConfirmation = (
  params: DeleteVehicleParams,
  onConfirm: () => Promise<void>
): void => {
  const { vehicleName } = params;

  Alert.alert(
    "Usuń pojazd",
    `Czy na pewno chcesz usunąć pojazd "${vehicleName}"?`,
    [
      { text: "Anuluj", style: "cancel" },
      {
        text: "Usuń",
        style: "destructive",
        onPress: onConfirm,
      },
    ]
  );
};

export const dismissKeyboard = (): void => {
  Keyboard.dismiss();
};
