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
        latitude: latitude,
        longitude: longitude,
        googleMapLink: googleMapLink,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, loadLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
export const useLocation = () => useContext(LocationContext);
