"use client";

import { useState } from "react";
import { useAuth } from "./useAuth";
import type { FamilyMember } from "../components/UI/Perfil";

export function useConfiguracion() {
  const { user } = useAuth();
  const [ownerName, setOwnerName] = useState("Usuario Principal");
  const [notifications, setNotifications] = useState(true);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [ownerUsernames] = useState<string[]>([]);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [changeVoiceModalOpen, setChangeVoiceModalOpen] = useState(false);
  const [changeFaceModalOpen, setChangeFaceModalOpen] = useState(false);
  const [_isListening, setIsListening] = useState(false);
  const [_transcript, setTranscript] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const [modalOwnerName, setModalOwnerName] = useState(ownerName);
  const [modalPassword, setModalPassword] = useState("");
  const [modalCurrentPassword, setModalCurrentPassword] = useState("");

  const [currentStep, setCurrentStep] = useState(1);
  const [newMember, setNewMember] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
  });
  const [errorMessage, _setErrorMessage] = useState("");
  const [_voiceConfirmed, _setVoiceConfirmed] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [_isRegisteringMember, _setIsRegisteringMember] = useState(false);

  const [voicePassword, setVoicePassword] = useState("");
  const [voicePasswordVerified, setVoicePasswordVerified] = useState(false);
  const [facePassword, setFacePassword] = useState("");
  const [facePasswordVerified, setFacePasswordVerified] = useState(false);

  const isCurrentUserOwner = Boolean(user?.user?.is_owner);

  const handleEditProfile = () => {
    setModalOwnerName(ownerName);
    setModalPassword("");
    setModalCurrentPassword("");
    setIsProfileModalOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!modalOwnerName.trim()) {
      alert("El nombre no puede quedar vacío.");
      return;
    }
    setOwnerName(modalOwnerName.trim());
    setIsProfileModalOpen(false);
  };

  const handleChangeVoice = () => {
    if (!voicePasswordVerified) {
      alert("Primero verifica tu contraseña actual para agregar tu voz.");
      return;
    }
    setStatusMessage("Funcionalidad de voz no disponible sin backend");
    // Simulando uso
    setIsListening(true);
    setTranscript("");
  };

  const handleFaceDetection = () => {
    setFaceDetected(true);
    setStatusMessage("✅ Rostro detectado correctamente.");
  };

  const handleUploadVoiceToUser = async () => {
    setStatusMessage("Funcionalidad de voz no disponible sin backend");
  };

  const handleVerifyVoicePassword = async () => {
    setVoicePasswordVerified(true);
    setStatusMessage("✅ Contraseña verificada. Puedes agregar tu voz.");
  };

  const handleVerifyFacePassword = async (): Promise<boolean> => {
    setFacePasswordVerified(true);
    setStatusMessage("✅ Contraseña verificada. Puedes agregar tu rostro.");
    return true;
  };

  const handleFinalizeMember = () => {
    if (!isCurrentUserOwner) {
      alert("Solo el propietario puede agregar nuevos usuarios.");
      return;
    }

    // Simular registro local
    const newFamilyMember: FamilyMember = {
      id: String(Date.now()),
      name: newMember.username,
      role: newMember.isAdmin ? "Administrador" : "Familiar",
      privileges: { controlDevices: false, viewCamera: true },
    };

    setMembers([...members, newFamilyMember]);
    setIsAddMemberModalOpen(false);
    setNewMember({
      username: "",
      password: "",
      confirmPassword: "",
      isAdmin: false,
    });
  };

  return {
    ownerName,
    setOwnerName,
    ownerUsernames,
    notifications,
    setNotifications,
    members,
    setMembers,
    isProfileModalOpen,
    setIsProfileModalOpen,
    changeVoiceModalOpen,
    setChangeVoiceModalOpen,
    changeFaceModalOpen,
    setChangeFaceModalOpen,
    modalOwnerName,
    setModalOwnerName,
    modalPassword,
    setModalPassword,
    modalCurrentPassword,
    setModalCurrentPassword,
    isAddMemberModalOpen,
    setIsAddMemberModalOpen,
    isListening: _isListening,
    transcript: _transcript,
    statusMessage,
    handleEditProfile,
    handleSaveProfile,
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
    currentStep,
    setCurrentStep,
    newMember,
    setNewMember,
    errorMessage,
    isRegisteringMember: _isRegisteringMember,
    voiceConfirmed: _voiceConfirmed,
    faceDetected,
    handleFinalizeMember,
    isCurrentUserOwner,
  };
}
