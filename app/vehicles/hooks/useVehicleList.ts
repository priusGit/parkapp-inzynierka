import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { db } from "@/config/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export const useVehicleList = (user: User | null) => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setVehicles([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "vehicles"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const vehiclesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVehicles(vehiclesData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching vehicles:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return {
    vehicles,
    loading,
  };
};
