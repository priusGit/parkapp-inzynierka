import { useState, useEffect } from "react";
import { Alert, Clipboard } from "react-native";
import { User } from "firebase/auth";
import { db } from "@/config/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

export const useClients = (user: User | null) => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessCode, setAccessCode] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchClientsAndAccessCode = async () => {
      if (!user) {
        setClients([]);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        if (!userData) {
          setLoading(false);
          return;
        }

        if (userData.role !== "admin") {
          setIsAdmin(false);
          setLoading(false);
          Alert.alert(
            "Błąd",
            "Tylko administratorzy mogą przeglądać listę klientów"
          );
          return;
        }

        setIsAdmin(true);
        console.log("Admin data:", userData);
        console.log("Access code:", userData.accessCode);
        setAccessCode(userData.accessCode || "");

        const clientsQuery = query(
          collection(db, "users"),
          where("parkingOwnerId", "==", user.uid)
        );
        const querySnapshot = await getDocs(clientsQuery);

        const clientsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setClients(clientsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clients:", error);
        Alert.alert("Błąd", "Nie udało się pobrać listy klientów");
        setLoading(false);
      }
    };

    fetchClientsAndAccessCode();
  }, [user]);

  const copyAccessCode = () => {
    if (accessCode) {
      Clipboard.setString(accessCode);
      Alert.alert(
        "Skopiowano! ✓",
        "Kod zaproszeniowy został skopiowany do schowka"
      );
    }
  };

  return {
    clients,
    loading,
    accessCode,
    isAdmin,
    copyAccessCode,
  };
};

