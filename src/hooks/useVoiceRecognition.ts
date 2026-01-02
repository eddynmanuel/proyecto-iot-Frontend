// Stub hook - no backend functionality
export function useVoiceRecognition() {
  return {
    isListening: false,
    transcript: "",
    startListening: () => { },
    stopListening: () => { },
  };
}
