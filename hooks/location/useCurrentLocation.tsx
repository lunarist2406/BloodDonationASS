import { useRef } from "react";

export function useLocationCache() {
  const locationCacheRef = useRef<{ lat: number; lng: number } | null>(null);

  const setLocationCache = (lat: number, lng: number) => {
    locationCacheRef.current = { lat, lng };
  };

  const getLocationCache = (): { lat: number; lng: number } | null => {
    return locationCacheRef.current;
  };

  const clearLocationCache = () => {
    locationCacheRef.current = null;
  };

  return {
    setLocationCache,
    getLocationCache,
    clearLocationCache,
  };
}
