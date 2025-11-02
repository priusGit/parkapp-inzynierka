import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { ACCENT_COLOR } from "@/constants/Colors";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { IconButton } from "react-native-paper";
import ReservationCard from "@/components/ReservationCard";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/config/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const HomeScreen = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setReservations([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "reservations"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reservationsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReservations(reservationsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching reservations:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <View style={{ flex: 1 }}>
      <ParallaxScrollView>
        <ThemedView>
          <Text style={styles.title}>Najbliższe rezerwacje:</Text>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#6200ff"
              style={{ marginTop: 20 }}
            />
          ) : reservations.length === 0 ? (
            <Text style={styles.emptyText}>
              Brak rezerwacji. Kliknij + aby dodać nową.
            </Text>
          ) : (
            reservations.map((reservation) => (
              <ReservationCard {...reservation} key={reservation.id} />
            ))
          )}
        </ThemedView>
      </ParallaxScrollView>
      <IconButton
        icon="plus"
        iconColor="white"
        size={32}
        onPress={() => router.push("/addReservation")}
        style={styles.addButton}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: ACCENT_COLOR,
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    fontSize: 16,
  },
});
