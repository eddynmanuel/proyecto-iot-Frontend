"use client";

import { useState, useEffect, useCallback } from "react";

interface LocationData {
  latitude: number;
  longitude: number;
  name: string;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);

  // Cargar ubicación guardada
  useEffect(() => {
    const saved = localStorage.getItem("userLocation");
    if (saved) {
      try {
        setLocation(JSON.parse(saved));
      } catch (e) {
      }
    }
  }, []);

  // Actualizar ubicación y guardarla localmente
  const handleLocationChange = useCallback(
    async (latitude: number, longitude: number, locationName: string) => {
      const newLocation: LocationData = {
        latitude,
        longitude,
        name: locationName,
      };

      setLocation(newLocation);
      localStorage.setItem("userLocation", JSON.stringify(newLocation));
    },
    []
  );

  return {
    location,
    handleLocationChange,
  };
}
