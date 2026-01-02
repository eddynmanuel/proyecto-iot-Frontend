import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./useAuth";

export const useTemperatureData = () => {
  const { accessToken } = useAuth();
  const [temperatureHistory, setTemperatureHistory] = useState<number[]>([]);
  const [currentTemperature, setCurrentTemperature] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  const requestTemperature = useCallback(async () => {
    if (!accessToken) return;

    try {
      // Mock temperature data
      const mockTemp = Math.floor(Math.random() * 10) + 20; // 20-30°C
      setCurrentTemperature(mockTemp);
    } catch (error) {
    }
  }, [accessToken]);

  const fetchTemperatureHistory = useCallback(async () => {
    if (!accessToken) return;

    try {
      // Mock temperature history data
      const data = Array.from({ length: 24 }, () =>
        Math.floor(Math.random() * 10) + 20
      );
      setTemperatureHistory(data);

      // Actualizar temperatura actual con el último valor del historial si no tenemos una reciente
      if (data.length > 0 && currentTemperature === null) {
        setCurrentTemperature(data[data.length - 1]);
      }
    } catch (error) {
      setTemperatureHistory([]);
    }
  }, [accessToken, currentTemperature]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Primero solicitar temperatura via MQTT (esto guarda en DB)
      await requestTemperature();

      // Luego obtener el historial
      await fetchTemperatureHistory();

      setLoading(false);
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken, requestTemperature, fetchTemperatureHistory]);

  return {
    temperatureHistory,
    currentTemperature,
    loading,
    requestTemperature,
  };
};
