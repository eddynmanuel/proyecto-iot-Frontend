"use client";

import { useState, useEffect, useCallback } from "react";

interface TimeData {
  current_time: string; // ISO 8601 format
  timezone_name: string;
  timezone_offset_seconds: number;
  location_name: string;
  utc_time: string;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
  name: string;
}

export function useTimeData() {
  const [timeData, setTimeData] = useState<TimeData | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTime = useCallback(async (_latitude: number, _longitude: number) => {
    try {
      setLoading(true);
      setError(null);

      // Use local time instead of API
      const now = new Date();
      setTimeData({
        current_time: now.toISOString(),
        timezone_name: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezone_offset_seconds: -now.getTimezoneOffset() * 60,
        location_name: "Local",
        utc_time: now.toUTCString(),
      });

      setCurrentTime(now);
    } catch (err: any) {
      const errorMessage = err?.message || "Error al obtener hora";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar reloj local cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prevTime) => {
        const newTime = new Date(prevTime.getTime() + 1000);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Cargar hora inicial y sincronizar con servidor periódicamente
  useEffect(() => {
    const loadTime = () => {
      const saved = localStorage.getItem("userLocation");

      if (saved) {
        try {
          const location: LocationCoords = JSON.parse(saved);
          fetchTime(location.latitude, location.longitude);
        } catch (e) {
          setError("No se pudo cargar la ubicación guardada");
        }
      } else {
        // Fallback a Lima, Perú si no hay ubicación guardada
        fetchTime(-12.0464, -77.0428);
      }
    };

    loadTime(); // Carga inicial

    // Sincronizar con servidor cada 5 minutos para corregir drift
    const interval = setInterval(loadTime, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchTime]);

  return {
    timeData,
    currentTime,
    loading,
    error,
    refetch: fetchTime,
  };
}
