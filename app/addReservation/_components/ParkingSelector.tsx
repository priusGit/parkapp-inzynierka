import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { IconButton } from "react-native-paper";
import { styles } from "../_styles";

interface ParkingSelectorProps {
  parkings: any[];
  loading: boolean;
  selectedPlaceId: string | null;
  onSelect: (id: string) => void;
}

export const ParkingSelector: React.FC<ParkingSelectorProps> = ({
  parkings,
  loading,
  selectedPlaceId,
  onSelect,
}) => {
  if (loading) {
    return (
      <ActivityIndicator
        size="small"
        color="#6200ff"
        style={{ marginVertical: 20 }}
      />
    );
  }

  if (parkings.length === 0) {
    return <Text style={styles.emptyText}>Brak dostępnych parkingów</Text>;
  }

  return (
    <>
      {parkings.map((place) => (
        <TouchableOpacity
          key={place.id}
          style={[
            styles.placeCard,
            selectedPlaceId === place.id && styles.placeCardActive,
          ]}
          onPress={() => onSelect(place.id)}
        >
          <View>
            <Text style={styles.placeName}>{place.name}</Text>
            <Text style={styles.placeAddress}>{place.address}</Text>
          </View>
          {selectedPlaceId === place.id && (
            <IconButton icon="check-circle" iconColor="#6200ff" size={24} />
          )}
        </TouchableOpacity>
      ))}
    </>
  );
};
