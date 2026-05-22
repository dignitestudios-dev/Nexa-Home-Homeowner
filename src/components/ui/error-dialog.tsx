"use client";

import { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface ErrorDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function ErrorDialog({
  open,
  onClose,
  title = "Error",
  description = "",
}: ErrorDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="w-[515px] max-w-[calc(100%-2rem)] rounded-[24px] bg-white p-0 border-0">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#181818] hover:bg-black/5"
          aria-label="Close modal"
        >
          <X size={22} />
        </button>

        <div className="flex flex-col items-center px-[43px] py-[46px]">
          
          {/* Error Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#EF4444_0%,#DC2626_100%)]">
              <AlertCircle
                className="text-white"
                size={36}
                strokeWidth={3}
              />
            </div>
          </div>

          {/* <DialogTitle className="mt-8 text-center text-[32px] font-semibold leading-[40px] tracking-[-0.008em] text-[#1C1C1C]">
            {title}
          </DialogTitle> */}

          {description && (
            <DialogDescription className="mt-4 text-center text-[18px] leading-[23px] text-black/80">
              {description}
            </DialogDescription>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Global Trigger & Provider for Error Dialog
type ErrorData = { title: string; description: string } | null;
let errorCallback: ((error: ErrorData) => void) | null = null;

export function showError(description: string, title: string = "Error") {
  if (errorCallback) {
    errorCallback({ title, description });
  } else if (typeof window !== "undefined") {
    const event = new CustomEvent("global-error-dialog", {
      detail: { title, description },
    });
    window.dispatchEvent(event);
  }
}

export function GlobalErrorProvider() {
  const [error, setError] = useState<ErrorData>(null);

  useEffect(() => {
    errorCallback = setError;

    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setError(customEvent.detail);
      }
    };
    window.addEventListener("global-error-dialog", handleEvent);

    return () => {
      errorCallback = null;
      window.removeEventListener("global-error-dialog", handleEvent);
    };
  }, []);

  useEffect(() => {
    if (error !== null) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <ErrorDialog
      open={error !== null}
      onClose={() => setError(null)}
      title={error?.title || "Error"}
      description={error?.description || ""}
    />
  );
}