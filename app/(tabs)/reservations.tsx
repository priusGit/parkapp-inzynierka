import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Calendar } from "react-native-calendars";
import { useState, useEffect } from "react";
import { buildMarkedDatesFromReservations } from "@/helpers/buildDatesFromReservations";
import { getReservationsForDate } from "@/helpers/date";
import ReservationCard from "@/components/ReservationCard";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/config/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export default function Resevations() {
  const { user } = useAuth();
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
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
      where("userId", "==", user.uid)
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

  const markedDates = buildMarkedDatesFromReservations(
    reservations,
    selectedDate
  );

  const reservationsOnDate = getReservationsForDate(selectedDate, reservations);

  return (
    <ParallaxScrollView>
      <Calendar
        markingType={"multi-dot"}
        markedDates={markedDates}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ff" />
          <Text style={styles.loadingText}>Ładowanie rezerwacji...</Text>
        </View>
      ) : reservationsOnDate.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Brak rezerwacji w wybranym dniu</Text>
        </View>
      ) : (
        reservationsOnDate.map((reservation) => (
          <ReservationCard {...reservation} key={reservation.id} />
        ))
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});
