"use client";

import { useState, useCallback } from "react";

interface CameraBackendInfo {
  id: string;
  label: string;
  source: string | number;
  active: boolean;
  recognition_enabled: boolean;
}

// Mock cameras data
const mockCameras: CameraBackendInfo[] = [
  {
    id: "door",
    label: "Puerta Principal",
    source: 0,
    active: false,
    recognition_enabled: true,
  },
  {
    id: "living",
    label: "Sala de Estar",
    source: 1,
    active: false,
    recognition_enabled: false,
  },
  {
    id: "kitchen",
    label: "Cocina",
    source: 2,
    active: false,
    recognition_enabled: false,
  },
];

export function useSecurityCameras() {
  const [systemOn, setSystemOnState] = useState(false);
  const [camerasList] = useState<CameraBackendInfo[]>(mockCameras);
  const [cameraStates, setCameraStates] = useState<Record<string, boolean>>({
    door: false,
    living: false,
    kitchen: false,
  });

  const toggleCamera = useCallback(
    (cameraId: string) => {
      if (!systemOn) return;

      setCameraStates((prev) => ({
        ...prev,
        [cameraId]: !prev[cameraId],
      }));
    },
    [systemOn]
  );

  const toggleSystem = useCallback(
    (state: boolean) => {
      setSystemOnState(state);
      if (!state) {
        // Si apagas el sistema, desactiva todas las cámaras
        const newStates: Record<string, boolean> = {};
        Object.keys(cameraStates).forEach((camId) => {
          newStates[camId] = false;
        });
        setCameraStates(newStates);
      }
    },
    [cameraStates]
  );

  const activeCameras = Object.values(cameraStates).filter(Boolean).length;

  const isCameraActive = useCallback(
    (cameraId: string): boolean => {
      return cameraStates[cameraId] && systemOn;
    },
    [cameraStates, systemOn]
  );

  return {
    systemOn,
    setSystemOn: toggleSystem,
    camerasList,
    cameraStates,
    toggleCamera,
    activeCameras,
    isCameraActive,
  };
}
