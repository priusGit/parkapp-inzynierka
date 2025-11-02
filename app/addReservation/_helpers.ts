export const formatDate = (date: Date | null): string => {
  if (!date) return "";
  return date.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateForFirestore = (date: Date): string => {
  const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  return utcDate.toISOString().split("T")[0];
};

export const calculateMonthEndDate = (startDate: Date): Date => {
  return new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
};
