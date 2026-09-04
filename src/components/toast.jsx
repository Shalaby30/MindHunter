"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-24 right-4 z-[200] flex flex-col gap-2 sm:bottom-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-sm animate-in slide-in-from-right-5 fade-in duration-300",
              toast.type === "success" && "border-green-500/30 bg-green-500/10 text-green-400",
              toast.type === "error" && "border-red-500/30 bg-red-500/10 text-red-400",
              toast.type === "info" && "border-blue-500/30 bg-blue-500/10 text-blue-400",
            )}
          >
            {toast.type === "success" && <CheckCircle className="h-4 w-4 flex-shrink-0" />}
            {toast.type === "error" && <AlertCircle className="h-4 w-4 flex-shrink-0" />}
            {toast.type === "info" && <Info className="h-4 w-4 flex-shrink-0" />}
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 flex-shrink-0 opacity-60 hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
