// Stub hook - no backend functionality
export function useMusica() {
  return {
    estado: {
      cancionActual: null,
      cola: [],
      historial: [],
      estaReproduciendo: false,
      estaPausado: false,
      volumen: 50,
      tiempoActual: 0,
      cargando: false,
      error: null,
    },
    cambiarVolumen: () => { },
    reproducir: () => { },
    pausar: () => { },
    siguienteCancion: () => { },
    cancionAnterior: () => { },
    agregarCancion: async () => { },
    eliminarCancion: () => { },
    seleccionarCancion: () => { },
    detenerCancion: async () => { },
    buscarPosicion: () => { },
  };
}
