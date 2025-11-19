import { AlertCircle,  X } from "lucide-react";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: "danger" | "warning" | "info";
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  type = "warning",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}: ConfirmModalProps) {
  if (!open) return null;

  const colors = {
    danger: {
      bg: "bg-red-50",
      icon: "text-red-600",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
      button: "bg-amber-600 hover:bg-amber-700",
    },
    info: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/50 "
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-[101] w-full max-w-md mx-4 rounded-xl bg-white shadow-xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          <div className="flex gap-4">
            <div className={`p-3 rounded-full ${colors[type].bg} flex-shrink-0`}>
              <AlertCircle className={`w-6 h-6 ${colors[type].icon}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-700">{message}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg text-white ${colors[type].button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
