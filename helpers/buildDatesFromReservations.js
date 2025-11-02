import { ACCENT_COLOR } from "@/constants/Colors";

export const buildMarkedDatesFromReservations = (
  reservations,
  selectedDate = ""
) => {
  const COLORS = ["red", "blue", "green", "orange", "purple"];
  const marked = {};

  reservations.forEach((res, index) => {
    const color = COLORS[index % COLORS.length];
    const key = `res-${res.id}`;
    const days = getDateRange(res.startDate, res.endDate);

    days.forEach((date) => {
      if (!marked[date]) {
        marked[date] = { dots: [] };
      }
      marked[date].dots.push({ key, color });
    });
  });

  if (selectedDate) {
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: ACCENT_COLOR,
      selectedTextColor: "white",
      dots: marked[selectedDate]?.dots || [],
    };
  }

  return marked;
};

function getDateRange(start, end) {
  const dates = [];
  let current = new Date(start);
  const last = new Date(end);

  while (current <= last) {
    const dateStr = current.toISOString().split("T")[0];
    dates.push(dateStr);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}
