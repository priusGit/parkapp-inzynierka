import { User } from "firebase/auth";
import { useFetchData } from "./useFetchData";
import { useReservationForm } from "./useReservationForm";

export const useAddReservation = (user: User | null) => {
  const { vehicles, loadingVehicles, parkings, loadingParkings } =
    useFetchData(user);

  const formState = useReservationForm(user, vehicles, parkings);

  return {
    vehicles,
    loadingVehicles,
    parkings,
    loadingParkings,
    ...formState,
  };
};
