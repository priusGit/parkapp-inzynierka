import { PLACES } from "@/constants/Data";

export const getDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}.${month}`;
};

export const getPlaceName = (placeId: number) => {
  console.log(placeId);
  const place = PLACES.find((p) => p.id == placeId);
  return place ? place.name : "Parking (sprawdź szczegóły)";
};

export const getPlace = (placeId: number) => {
  const place = PLACES.find((p) => p.id == placeId);
  console.log(place);
  return place
    ? place
    : {
        id: 0,
        name: "Parking",
        adress: "Nieznany",
        img: "https://i.imgur.com/F7PBwz3J.png",
      };
};
