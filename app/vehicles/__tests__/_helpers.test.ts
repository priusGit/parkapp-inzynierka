import { Alert, Keyboard } from "react-native";
import {
  addVehicle,
  updateVehicle,
  deleteVehicle,
  showDeleteConfirmation,
  dismissKeyboard,
} from "../_helpers";
import { db } from "@/config/firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

jest.mock("@/config/firebaseConfig");
jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
  Keyboard: {
    dismiss: jest.fn(),
  },
}));

const mockCollection = collection as jest.MockedFunction<typeof collection>;
const mockAddDoc = addDoc as jest.MockedFunction<typeof addDoc>;
const mockDoc = doc as jest.MockedFunction<typeof doc>;
const mockUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>;
const mockDeleteDoc = deleteDoc as jest.MockedFunction<typeof deleteDoc>;
const mockServerTimestamp = serverTimestamp as jest.MockedFunction<
  typeof serverTimestamp
>;

describe("vehicles helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockServerTimestamp.mockReturnValue("timestamp" as any);
  });

  describe("addVehicle", () => {
    it("throws error when vehicle name is empty", async () => {
      await expect(
        addVehicle({
          vehicleName: "",
          userId: "user1",
          userEmail: "test@example.com",
        })
      ).rejects.toThrow("Proszę podać nazwę pojazdu");
      expect(mockCollection).not.toHaveBeenCalled();
      expect(mockAddDoc).not.toHaveBeenCalled();
    });

    it("throws error when vehicle name is only whitespace", async () => {
      await expect(
        addVehicle({
          vehicleName: "   ",
          userId: "user1",
          userEmail: "test@example.com",
        })
      ).rejects.toThrow("Proszę podać nazwę pojazdu");
      expect(mockAddDoc).not.toHaveBeenCalled();
    });

    it("sends request to Firebase when adding vehicle", async () => {
      const mockCollectionRef = {};
      mockCollection.mockReturnValue(mockCollectionRef as any);
      mockAddDoc.mockResolvedValue({ id: "vehicle1" } as any);

      await addVehicle({
        vehicleName: "Toyota Corolla",
        userId: "user1",
        userEmail: "test@example.com",
      });

      expect(mockCollection).toHaveBeenCalledTimes(1);
      expect(mockCollection).toHaveBeenCalledWith(db, "vehicles");
      expect(mockAddDoc).toHaveBeenCalledTimes(1);
      expect(mockAddDoc).toHaveBeenCalledWith(mockCollectionRef, {
        name: "Toyota Corolla",
        userId: "user1",
        userEmail: "test@example.com",
        createdAt: "timestamp",
      });
    });

    it("calls addDoc with trimmed vehicle name", async () => {
      const mockCollectionRef = {};
      mockCollection.mockReturnValue(mockCollectionRef as any);
      mockAddDoc.mockResolvedValue({ id: "vehicle1" } as any);

      await addVehicle({
        vehicleName: "  Toyota Corolla  ",
        userId: "user1",
        userEmail: "test@example.com",
      });

      expect(mockAddDoc).toHaveBeenCalledWith(mockCollectionRef, {
        name: "Toyota Corolla",
        userId: "user1",
        userEmail: "test@example.com",
        createdAt: "timestamp",
      });
    });

    it("handles null userEmail", async () => {
      const mockCollectionRef = {};
      mockCollection.mockReturnValue(mockCollectionRef as any);
      mockAddDoc.mockResolvedValue({ id: "vehicle1" } as any);

      await addVehicle({
        vehicleName: "Toyota",
        userId: "user1",
        userEmail: null,
      });

      expect(mockAddDoc).toHaveBeenCalledWith(mockCollectionRef, {
        name: "Toyota",
        userId: "user1",
        userEmail: null,
        createdAt: "timestamp",
      });
    });
  });

  describe("updateVehicle", () => {
    it("throws error when new name is empty", async () => {
      await expect(
        updateVehicle({
          vehicleId: "vehicle1",
          newName: "",
        })
      ).rejects.toThrow("Proszę podać nazwę pojazdu");
      expect(mockDoc).not.toHaveBeenCalled();
      expect(mockUpdateDoc).not.toHaveBeenCalled();
    });

    it("throws error when new name is only whitespace", async () => {
      await expect(
        updateVehicle({
          vehicleId: "vehicle1",
          newName: "   ",
        })
      ).rejects.toThrow("Proszę podać nazwę pojazdu");
      expect(mockUpdateDoc).not.toHaveBeenCalled();
    });

    it("sends request to Firebase when updating vehicle", async () => {
      const mockDocRef = {};
      mockDoc.mockReturnValue(mockDocRef as any);
      mockUpdateDoc.mockResolvedValue(undefined);

      await updateVehicle({
        vehicleId: "vehicle1",
        newName: "Honda Civic",
      });

      expect(mockDoc).toHaveBeenCalledTimes(1);
      expect(mockDoc).toHaveBeenCalledWith(db, "vehicles", "vehicle1");
      expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
      expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
        name: "Honda Civic",
      });
    });

    it("calls updateDoc with trimmed new name", async () => {
      const mockDocRef = {};
      mockDoc.mockReturnValue(mockDocRef as any);
      mockUpdateDoc.mockResolvedValue(undefined);

      await updateVehicle({
        vehicleId: "vehicle1",
        newName: "  Honda Civic  ",
      });

      expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
        name: "Honda Civic",
      });
    });
  });

  describe("deleteVehicle", () => {
    it("sends request to Firebase when deleting vehicle", async () => {
      const mockDocRef = {};
      mockDoc.mockReturnValue(mockDocRef as any);
      mockDeleteDoc.mockResolvedValue(undefined);

      await deleteVehicle("vehicle1");

      expect(mockDoc).toHaveBeenCalledTimes(1);
      expect(mockDoc).toHaveBeenCalledWith(db, "vehicles", "vehicle1");
      expect(mockDeleteDoc).toHaveBeenCalledTimes(1);
      expect(mockDeleteDoc).toHaveBeenCalledWith(mockDocRef);
    });
  });

  describe("showDeleteConfirmation", () => {
    it("shows alert with vehicle name", () => {
      const mockOnConfirm = jest.fn();
      showDeleteConfirmation(
        { vehicleId: "vehicle1", vehicleName: "Toyota Corolla" },
        mockOnConfirm
      );

      expect(Alert.alert).toHaveBeenCalledWith(
        "Usuń pojazd",
        'Czy na pewno chcesz usunąć pojazd "Toyota Corolla"?',
        [
          { text: "Anuluj", style: "cancel" },
          {
            text: "Usuń",
            style: "destructive",
            onPress: mockOnConfirm,
          },
        ]
      );
    });

    it("calls onConfirm when user confirms deletion", () => {
      const mockOnConfirm = jest.fn();
      showDeleteConfirmation(
        { vehicleId: "vehicle1", vehicleName: "Toyota" },
        mockOnConfirm
      );

      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const confirmButton = alertCall[2][1];
      confirmButton.onPress();
      expect(mockOnConfirm).toHaveBeenCalled();
    });
  });

  describe("dismissKeyboard", () => {
    it("calls Keyboard.dismiss", () => {
      dismissKeyboard();
      expect(Keyboard.dismiss).toHaveBeenCalled();
    });
  });
});
