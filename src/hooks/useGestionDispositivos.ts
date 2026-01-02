// useGestionDispositivos.ts
"use client";

import { useState, useEffect } from "react";

export interface Device {
  id: number;
  name: string;
  power: string;
  on: boolean;
  device_type: string;
  state_json: { status: string };
  last_updated: string;
}

// Mock devices data
const mockDevices: Device[] = [
  { id: 1, name: "Luz Sala", power: "60W", on: true, device_type: "luz", state_json: { status: "ON" }, last_updated: new Date().toISOString() },
  { id: 2, name: "Luz Cocina", power: "40W", on: false, device_type: "luz", state_json: { status: "OFF" }, last_updated: new Date().toISOString() },
  { id: 3, name: "Ventilador", power: "75W", on: true, device_type: "ventilador", state_json: { status: "ON" }, last_updated: new Date().toISOString() },
  { id: 4, name: "Aire Acondicionado", power: "1500W", on: false, device_type: "clima", state_json: { status: "OFF" }, last_updated: new Date().toISOString() },
  { id: 5, name: "Puerta Principal", power: "10W", on: false, device_type: "puerta", state_json: { status: "CLOSE" }, last_updated: new Date().toISOString() },
];

const mockDeviceTypes = ["luz", "ventilador", "clima", "puerta"];

export function useGestionDispositivos() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<string[]>([]);
  const [energyUsage, setEnergyUsage] = useState<number>(0);
  const [energyHistory, setEnergyHistory] = useState<number[]>([]);
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>("Todos");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");

  useEffect(() => {
    const loadAllDevices = async () => {
      try {
        setDeviceTypes(mockDeviceTypes);
        setAllDevices(mockDevices);
        setDevices(mockDevices);
      } catch (error) {
      }
    };

    loadAllDevices();
    loadEnergyData();
  }, []);

  const loadEnergyData = async () => {
    try {
      // Mock energy history data
      const mockHistory = Array.from({ length: 24 }, (_, i) =>
        Math.floor(Math.random() * 500) + 200
      );
      setEnergyHistory(mockHistory);
      if (mockHistory.length > 0) {
        setEnergyUsage(mockHistory[mockHistory.length - 1]);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    let currentFilteredDevices = allDevices;

    if (deviceTypeFilter !== "Todos") {
      currentFilteredDevices = currentFilteredDevices.filter(
        (device) => device.device_type === deviceTypeFilter
      );
    }

    if (statusFilter === "Encendidos") {
      currentFilteredDevices = currentFilteredDevices.filter(
        (device) => device.on
      );
    } else if (statusFilter === "Apagados") {
      currentFilteredDevices = currentFilteredDevices.filter(
        (device) => !device.on
      );
    }

    setDevices(currentFilteredDevices);
  }, [deviceTypeFilter, statusFilter, allDevices]);

  const costPerKWH = 0.15;
  const estimatedDailyCost = (energyUsage / 1000) * 24 * costPerKWH;
  const estimatedMonthlyCost = estimatedDailyCost * 30;
  const estimatedAnnualCost = estimatedMonthlyCost * 12;

  const toggleDevice = async (id: number) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === id ? { ...device, on: !device.on } : device
      )
    );

    setAllDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === id ? { ...device, on: !device.on } : device
      )
    );

    const deviceToToggle = devices.find((device) => device.id === id);
    if (!deviceToToggle) return;

    const newStatus =
      deviceToToggle.device_type === "puerta"
        ? deviceToToggle.on
          ? "CLOSE"
          : "OPEN"
        : deviceToToggle.on
          ? "OFF"
          : "ON";

    try {
      // Mock API call - just update local state
      console.log(`Device ${id} toggled to ${newStatus}`);
    } catch (error) {
      // Revert on error
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.id === id ? { ...device, on: !device.on } : device
        )
      );
    }
  };

  return {
    devices,
    setDevices,
    energyUsage,
    setEnergyUsage,
    deviceTypeFilter,
    setDeviceTypeFilter,
    statusFilter,
    setStatusFilter,
    toggleDevice,
    costPerKWH,
    estimatedDailyCost,
    estimatedMonthlyCost,
    estimatedAnnualCost,
    deviceTypes,
    energyHistory,
  };
}
