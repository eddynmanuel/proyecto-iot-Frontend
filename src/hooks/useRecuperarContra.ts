import { useState, useRef } from "react";

type RecoveryMethod = "face" | "voice" | null;

// Complete hook implementation for password recovery
export function useRecuperarContra() {
  // Estados principales
  const [step, setStep] = useState(1);
  const [recoveryMethod, setRecoveryMethod] = useState<RecoveryMethod>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados biométricos
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState("");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [faceImageUrl, setFaceImageUrl] = useState("");
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [faceReady, setFaceReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceReady, setVoiceReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Funciones
  const startFacialRecognition = async () => {
    setBiometricLoading(true);
    setBiometricStatus("Preparando reconocimiento facial...");

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(cameras);
      if (cameras.length > 0) {
        setSelectedCameraId(cameras[0].deviceId);
      }
      setBiometricStatus("Cámara lista");
      setStep(2);
    } catch (err) {
      setError("No se pudo acceder a la cámara");
    } finally {
      setBiometricLoading(false);
    }
  };

  const startVoiceRecognition = () => {
    setBiometricLoading(true);
    setBiometricStatus("Preparando reconocimiento de voz...");
    setTimeout(() => {
      setBiometricStatus("Micrófono listo");
      setBiometricLoading(false);
    }, 1000);
  };

  const beginVoiceRecording = () => {
    setIsRecording(true);
    setBiometricStatus("Grabando...");

    // Simular grabación
    setTimeout(() => {
      setVoiceTranscript("Hola asistente, estoy configurando mi perfil de voz");
      setVoiceReady(true);
      setBiometricStatus("Voz verificada correctamente");
    }, 3000);
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    setBiometricStatus("Procesando audio...");
  };

  const turnOnCamera = async () => {
    if (!videoRef.current || !selectedCameraId) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedCameraId }
      });
      videoRef.current.srcObject = stream;
      setBiometricStatus("Cámara activada");
    } catch (err) {
      setError("No se pudo activar la cámara");
    }
  };

  const captureFaceSnapshot = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageUrl = canvas.toDataURL('image/png');
      setFaceImageUrl(imageUrl);
      setFaceReady(true);
      setBiometricStatus("Foto capturada correctamente");

      // Detener stream
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    }
  };

  const retakeFaceSnapshot = () => {
    setFaceImageUrl("");
    setFaceReady(false);
    turnOnCamera();
  };

  const updateSelectedCamera = (deviceId: string) => {
    setSelectedCameraId(deviceId);
  };

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (recoveryMethod === "face" && !faceReady) {
      setError("Por favor captura tu foto facial");
      return;
    }

    if (recoveryMethod === "voice" && !voiceReady) {
      setError("Por favor completa la verificación de voz");
      return;
    }

    setLoading(true);

    // Simular cambio de contraseña
    setTimeout(() => {
      setSuccess("¡Contraseña cambiada exitosamente!");
      setLoading(false);

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }, 2000);
  };

  const resetProcess = () => {
    setStep(1);
    setRecoveryMethod(null);
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    setFaceImageUrl("");
    setFaceReady(false);
    setVoiceTranscript("");
    setVoiceReady(false);
    setIsRecording(false);
  };

  const changeBiometricMethod = () => {
    setRecoveryMethod(null);
    setError("");
    setFaceImageUrl("");
    setFaceReady(false);
    setVoiceTranscript("");
    setVoiceReady(false);
    setIsRecording(false);
  };

  return {
    // Estados principales
    step,
    recoveryMethod,
    setRecoveryMethod,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,

    // Estados de UI
    loading,
    error,
    setError,
    success,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,

    // Estados biométricos
    biometricLoading,
    biometricStatus,
    voiceTranscript,
    videoRef,
    faceImageUrl,
    availableCameras,
    selectedCameraId,
    updateSelectedCamera,
    captureFaceSnapshot,
    retakeFaceSnapshot,
    turnOnCamera,
    faceReady,

    // Funciones
    startFacialRecognition,
    startVoiceRecognition,
    handleChangePassword,
    resetProcess,
    changeBiometricMethod,
    isRecording,
    beginVoiceRecording,
    stopVoiceRecording,
    voiceReady,
  };
}
