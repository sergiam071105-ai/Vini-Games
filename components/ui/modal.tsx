"use client";

import {
  HTMLAttributes,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
  MouseEvent,
} from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  className = "",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") {
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    full: "max-w-[90vw] md:max-w-5xl",
  };

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className={`
          relative w-full rounded-2xl bg-[#1A1C2B] border border-[#2E334A]
          text-[#F5F7FF] shadow-2xl shadow-black/80
          overflow-hidden flex flex-col max-h-[90vh]
          animate-in zoom-in-95 duration-200
          ${sizeClasses[size]}
          ${className}
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-6 pb-4 border-b border-[#2E334A]/60">
            <div className="flex flex-col space-y-1 pr-6">
              {title && (
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-[#949CB2]">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar modal"
                className="rounded-lg p-1.5 text-[#949CB2] hover:text-white hover:bg-[#2E334A]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#783DF2]"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-sm text-zinc-300">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-[#2E334A]/60 bg-[#131521]/60">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Subcomponentes para composición avanzada
export function ModalHeader({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex flex-col space-y-1.5 p-6 pb-4 border-b border-[#2E334A]/60 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function ModalTitle({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-xl font-bold text-white tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function ModalDescription({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-[#949CB2] ${className}`} {...props}>
      {children}
    </p>
  );
}

export function ModalBody({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 overflow-y-auto flex-1 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function ModalFooter({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex items-center justify-end gap-3 p-6 pt-4 border-t border-[#2E334A]/60 bg-[#131521]/60 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export { Modal };
