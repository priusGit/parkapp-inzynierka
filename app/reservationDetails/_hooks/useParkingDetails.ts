import { useState, useEffect } from "react";
import { db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getPlace } from "@/helpers/homeHelpers";
import { openNavigation } from "@/helpers/openNavigation";

export const useParkingDetails = (placeId: string | string[] | undefined) => {
  const [parking, setParking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParking = async () => {
      if (typeof placeId === "string" && placeId.length > 5) {
        try {
          const parkingDoc = await getDoc(doc(db, "parkings", placeId));
          if (parkingDoc.exists()) {
            setParking({
              name: parkingDoc.data().name,
              address: parkingDoc.data().address,
              img: parkingDoc.data().img,
            });
          } else {
            setParking({
              name: "Parking",
              address: "Nieznany",
              img: "https://i.imgur.com/F7PBz3J.png",
            });
          }
        } catch (error) {
          console.error("Error fetching parking:", error);
          setParking({
            name: "Parking",
            address: "Nieznany",
            img: "https://i.imgur.com/F7PBz3J.png",
          });
        }
      } else {
        const oldPlace = getPlace(Number(placeId));
        setParking({
          name: oldPlace.name,
          address: oldPlace.adress,
          img: oldPlace.img,
        });
      }
      setLoading(false);
    };

    fetchParking();
  }, [placeId]);

  const navigate = () => {
    if (parking) {
      openNavigation(parking.address);
    }
  };

  return {
    parking,
    loading,
    navigate,
  };
};


