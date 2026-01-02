import { useState } from "react";

// Stub hook - no backend functionality
export function useRecuperarContra() {
  const [step, setStep] = useState(1);

  return {
    step,
    setStep,
    sendCode: () => { },
    verifyCode: () => { },
    resetPassword: () => { },
  };
}
