import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export const useEnergyData = () => {
  const { accessToken } = useAuth();
  const [energyHistory, setEnergyHistory] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEnergyData = async () => {
      setLoading(true);
      try {
        // Mock energy data
        const mockData = Array.from({ length: 24 }, (_, _i) =>
          Math.floor(Math.random() * 500) + 200
        );
        setEnergyHistory(mockData);
      } catch (error) {
        setEnergyHistory([]);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchEnergyData();
    }
  }, [accessToken]);

  return { energyHistory, loading };
};
