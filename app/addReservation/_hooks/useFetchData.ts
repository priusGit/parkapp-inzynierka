import { useState, useEffect } from "react";
import { Alert } from "react-native";
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

export const useFetchData = (user: User | null) => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [parkings, setParkings] = useState<any[]>([]);
  const [loadingParkings, setLoadingParkings] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!user) {
        setVehicles([]);
        setLoadingVehicles(false);
        return;
      }

      try {
        const q = query(
          collection(db, "vehicles"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const vehiclesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVehicles(vehiclesData);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        Alert.alert("Błąd", "Nie udało się pobrać listy pojazdów");
      } finally {
        setLoadingVehicles(false);
      }
    };

    fetchVehicles();
  }, [user]);

  useEffect(() => {
    const fetchParkings = async () => {
      if (!user) {
        setParkings([]);
        setLoadingParkings(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        if (!userData) {
          setParkings([]);
          setLoadingParkings(false);
          return;
        }

        const ownerId =
          userData.role === "admin" ? user.uid : userData.parkingOwnerId;

        if (!ownerId) {
          setParkings([]);
          setLoadingParkings(false);
          return;
        }

        const parkingsQuery = query(
          collection(db, "parkings"),
          where("ownerId", "==", ownerId)
        );
        const querySnapshot = await getDocs(parkingsQuery);

        const parkingsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setParkings(parkingsData);
      } catch (error) {
        console.error("Error fetching parkings:", error);
        Alert.alert("Błąd", "Nie udało się pobrać listy parkingów");
      } finally {
        setLoadingParkings(false);
      }
    };

    fetchParkings();
  }, [user]);

  return {
    vehicles,
    loadingVehicles,
    parkings,
    loadingParkings,
  };
};
