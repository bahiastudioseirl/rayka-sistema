import { X, Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type SavePayload = {
  contrasenia_actual: string;
  contrasenia_nueva: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: SavePayload) => Promise<void> | void;
  loading?: boolean;
};

export default function ModalCambiarContrasenia({ open, onClose, onSave, loading }: Props) {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [error, setError] = useState("");
  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // reset + focus
  useEffect(() => {
    if (open) {
      setActual("");
      setNueva("");
      setError("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // ESC para cerrar
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && open && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  const handleSave = async () => {
    const a = actual.trim();
    const n = nueva.trim();

    if (!a || !n) {
      setError("Completa la contraseña actual y la nueva.");
      return;
    }

    // validación mínima sugerida (opcional)
    if (n.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    await onSave({ contrasenia_actual: a, contrasenia_nueva: n });
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]" onClick={onClose} />
      {/* Modal */}
      <div className="relative z-71 w-full max-w-lg mx-4 rounded-xl bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">Cambiar contraseña</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Contraseña actual */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña actual</label>
            <div className="relative">
              <input
                ref={inputRef}
                type={showActual ? "text" : "password"}
                value={actual}
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setActual(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowActual(!showActual)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showActual ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showActual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Nueva contraseña */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nueva contraseña</label>
            <div className="relative">
              <input
                type={showNueva ? "text" : "password"}
                value={nueva}
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setNueva(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowNueva(!showNueva)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showNueva ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showNueva ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Recomendado: 8+ caracteres, mayúsculas, minúsculas, números y símbolo.
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-[#132436] hover:bg-[#224666] disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </div>
      </div>
    </div>
  );
}
