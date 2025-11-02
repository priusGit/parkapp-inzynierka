import { ACCENT_COLOR } from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, Text, View } from "react-native";
import { IconButton } from "react-native-paper";
import { getDate, getPlaceName } from "@/helpers/homeHelpers";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const types = {
  limited: "Dniowy",
  monthly: "Miesięczny",
};

type ReservationCardProps = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  placeId: string | number;
  type?: "limited" | "monthly";
};

const ReservationCard = ({
  id,
  name,
  startDate,
  endDate,
  placeId,
  type,
}: ReservationCardProps) => {
  const [parkingName, setParkingName] = useState<string>("Parking...");

  useEffect(() => {
    const fetchParkingName = async () => {
      if (typeof placeId === "string") {
        try {
          const parkingDoc = await getDoc(doc(db, "parkings", placeId));
          if (parkingDoc.exists()) {
            setParkingName(parkingDoc.data().name);
          } else {
            setParkingName("Parking");
          }
        } catch (error) {
          console.error("Error fetching parking:", error);
          setParkingName("Parking");
        }
      } else {
        setParkingName(getPlaceName(placeId));
      }
    };

    fetchParkingName();
  }, [placeId]);

  return (
    <View
      key={id}
      style={styles.reservationContainer}
      onTouchStart={() =>
        router.push({
          pathname: "/reservationDetails",
          params: {
            id,
            name,
            startDate,
            endDate,
            placeId,
          },
        })
      }
    >
      <View>
        {type && <Text style={styles.date}>{types[type]}</Text>}
        <View style={styles.titleContainer}>
          <FontAwesome name="dot-circle-o" size={12} color="white" />
          <Text style={styles.date}>
            {getDate(startDate)} - {getDate(endDate)}
          </Text>
        </View>
        <Text style={styles.car}>{parkingName}</Text>
        <Text style={styles.placeTitle}>{name}</Text>
      </View>
      <IconButton
        icon="chevron-right"
        iconColor="white"
        size={32}
        style={{ margin: 0, padding: 0 }}
      />
    </View>
  );
};

export default ReservationCard;

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reservationContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: ACCENT_COLOR,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 0,
  },
  date: {
    color: "white",
    fontWeight: 500,
    fontSize: 14,
  },
  car: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  placeTitle: {
    color: "white",
    fontSize: 14,
    marginTop: 4,
  },
});
