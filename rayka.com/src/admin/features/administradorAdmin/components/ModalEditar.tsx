// ModalEditarEstudiante.tsx
import { X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Administrador, ActualizarAdministradorRequest } from "../schemas/AdministradorSchema";


type Props = {
  open: boolean;
  administrador: Administrador | null;
  onClose: () => void;
  onSave: (id_usuario: number, data: ActualizarAdministradorRequest) => Promise<void>;
  loading?: boolean;
};

export default function ModalEditarAdministrador({ open, administrador, onClose, onSave, loading }: Props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [numDocumento, setNumDocumento] = useState("");
  const [correo, setCorreo] = useState<string | null>(null);
  const [activo, setActivo] = useState(true);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar datos al abrir
  useEffect(() => {
    if (open && administrador) {
      setNombre(administrador.nombre ?? "");
      setApellido(administrador.apellido ?? "");
      setNumDocumento(administrador.num_documento ?? "");
      setCorreo(administrador.correo ?? null);
      setError("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open, administrador]);

  // Cerrar con ESC
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && open && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  // Construir payload sólo con cambios (ideal para PATCH)
  const diffPayload: ActualizarAdministradorRequest | null = useMemo(() => {
    if (!administrador) return null;
    const payload: ActualizarAdministradorRequest = {};
    if (nombre.trim() && nombre.trim() !== administrador.nombre) payload.nombre = nombre.trim();
    if (apellido.trim() && apellido.trim() !== administrador.apellido) payload.apellido = apellido.trim();
    if (numDocumento.trim() && numDocumento.trim() !== administrador.num_documento) payload.num_documento = numDocumento.trim();
    if (correo && correo !== administrador.correo) payload.correo = correo;
    return Object.keys(payload).length ? payload : null;
  }, [administrador, nombre, apellido, numDocumento, correo, activo]);

  const handleSave = async () => {
    if (!administrador) return;

    // Validaciones mínimas
    if (!nombre.trim() || !apellido.trim() || !numDocumento.trim()) {
      setError("Completa nombre, apellido y documento.");
      return;
    }
    // Si tu DNI debe ser numérico:
    if (!/^\d+$/.test(numDocumento.trim())) {
      setError("El número de documento debe contener solo dígitos.");
      return;
    }
    // Correo (opcional) validación básica
    if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError("Ingresa un correo válido.");
      return;
    }
    if (!diffPayload) {
      setError("No hay cambios para guardar.");
      return;
    }

    await onSave(administrador.id_usuario, diffPayload);
  };

  if (!open || !administrador) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]" onClick={onClose} />
      {/* Modal */}
      <div className="relative z-[61] w-full max-w-lg mx-4 rounded-xl bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">Editar Estudiante</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input
              ref={inputRef}
              type="text"
              value={nombre}
              onChange={(e) => { setNombre(e.target.value); setError(""); }}
              placeholder="Ej. Irwin"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* Apellido */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => { setApellido(e.target.value); setError(""); }}
              placeholder="Ej. Valera"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* Documento */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">N° Documento</label>
            <input
              type="text"
              inputMode="numeric"
              value={numDocumento}
              onChange={(e) => { setNumDocumento(e.target.value); setError(""); }}
              placeholder="Ej. 12345678"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
            {/* Correo */}
              <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo</label>
            <input
              type="email"
              value={correo || ""}
              onChange={(e) => {
                setCorreo(e.target.value);
                setError("");
              }}
              placeholder="Ej. 12345678"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
            className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Actualizando..." : "Actualizar Estudiante"}
          </button>
        </div>
      </div>
    </div>
  );
}
