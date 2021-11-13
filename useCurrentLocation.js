import { useState } from "react";
import { sessionStorage } from "./Storage";

export default function useCurrentLocation() {
  const retrieveLocation = () => {
    const locationString = sessionStorage.getItem("currentLocation");
    if (locationString) {
      const locationObj = JSON.parse(locationString);
      return locationObj;
    } else {
      return null;
    }
  };

  const [location, setLocation] = useState(retrieveLocation);

  const saveLocation = (locationObj) => {
    sessionStorage.setItem("currentLocation", JSON.stringify(locationObj));
    setLocation(locationObj);
  };

  removeLocation = () => {
    sessionStorage.removeItem("currentLocation");
  };

  return {
    setLocation: saveLocation,
    clearLocation: removeLocation,
    getLocation: retrieveLocation,
    location,
  };
}
