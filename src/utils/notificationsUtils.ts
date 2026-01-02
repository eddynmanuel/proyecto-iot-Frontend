//Encapsula la lógica de abrir, cerrar y limpiar notificaciones.
export interface Notification {
  id: number;
  message: string;
  type?: string;
  title?: string;
  timestamp?: string;
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: 1,
    message: "Bienvenido al sistema IoT",
    type: "info",
    title: "Bienvenida",
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    message: "Sistema funcionando correctamente",
    type: "success",
    title: "Estado del Sistema",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const initialNotifications: Notification[] = mockNotifications;

export function removeNotification(list: Notification[], id: number) {
  return list.filter((n) => n.id !== id);
}

export function clearNotifications() {
  return [] as Notification[];
}

export async function fetchNotifications(
  apiBase?: string,
  token?: string,
  params?: { limit?: number; offset?: number; status?: string }
): Promise<Notification[]> {
  // Return mock notifications instead of fetching from backend
  return Promise.resolve(mockNotifications);
}

export async function deleteNotification(
  id: number,
  apiBase?: string,
  token?: string
): Promise<boolean> {
  // Mock delete - always succeeds
  return Promise.resolve(true);
}

export async function updateNotificationStatus(
  id: number,
  status: string,
  apiBase?: string,
  token?: string
): Promise<boolean> {
  // Mock update - always succeeds
  return Promise.resolve(true);
}
