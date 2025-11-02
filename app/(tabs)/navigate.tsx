import ParallaxScrollView from "@/components/ParallaxScrollView";
import LocalizationCard from "@/components/LocalizationCard";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/config/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, StyleSheet } from "react-native";

export default function TabTwoScreen() {
  const { user } = useAuth();
  const [parkings, setParkings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParkings = async () => {
      if (!user) {
        setParkings([]);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        if (!userData) {
          setParkings([]);
          setLoading(false);
          return;
        }

        const ownerId =
          userData.role === "admin" ? user.uid : userData.parkingOwnerId;

        if (!ownerId) {
          setParkings([]);
          setLoading(false);
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching parkings:", error);
        setLoading(false);
      }
    };

    fetchParkings();
  }, [user]);

  if (loading) {
    return (
      <ParallaxScrollView>
        <ActivityIndicator
          size="large"
          color="#6200ff"
          style={{ marginTop: 20 }}
        />
      </ParallaxScrollView>
    );
  }

  if (parkings.length === 0) {
    return (
      <ParallaxScrollView>
        <Text style={styles.emptyText}>Brak dostępnych parkingów</Text>
      </ParallaxScrollView>
    );
  }

  return (
    <ParallaxScrollView>
      {parkings.map((parking) => (
        <LocalizationCard key={parking.id} parking={parking} />
      ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    fontSize: 16,
  },
});
