import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../_styles";

interface TypeSelectorProps {
  type: "limited" | "monthly";
  onChange: (type: "limited" | "monthly") => void;
}

export const TypeSelector: React.FC<TypeSelectorProps> = ({
  type,
  onChange,
}) => {
  return (
    <View style={styles.typeContainer}>
      <TouchableOpacity
        style={[
          styles.typeButton,
          type === "limited" && styles.typeButtonActive,
        ]}
        onPress={() => onChange("limited")}
      >
        <Text
          style={[styles.typeText, type === "limited" && styles.typeTextActive]}
        >
          Ograniczona
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.typeButton,
          type === "monthly" && styles.typeButtonActive,
        ]}
        onPress={() => onChange("monthly")}
      >
        <Text
          style={[styles.typeText, type === "monthly" && styles.typeTextActive]}
        >
          Miesięczna
        </Text>
      </TouchableOpacity>
    </View>
  );
};
