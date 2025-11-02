import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { styles } from "../_styles";

interface EditVehicleCardProps {
  value: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const EditVehicleCard: React.FC<EditVehicleCardProps> = ({
  value,
  onChangeText,
  onSave,
  onCancel,
}) => {
  return (
    <View style={styles.editCard}>
      <TextInput
        style={styles.editInput}
        value={value}
        onChangeText={onChangeText}
        autoFocus
      />
      <View style={styles.editButtons}>
        <TouchableOpacity style={styles.editButtonCancel} onPress={onCancel}>
          <Text style={styles.editButtonCancelText}>Anuluj</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButtonSave} onPress={onSave}>
          <Text style={styles.editButtonSaveText}>Zapisz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
