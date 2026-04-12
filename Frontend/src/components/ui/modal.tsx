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
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn(maxWidth, "rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl", className)}>
        {(title || subtitle) && (
          <DialogHeader className="p-8 pb-0 space-y-1">
            {title && (
              <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                {title}
              </DialogTitle>
            )}
            {subtitle && (
              <DialogDescription className="text-slate-500 font-medium text-base">
                {subtitle}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className="p-8 pt-6">
          {children}
        </div>
        {footer && (
          <div className="p-8 pt-0 flex items-center justify-end gap-3 border-t border-slate-50 bg-slate-50/50 mt-2">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
