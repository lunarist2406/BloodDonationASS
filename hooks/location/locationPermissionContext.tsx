import React, { createContext, useContext, useEffect, useState } from "react";

interface LocationPermissionContextType {
  locationAllowed: boolean;
  setLocationAllowed: (value: boolean) => void;
}

const LocationPermissionContext = createContext<LocationPermissionContextType | undefined>(undefined);

export const LocationPermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locationAllowed, setLocationAllowed] = useState(false);

  useEffect(() => {
  console.log("locationAllowed changed to:", locationAllowed);
}, [locationAllowed]);


  return (
    <LocationPermissionContext.Provider value={{ locationAllowed, setLocationAllowed }}>
      {children}
    </LocationPermissionContext.Provider>
  );
};


export const useLocationPermission = () => {
  const context = useContext(LocationPermissionContext);
  if (!context) {
    throw new Error("useLocationPermission must be used within a LocationPermissionProvider");
  }
  return context;
};
