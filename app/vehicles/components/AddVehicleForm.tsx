import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { styles } from "../_styles";

interface AddVehicleFormProps {
  vehicleName: string;
  setVehicleName: (name: string) => void;
  isLoading: boolean;
  actions: {
    submit: () => void;
    cancel: () => void;
  };
}

export const AddVehicleForm: React.FC<AddVehicleFormProps> = ({
  vehicleName,
  setVehicleName,
  isLoading,
  actions,
}) => {
  return (
    <View style={styles.addFormContainer}>
      <Text style={styles.formTitle}>Nowy pojazd</Text>
      <TextInput
        style={styles.input}
        placeholder="Nazwa pojazdu (np. Toyota Corolla)"
        value={vehicleName}
        onChangeText={setVehicleName}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={actions.submit}
      />
      <View style={styles.formButtons}>
        <TouchableOpacity
          style={[styles.formButton, styles.cancelButton]}
          onPress={actions.cancel}
        >
          <Text style={styles.cancelButtonText}>Anuluj</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.formButton, styles.saveButton]}
          onPress={actions.submit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" testID="loading-indicator" />
          ) : (
            <Text style={styles.saveButtonText}>Dodaj</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
