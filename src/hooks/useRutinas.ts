import { useState } from "react";

// Types and interfaces
export interface FormState {
  name: string;
  description: string;
  enabled: boolean;
  triggerType: "NLP" | "Tiempo" | "Evento";
  nlpPhrase: string;
  timeHour: string;
  timeDays: string[];
  timeDate: string;
  relativeMinutes: number;
  deviceId: string;
  deviceEvent: string;
  condOperator: string;
  condValue: string | number;
  actionIds: string[];
  ttsMessages: string[];
  ttsInput: string;
}

export interface Rutina {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  confirmed: boolean;
  trigger: {
    type: string;
    phrase?: string;
    hour?: string;
    days?: string[];
    date?: string;
    deviceId?: string;
    event?: string;
  };
  actions: Array<{ id: string; name: string }>;
}

export interface Suggestion {
  id: string;
  name: string;
  confidence: number;
  trigger: {
    type: string;
    phrase?: string;
    hour?: string;
    days?: string[];
  };
  actions: Array<{ id: string; name: string }>;
}

export const INITIAL_FORM: FormState = {
  name: "",
  description: "",
  enabled: true,
  triggerType: "NLP",
  nlpPhrase: "",
  timeHour: "08:00",
  timeDays: [],
  timeDate: "",
  relativeMinutes: 0,
  deviceId: "",
  deviceEvent: "",
  condOperator: "",
  condValue: "",
  actionIds: [],
  ttsMessages: [],
  ttsInput: "",
};

export const DEVICE_OPTIONS = [
  { id: "luz_sala", name: "Luz Sala", events: ["encendido", "apagado"] },
  { id: "termostato", name: "Termostato", events: ["temperatura_alta", "temperatura_baja"] },
  { id: "puerta", name: "Puerta Principal", events: ["abierta", "cerrada"] },
];

export const DAY_LABELS: Record<string, string> = {
  lun: "Lunes",
  mar: "Martes",
  mie: "Miércoles",
  jue: "Jueves",
  vie: "Viernes",
  sab: "Sábado",
  dom: "Domingo",
};

// Stub hook - no backend functionality
export function useRutinas() {
  const [rutinas] = useState<Rutina[]>([]);

  return {
    rutinas,
    suggestions: [] as Suggestion[],
    availableActions: [
      { id: "action_1", name: "Encender Luz Sala" },
      { id: "action_2", name: "Apagar Luz Sala" },
      { id: "action_3", name: "Ajustar Termostato" },
    ],
    isLoadingList: false,
    isLoadingSuggestions: false,
    INITIAL_FORM,
    createRutina: async (_formData: FormState) => ({ success: true, message: "Rutina creada (simulado)" }),
    updateRutina: async (_id: string, _formData: FormState) => ({ success: true, message: "Rutina actualizada (simulado)" }),
    deleteRutina: async (_id: string) => ({ success: true, message: "Rutina eliminada (simulado)" }),
    toggleEnabled: (_id: string) => { },
    confirmRutina: (_id: string) => { },
    rejectRutina: (_id: string) => { },
    runRutineNow: (_id: string) => { },
    generateSuggestions: () => { },
    acceptSuggestion: (_suggestion: Suggestion) => { },
    rejectSuggestion: (_id: string) => { },
    getRoutineById: (_id: string) => null as Rutina | null,
    describeTrigger: (trigger: any) => {
      if (trigger.type === "NLP") return `Comando de voz: "${trigger.phrase}"`;
      if (trigger.type === "Tiempo") return `Programado: ${trigger.hour}`;
      if (trigger.type === "Evento") return `Evento: ${trigger.event}`;
      return "Disparador desconocido";
    },
  };
}
