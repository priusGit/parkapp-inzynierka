type Reservation = {
  id: number;
  type?: "monthly" | "limited";
  startDate: string;
  endDate: string;
  name: string;
  placeId: number;
};

export const getReservationsForDate = (
  dateStr: string,
  reservations: Reservation[] = []
) => {
  const targetDate = new Date(dateStr);

  return reservations.filter(({ startDate, endDate, type }) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return targetDate >= start && targetDate <= end;
  });
};
