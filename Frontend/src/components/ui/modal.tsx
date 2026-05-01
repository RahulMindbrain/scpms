import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  maxWidth?: string;
  preventOutsideClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  className,
  maxWidth = "sm:max-w-lg",
  preventOutsideClick,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onInteractOutside={(e) => {
          if (preventOutsideClick) {
            e.preventDefault();
          }
        }}
        className={cn(
          maxWidth,
          "rounded-[1.5rem] p-0 overflow-hidden shadow-2xl",
          "bg-[#1e1f26] border border-[rgba(255,255,255,0.08)]",
          className
        )}
      >
        {(title || subtitle) && (
          <DialogHeader className="p-7 pb-4 space-y-1 border-b border-[rgba(255,255,255,0.06)]">
            {title && (
              <DialogTitle className="text-xl font-bold text-[#e2e2eb] tracking-tight">
                {title}
              </DialogTitle>
            )}
            {subtitle && (
              <DialogDescription className="text-[#908fa0] font-medium text-sm">
                {subtitle}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className="p-7 pt-5">
          {children}
        </div>
        {footer && (
          <div className="p-7 pt-0 flex items-center justify-end gap-3 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] mt-2">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
