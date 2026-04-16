"use client";

import { useEffect, useState } from "react";
import { Check, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

let showToastFn: ((msg: string, type?: ToastType) => void) | null = null;

export function toast(message: string, type: ToastType = "success") {
  showToastFn?.(message, type);
}

export function ToastProvider() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("success");

  useEffect(() => {
    showToastFn = (msg: string, t: ToastType = "success") => {
      setMessage(msg);
      setType(t);
      setVisible(true);
    };
    return () => { showToastFn = null; };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  const icons = {
    success: <Check className="h-4 w-4" />,
    error: <AlertCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
  };

  const colors = {
    success: "soha-toast-success",
    error: "soha-toast-error",
    info: "soha-toast-info",
  };

  return (
    <div className={`soha-toast ${colors[type]}`}>
      {icons[type]}
      <span>{message}</span>
      <button type="button" onClick={() => setVisible(false)} className="ml-2 opacity-70 hover:opacity-100">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
