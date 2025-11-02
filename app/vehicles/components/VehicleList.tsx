import React from "react";
import { View, Text, FlatList } from "react-native";
import { VehicleCard } from "./VehicleCard";
import { EditVehicleCard } from "./EditVehicleCard";
import { styles } from "../_styles";

interface VehicleListProps {
  vehicles: any[];
  showAddForm: boolean;
  editingVehicle: any;
  editedName: string;
  setEditedName: (name: string) => void;
  actions: {
    edit: {
      start: (vehicle: any) => void;
      save: () => void;
      cancel: () => void;
    };
    delete: {
      remove: (id: string, name: string) => void;
    };
  };
}

export const VehicleList: React.FC<VehicleListProps> = ({
  vehicles,
  showAddForm,
  editingVehicle,
  editedName,
  setEditedName,
  actions,
}) => {
  const renderVehicle = ({ item }: { item: any }) => {
    if (editingVehicle?.id === item.id) {
      return (
        <EditVehicleCard
          value={editedName}
          onChangeText={setEditedName}
          onSave={actions.edit.save}
          onCancel={actions.edit.cancel}
        />
      );
    }

    return (
      <VehicleCard
        item={item}
        onEdit={actions.edit.start}
        onDelete={actions.delete.remove}
      />
    );
  };

  if (vehicles.length === 0 && !showAddForm) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Brak pojazdów</Text>
        <Text style={styles.emptySubtext}>
          Dodaj swój pierwszy pojazd, aby rozpocząć
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={vehicles}
      renderItem={renderVehicle}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
    />
  );
};
