"use client";

import { Settings, Bell, Mic, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import SimpleCard from "../components/UI/Card";
import Perfil from "../components/UI/Perfil";
import Modal from "../components/UI/Modal";
import PageHeader from "../components/UI/PageHeader";
import LocationSelector from "../components/UI/LocationSelector";
import { useConfiguracion } from "../hooks/useConfiguration";
import { useLocation } from "../hooks/useLocation";
import { useThemeByTime } from "../hooks/useThemeByTime";
import { useCameraCapture } from "../hooks/useCameraCapture";
import { MAX_FACE_PHOTOS } from "../utils/cameraConstants";

export default function Configuracion() {
  const { colors, theme, setTheme } = useThemeByTime();
  const {
    ownerName,
    setOwnerName,
    notifications,
    setNotifications,
    members,
    setMembers,
    isAddMemberModalOpen,
    setIsAddMemberModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    modalOwnerName,
    setModalOwnerName,
    modalPassword,
    setModalPassword,
    modalCurrentPassword,
    setModalCurrentPassword,
    isListening,
    transcript,
    statusMessage,
    handleEditProfile,
    handleSaveProfile,
    currentStep,
    setCurrentStep,
    newMember,
    setNewMember,
    errorMessage,
    voiceConfirmed,
    faceDetected,
    isRegisteringMember,
    handleFinalizeMember,
    changeVoiceModalOpen,
    setChangeVoiceModalOpen,
    changeFaceModalOpen,
    setChangeFaceModalOpen,
    handleChangeVoice,
    handleFaceDetection,
    handleUploadVoiceToUser,
    voicePassword,
    setVoicePassword,
    voicePasswordVerified,
    handleVerifyVoicePassword,
    facePassword,
    setFacePassword,
    facePasswordVerified,
    handleVerifyFacePassword,
    isCurrentUserOwner,
    ownerUsernames,
  } = useConfiguracion();

  const { handleLocationChange } = useLocation();

  const [capturedPhotos, setCapturedPhotos] = useState<Blob[]>([]);
  const [isUploadingFace, setIsUploadingFace] = useState(false);

  // Estado para rutinas automáticas
  const [routines, setRoutines] = useState({
    buenosDias: true,
    modoNoche: true,
    salirDeCasa: false,
  });

  const toggleRoutine = (routineName: keyof typeof routines) => {
    setRoutines((prev) => ({
      ...prev,
      [routineName]: !prev[routineName],
    }));
  };

  // Use camera capture hook for face recognition
  const { videoRef, capturePhoto } = useCameraCapture({
    enabled: changeFaceModalOpen && facePasswordVerified,
    onPhotoCapture: (blob) => {
      setCapturedPhotos((prev) => {
        const next = [...prev, blob];
        if (next.length === 1) handleFaceDetection();
        return next;
      });
    },
  });

  // Cleanup photos when modal closes
  useEffect(() => {
    if (!changeFaceModalOpen) {
      setCapturedPhotos([]);
    }
  }, [changeFaceModalOpen]);

  const handleTakePhoto = async () => {
    if (capturedPhotos.length >= MAX_FACE_PHOTOS) return;
    await capturePhoto();
  };

  const handleUploadClientFaces = async () => {
    try {
      setIsUploadingFace(true);
      if (capturedPhotos.length === 0) {
        alert("Toma al menos una foto de tu rostro.");
        return;
      }
      // Mock upload - just simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setChangeFaceModalOpen(false);
      setCapturedPhotos([]);
      setIsUploadingFace(false);
    } catch (e: any) {
      alert("Error al registrar rostro");
    } finally {
      setIsUploadingFace(false);
    }
  };

  return (
    <div
      className={`p-2 md:p-4 pt-8 md:pt-3 space-y-6 md:space-y-8 font-inter w-full ${colors.background} ${colors.text}`}
    >
      <PageHeader
        title="CONFIGURACIÓN"
        icon={<Settings className="w-8 md:w-10 h-8 md:h-10 text-white" />}
      />

      <div className="space-y-6">
        {/* Tema del sistema */}
        <SimpleCard
          className={`p-4 flex items-center justify-between ${colors.cardBg}`}
        >
          <div>
            <div
              className={`${colors.text} flex items-center gap-2 font-medium text-sm`}
            >
              {theme === "light" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}{" "}
              Tema
            </div>
            <div className={`text-xs ${colors.mutedText}`}>
              Elige claro u oscuro
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme("light")}
              className={`p-2 rounded-lg transition-all ${theme === "light"
                ? `bg-gradient-to-r ${colors.primary} text-white`
                : `${colors.cardBg} ${colors.text} border ${colors.border}`
                }`}
              aria-label="Tema claro"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`p-2 rounded-lg transition-all ${theme === "dark"
                ? `bg-gradient-to-r ${colors.primary} text-white`
                : `${colors.cardBg} ${colors.text} border ${colors.border}`
                }`}
              aria-label="Tema oscuro"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>
        </SimpleCard>

        {/* Perfil del propietario */}
        <SimpleCard
          className={`p-6 ring-1 ring-slate-700/30 shadow-lg flex flex-col gap-4 ${colors.cardBg}`}
        >
          <Perfil
            name={ownerName}
            setName={setOwnerName}
            role={isCurrentUserOwner ? "Propietario" : "Familiar"}
            members={members}
            setMembers={setMembers}
            isOwnerFixed={false}
            onEditProfile={handleEditProfile}
            onAddMember={
              isCurrentUserOwner
                ? () => setIsAddMemberModalOpen(true)
                : undefined
            }
            owners={ownerUsernames}
          />
        </SimpleCard>

        {/* Preferencias */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Columna izquierda: Notificaciones y Ubicación */}
          <div className="space-y-4">
            {/* Notificaciones */}
            <SimpleCard
              className={`p-4 flex items-center justify-between ${colors.cardBg}`}
            >
              <div>
                <div
                  className={`${colors.text} flex items-center gap-2 font-medium text-sm`}
                >
                  <Bell className="w-4 h-4" /> Notificaciones
                </div>
                <div className={`text-xs ${colors.mutedText}`}>
                  Activar o desactivar alertas
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications ? 'bg-blue-600' : 'bg-slate-600'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </SimpleCard>

            {/* Ubicación */}
            <LocationSelector onLocationChange={handleLocationChange} />
          </div>

          {/* Columna derecha: Rutinas Automáticas */}
          <SimpleCard className="p-4">
            <div>
              <div
                className={`${colors.text} flex items-center gap-2 font-medium text-sm mb-2`}
              >
                <Settings className="w-4 h-4" /> Rutinas Automáticas
              </div>
              <div className={`text-xs ${colors.mutedText} mb-3`}>
                Configura rutinas para automatizar tu hogar
              </div>

              <div className="space-y-2">
                {/* Rutina 1: Buenos días */}
                <div
                  className={`p-2.5 rounded-lg border ${colors.border} ${colors.cardBg}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <div className={`text-sm font-medium ${colors.text}`}>
                        Buenos días
                      </div>
                      <div className={`text-xs ${colors.mutedText}`}>
                        Lun-Vie 7:00 AM
                      </div>
                    </div>
                    <button
                      onClick={() => toggleRoutine('buenosDias')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${routines.buenosDias ? 'bg-blue-600' : 'bg-slate-600'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${routines.buenosDias ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                  <div className={`text-xs ${colors.mutedText}`}>
                    Enciende luces, ajusta temperatura
                  </div>
                </div>

                {/* Rutina 2: Modo noche */}
                <div
                  className={`p-2.5 rounded-lg border ${colors.border} ${colors.cardBg}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <div className={`text-sm font-medium ${colors.text}`}>
                        Modo noche
                      </div>
                      <div className={`text-xs ${colors.mutedText}`}>
                        Diario 10:00 PM
                      </div>
                    </div>
                    <button
                      onClick={() => toggleRoutine('modoNoche')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${routines.modoNoche ? 'bg-blue-600' : 'bg-slate-600'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${routines.modoNoche ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                  <div className={`text-xs ${colors.mutedText}`}>
                    Apaga luces, activa seguridad
                  </div>
                </div>

                {/* Rutina 3: Salir de casa */}
                <div
                  className={`p-2.5 rounded-lg border ${colors.border} ${colors.cardBg}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <div className={`text-sm font-medium ${colors.text}`}>
                        Salir de casa
                      </div>
                      <div className={`text-xs ${colors.mutedText}`}>
                        Manual
                      </div>
                    </div>
                    <button
                      onClick={() => toggleRoutine('salirDeCasa')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${routines.salirDeCasa ? 'bg-blue-600' : 'bg-slate-600'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${routines.salirDeCasa ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                  <div className={`text-xs ${colors.mutedText}`}>
                    Apaga todo, activa alarma
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('navigate', { detail: { menu: 'Rutinas' } }));
                }}
                className={`w-full mt-3 px-4 py-2 rounded-lg text-sm border ${colors.border} ${colors.text} hover:bg-slate-700/30 transition-colors`}
              >
                Ver todas las rutinas
              </button>
            </div>
          </SimpleCard>
        </div>

        {/* Modal editar perfil */}
        <Modal
          title="Editar perfil"
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          backdropClassName="bg-black/60"
          className="!bg-[#0f1420]"
        >
          <div className="space-y-4">
            <div>
              <label className={`block text-sm ${colors.mutedText} mb-1`}>
                Nombre
              </label>
              <input
                type="text"
                value={modalOwnerName}
                onChange={(e) => setModalOwnerName(e.target.value)}
                className={`w-full rounded-lg px-3 py-2 text-sm ${colors.inputBg} border ${colors.border} ${colors.text}`}
              />
            </div>

            <div>
              <label className={`block text-sm ${colors.mutedText} mb-1`}>
                Contraseña actual
              </label>
              <input
                type="password"
                value={modalCurrentPassword}
                onChange={(e) => setModalCurrentPassword(e.target.value)}
                className={`w-full rounded-lg px-3 py-2 text-sm ${colors.inputBg} border ${colors.border} ${colors.text}`}
                placeholder="Confirma tu contraseña"
              />
            </div>

            <div>
              <label className={`block text-sm ${colors.mutedText} mb-1`}>
                Nueva contraseña
              </label>
              <input
                type="password"
                value={modalPassword}
                onChange={(e) => setModalPassword(e.target.value)}
                className={`w-full rounded-lg px-3 py-2 text-sm ${colors.inputBg} border ${colors.border} ${colors.text}`}
                placeholder="Ingresa nueva contraseña (opcional)"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setChangeVoiceModalOpen(true)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm transition-all ${colors.buttonActive}`}
              >
                Agregar voz
              </button>
              <button
                onClick={() => setChangeFaceModalOpen(true)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm transition-all ${colors.buttonActive}`}
              >
                Agregar rostro
              </button>
            </div>

            <div className="flex flex-col-reverse md:flex-row justify-end gap-2 md:gap-3 mt-4">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm ${colors.buttonInactive}`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProfile}
                className={`px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white`}
              >
                Guardar
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal agregar voz */}
        <Modal
          title="Agregar reconocimiento de voz"
          isOpen={changeVoiceModalOpen}
          onClose={() => setChangeVoiceModalOpen(false)}
          backdropClassName="bg-black/60"
          className="!bg-[#0f1420]"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-full">
              <label className={`block text-sm ${colors.mutedText} mb-1`}>
                Contraseña actual
              </label>
              <input
                type="password"
                value={voicePassword}
                onChange={(e) => setVoicePassword(e.target.value)}
                className={`w-full rounded-lg px-3 py-2 text-sm ${colors.inputBg} border ${colors.border} ${colors.text}`}
                placeholder="Confirma tu contraseña"
              />
              <button
                onClick={handleVerifyVoicePassword}
                className={`mt-2 px-4 py-2 rounded-lg text-sm ${colors.buttonActive}`}
              >
                Verificar contraseña
              </button>
              {voicePasswordVerified && (
                <p className="text-green-400 text-xs mt-1">
                  Contraseña verificada
                </p>
              )}
            </div>
            <p className={`text-sm ${colors.mutedText} text-center`}>
              Di la siguiente frase para registrar tu voz:
            </p>
            <p className="text-blue-400 font-semibold text-center text-lg">
              "Hola asistente, estoy configurando mi perfil de voz para el
              sistema de casa inteligente"
            </p>

            <button
              onClick={handleChangeVoice}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white transition-all w-full md:w-auto ${isListening
                ? "bg-red-600 animate-pulse cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
                }`}
              disabled={isListening || !voicePasswordVerified}
            >
              <Mic className="w-4 h-4" />
              {isListening ? "Escuchando..." : "Iniciar escucha"}
            </button>

            {statusMessage && (
              <p className={`text-sm ${colors.text} text-center`}>
                {statusMessage}
              </p>
            )}
            {transcript && (
              <p className={`text-sm ${colors.mutedText} text-center italic`}>
                🗣️ Detectado: "{transcript}"
              </p>
            )}

            <div className="flex flex-col-reverse md:flex-row justify-end gap-2 md:gap-3 w-full">
              <button
                onClick={() => setChangeVoiceModalOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm ${colors.buttonInactive}`}
              >
                Cancelar
              </button>
              {voiceConfirmed && (
                <button
                  onClick={() => {
                    handleUploadVoiceToUser();
                  }}
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-sm text-white"
                >
                  Guardar voz
                </button>
              )}
            </div>
          </div>
        </Modal>

        {/* Modal agregar rostro */}
        <Modal
          title="Agregar reconocimiento facial"
          isOpen={changeFaceModalOpen}
          onClose={() => setChangeFaceModalOpen(false)}
          backdropClassName="bg-black/60"
          className="!bg-[#0f1420]"
        >
          <div className="space-y-4 text-center">
            <div className="text-left">
              <label className={`block text-sm ${colors.mutedText} mb-1`}>
                Contraseña actual
              </label>
              <input
                type="password"
                value={facePassword}
                onChange={(e) => setFacePassword(e.target.value)}
                className={`w-full rounded-lg px-3 py-2 text-sm ${colors.inputBg} border ${colors.border} ${colors.text}`}
                placeholder="Confirma tu contraseña"
              />
              <button
                onClick={handleVerifyFacePassword}
                className={`mt-2 px-4 py-2 rounded-lg text-sm ${colors.buttonActive}`}
              >
                Verificar contraseña
              </button>
              {facePasswordVerified && (
                <p className="text-green-400 text-xs mt-1">
                  Contraseña verificada
                </p>
              )}
            </div>
            <p className={`text-sm ${colors.mutedText}`}>
              Usa la cámara para registrar el reconocimiento de tu rostro.
            </p>

            <div
              className={`rounded-xl w-full h-48 flex items-center justify-center border ${colors.border} ${colors.panelBg}`}
            >
              <video
                ref={videoRef}
                className="w-full h-48 object-cover rounded-xl"
                muted
                playsInline
                autoPlay
              />
            </div>

            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={handleTakePhoto}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm text-white disabled:opacity-50"
                disabled={
                  !facePasswordVerified ||
                  capturedPhotos.length >= MAX_FACE_PHOTOS ||
                  isUploadingFace
                }
              >
                Tomar foto
              </button>
              <span className={`text-xs ${colors.mutedText}`}>
                Fotos: {capturedPhotos.length}/{MAX_FACE_PHOTOS}
              </span>
            </div>

            {faceDetected && (
              <p className="text-green-400 text-sm font-medium">
                Rostro detectado correctamente
              </p>
            )}

            <div className="flex flex-col-reverse md:flex-row justify-end gap-2 md:gap-3">
              <button
                onClick={() => setChangeFaceModalOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm ${colors.buttonInactive}`}
              >
                Cancelar
              </button>
              {capturedPhotos.length === MAX_FACE_PHOTOS && (
                <button
                  onClick={handleUploadClientFaces}
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-sm text-white disabled:opacity-50"
                  disabled={isUploadingFace}
                >
                  {isUploadingFace ? "Cargando rostro..." : "Guardar rostro"}
                </button>
              )}
            </div>
          </div>
        </Modal>

        {/* Modal agregar familiar */}
        <Modal
          title="Agregar nuevo familiar"
          isOpen={isAddMemberModalOpen}
          onClose={() => {
            setIsAddMemberModalOpen(false);
            setCurrentStep(1);
          }}
          backdropClassName="bg-black/60"
          className="!bg-[#0f1420]"
        >
          <div className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm ${colors.mutedText} mb-1`}>
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    value={newMember.username}
                    onChange={(e) =>
                      setNewMember({ ...newMember, username: e.target.value })
                    }
                    className={`w-full rounded-lg px-3 py-2 text-sm ${colors.inputBg} border ${colors.border} ${colors.text}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm ${colors.mutedText} mb-1`}>
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={newMember.password}
                    onChange={(e) =>
                      setNewMember({ ...newMember, password: e.target.value })
                    }
                    className={`w-full rounded-lg px-3 py-2 text-sm ${colors.inputBg} border ${colors.border} ${colors.text}`}
                  />
                </div>

                <div
                  className={`flex items-center justify-between p-3 rounded-lg border ${colors.border} ${colors.cardBg}`}
                >
                  <label className={`text-sm ${colors.text}`}>
                    ¿Es administrador?
                  </label>
                  <button
                    onClick={() =>
                      setNewMember({
                        ...newMember,
                        isAdmin: !newMember.isAdmin,
                      })
                    }
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${newMember.isAdmin ? "bg-blue-600" : "bg-slate-600"
                      }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${newMember.isAdmin ? "translate-x-7" : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>

                {errorMessage && (
                  <p className="text-red-400 text-sm">{errorMessage}</p>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleFinalizeMember}
                    disabled={isRegisteringMember}
                    className={`px-4 py-2 rounded-lg text-sm w-full md:w-auto transition-all ${isRegisteringMember
                      ? `${colors.buttonInactive} cursor-not-allowed`
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                  >
                    {isRegisteringMember
                      ? "Registrando..."
                      : "Registrar usuario"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
}
