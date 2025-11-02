import { StyleSheet } from "react-native";
import { ACCENT_COLOR } from "@/constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3f2fd",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 8,
    backgroundColor: "#e3f2fd",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: ACCENT_COLOR,
  },
  card: {
    marginTop: 16,
    marginHorizontal: 24,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    width: "90%",
    maxWidth: 350,
    shadowColor: ACCENT_COLOR,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  parkingImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: ACCENT_COLOR,
  },
  placeholderImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: ACCENT_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  parkingName: {
    fontSize: 18,
    fontWeight: "600",
    color: ACCENT_COLOR,
    marginBottom: 16,
    textAlign: "center",
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: ACCENT_COLOR,
    marginBottom: 18,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
    justifyContent: "center",
  },
  label: {
    fontWeight: "700",
    color: ACCENT_COLOR,
    marginLeft: 8,
    marginRight: 4,
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    color: "#22223b",
    fontWeight: "500",
  },
});
