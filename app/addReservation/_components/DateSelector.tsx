import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "../_styles";
import { formatDate } from "../_helpers";

interface DateSelectorProps {
  type: "limited" | "monthly";
  startDate: Date | null;
  endDate: Date | null;
  showStartDatePicker: boolean;
  showEndDatePicker: boolean;
  onStartDatePress: () => void;
  onEndDatePress: () => void;
  onStartDateChange: (event: any, date?: Date) => void;
  onEndDateChange: (event: any, date?: Date) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  type,
  startDate,
  endDate,
  showStartDatePicker,
  showEndDatePicker,
  onStartDatePress,
  onEndDatePress,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <>
      <Text style={styles.label}>
        {type === "monthly" ? "Wybierz miesiąc" : "Data początkowa"}
      </Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={onStartDatePress}
        testID="startDateButton"
      >
        <IconButton icon="calendar" size={20} iconColor="#6200ff" />
        <Text style={styles.dateButtonText}>
          {startDate ? formatDate(startDate) : "Wybierz datę"}
        </Text>
      </TouchableOpacity>
      {type === "limited" && (
        <>
          <Text style={styles.label}>Data końcowa</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={onEndDatePress}
            testID="endDateButton"
          >
            <IconButton icon="calendar" size={20} iconColor="#6200ff" />
            <Text style={styles.dateButtonText}>
              {endDate ? formatDate(endDate) : "Wybierz datę"}
            </Text>
          </TouchableOpacity>
        </>
      )}
      {type === "monthly" && endDate && (
        <View style={styles.autoDateInfo}>
          <Text style={styles.autoDateLabel}>Data końcowa (automatyczna):</Text>
          <Text style={styles.autoDateText}>{formatDate(endDate)}</Text>
        </View>
      )}
      console.log("showStartDatePicker", showStartDatePicker);
      {showStartDatePicker && (
        <DateTimePicker
          testID="startDateTimePicker"
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={onStartDateChange}
          minimumDate={new Date()}
        />
      )}
      {showEndDatePicker && (
        <DateTimePicker
          testID="endDateTimePicker"
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={onEndDateChange}
          minimumDate={startDate || new Date()}
        />
      )}
    </>
  );
};
