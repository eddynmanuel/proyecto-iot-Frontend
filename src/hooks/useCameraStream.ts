import { useEffect, useState } from "react";

interface UseCameraStreamOptions {
  cameraId: string;
  enabled: boolean;
  apiBaseUrl?: string;
}

// Mock camera placeholder image (1x1 pixel placeholder)
const MOCK_CAMERA_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23111827' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='Arial' font-size='16'%3ECámara Simulada%3C/text%3E%3C/svg%3E";

export function useCameraStream({
  cameraId,
  enabled,
}: UseCameraStreamOptions) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setImageUrl(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate loading delay
    const timer = setTimeout(() => {
      setImageUrl(MOCK_CAMERA_IMAGE);
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [cameraId, enabled]);

  return { imageUrl, error, isLoading };
}
