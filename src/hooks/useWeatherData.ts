"use client";

import { useState, useEffect, useCallback } from "react";

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  wind_speed: number;
  feels_like: number;
  pressure: number;
  visibility: number;
  location_name?: string;
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_sum: number[];
  };
}

interface LocationCoords {
  latitude: number;
  longitude: number;
  name: string;
}

export function useWeatherData() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(
    async (_latitude: number, _longitude: number) => {
      try {
        setLoading(true);
        setError(null);

        // Mock weather data
        const weatherData = {
          temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
          description: ["Soleado", "Parcialmente nublado", "Nublado", "Lluvia ligera"][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
          wind_speed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
          feels_like: Math.floor(Math.random() * 15) + 15,
          pressure: Math.floor(Math.random() * 50) + 1000, // 1000-1050 hPa
          visibility: Math.floor(Math.random() * 5000) + 5000, // 5-10 km
          location_name: "Local",
          daily: {
            time: Array.from({ length: 7 }, (_, i) => new Date(Date.now() + i * 86400000).toISOString()),
            temperature_2m_max: Array.from({ length: 7 }, () => Math.floor(Math.random() * 10) + 25),
            temperature_2m_min: Array.from({ length: 7 }, () => Math.floor(Math.random() * 10) + 15),
            weather_code: Array.from({ length: 7 }, () => Math.floor(Math.random() * 4)),
            precipitation_sum: Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)),
          },
        };

        setWeather(weatherData);
      } catch (err: any) {
        const errorMessage = err?.message || "Error al obtener clima";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Cargar clima inicial y configurar actualización automática
  useEffect(() => {
    const loadWeather = () => {
      const saved = localStorage.getItem("userLocation");

      if (saved) {
        try {
          const location: LocationCoords = JSON.parse(saved);
          fetchWeather(location.latitude, location.longitude);
        } catch (e) {
          setError("No se pudo cargar la ubicación guardada");
        }
      } else {
        // Fallback a Lima, Perú si no hay ubicación guardada
        fetchWeather(-12.0464, -77.0428);
      }
    };

    loadWeather(); // Carga inicial

    // Actualizar cada 10 minutos
    const interval = setInterval(loadWeather, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchWeather]);

  return {
    weather,
    loading,
    error,
    refetch: fetchWeather,
  };
}
