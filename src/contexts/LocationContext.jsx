import { createContext, useContext, useState } from "react";
import { getCurrentLocation } from "../api/services/locationService";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
    googleMapLink: "",
  });
  const loadLocation = async () => {
    try {
      const { latitude, longitude, googleMapLink } = await getCurrentLocation();
      setLocation({
        latitude,
        longitude,
        googleMapLink,
      });
      return googleMapLink;
    } catch (err) {
      console.log(err);
      setLocation({
        latitude: "Denied",
        longitude: "Denied",
        googleMapLink: "Denied",
      });
    }
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, loadLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
export const useUserLocation = () => useContext(LocationContext);
