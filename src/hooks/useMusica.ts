export interface Cancion {
  id: string;
  titulo: string;
  artista: string;
  thumbnail?: string;
  urlYoutube?: string;
  agregadoPor?: string;
  createdAt?: string;
  duracion: number;
}

export interface EstadoMusica {
  cancionActual: Cancion | null;
  cola: Cancion[];
  historial: Cancion[];
  estaReproduciendo: boolean;
  estaPausado: boolean;
  volumen: number;
  tiempoActual: number;
  cargando: boolean;
  error: string | null;
}

// Stub hook - no backend functionality
export function useMusica() {
  const estado: EstadoMusica = {
    cancionActual: {
      id: "1",
      titulo: "Canción Demo",
      artista: "Artista Demo",
      duracion: 180,
      agregadoPor: "Sistema",
      createdAt: new Date().toISOString(),
      thumbnail: "https://placehold.co/400"
    },
    cola: [],
    historial: [],
    estaReproduciendo: false,
    estaPausado: false,
    volumen: 50,
    tiempoActual: 0,
    cargando: false,
    error: null,
  };

  return {
    estado,
    cambiarVolumen: (_vol: number) => { },
    reproducir: () => { },
    pausar: () => { },
    siguienteCancion: () => { },
    cancionAnterior: () => { },
    agregarCancion: async (_url: string, _user: string) => { },
    eliminarCancion: (_id: string) => { },
    seleccionarCancion: (_id: string) => { },
    detenerCancion: async () => { },
    buscarPosicion: (_pos: number) => { },
  };
}
