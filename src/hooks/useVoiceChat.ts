import { useRef, useState } from "react";

// Stub hook - no backend functionality
export function useVoiceChat(_options?: any) {
  const [messages] = useState<Array<{ sender: string; text: string }>>([]);
  const [text, setText] = useState("");
  const [listening] = useState(false);
  const [isTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  return {
    messages,
    text,
    setText,
    listening,
    isTyping,
    toggleVoiceActive: () => { },
    sendMessage: () => { },
    messagesEndRef,
  };
}
