import { Text, View, Image, ActivityIndicator, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { ACCENT_COLOR } from "@/constants/Colors";
import { Button, IconButton } from "react-native-paper";
import { styles } from "./_styles";
import { useParkingDetails } from "./_hooks";

export default function ReservationDetailsScreen() {
  const { name, startDate, endDate, placeId } = useLocalSearchParams();
  const { parking, loading, navigate } = useParkingDetails(placeId);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={ACCENT_COLOR} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Szczegóły rezerwacji</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.card}>
          <Image
            source={{ uri: parking?.img }}
            style={styles.parkingImage}
            resizeMode="cover"
          />
          <Text style={styles.parkingName}>{parking?.name}</Text>
          <MaterialCommunityIcons
            name="car"
            size={40}
            color={ACCENT_COLOR}
            style={styles.icon}
          />
          <Text style={styles.title}>{name}</Text>
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="calendar-start"
              size={22}
              color={ACCENT_COLOR}
            />
            <Text style={styles.label}>Od:</Text>
            <Text style={styles.value}>{startDate}</Text>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="calendar-end"
              size={22}
              color={ACCENT_COLOR}
            />
            <Text style={styles.label}>Do:</Text>
            <Text style={styles.value}>{endDate}</Text>
          </View>
          <Button
            icon="directions"
            mode="contained"
            onPress={navigate}
            buttonColor={ACCENT_COLOR}
            style={{ marginTop: 16 }}
          >
            Nawiguj
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
