import React from "react";
import { View, Text } from "react-native";
import { IconButton } from "react-native-paper";
import { styles } from "../_styles";

interface VehicleCardProps {
  item: {
    id: string;
    name: string;
  };
  onEdit: (item: any) => void;
  onDelete: (id: string, name: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.vehicleCard}>
      <View style={styles.vehicleInfo}>
        <IconButton icon="car" size={32} iconColor="#6200ff" />
        <Text style={styles.vehicleName}>{item.name}</Text>
      </View>
      <View style={styles.vehicleActions}>
        <IconButton
          icon="pencil"
          size={20}
          iconColor="#6200ff"
          onPress={() => onEdit(item)}
          testID="edit-button"
          accessibilityLabel="Edytuj pojazd"
        />
        <IconButton
          icon="delete"
          size={20}
          iconColor="#ff3b30"
          onPress={() => onDelete(item.id, item.name)}
          testID="delete-button"
          accessibilityLabel="Usuń pojazd"
        />
      </View>
    </View>
  );
};
