import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CrearAdministradorRequest } from "../schemas/AdministradorSchema";

type SavePayload = Pick<CrearAdministradorRequest, "nombre" | "apellido" | "num_documento" | "correo" | "contrasenia">;

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: SavePayload) => Promise<void> | void;
  loading?: boolean;
};

export default function ModalAgregarAdministrador({ open, onClose, onSave, loading }: Props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [numDocumento, setNumDocumento] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setNombre("");
      setApellido("");
      setNumDocumento("");
      setCorreo("");
      setContrasenia("");
      setError("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && open && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  const handleSave = async () => {
    const n = nombre.trim();
    const a = apellido.trim();
    const d = numDocumento.trim();
    const c = correo.trim();
    const con = contrasenia.trim();

    if (!n || !a || !d || !c || !con) {
      setError("Completa nombre, apellido, documento, correo y contraseña.");
      return;
    }

    // validación básica numérica; elimina si aceptas alfanumérico
    if (!/^\d+$/.test(d)) {
      setError("El número de documento debe contener solo dígitos.");
      return;
    }

    await onSave({ nombre: n, apellido: a, num_documento: d, correo: c, contrasenia: con });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]" onClick={onClose} />
      {/* Modal */}
      <div className="relative z-[61] w-full max-w-lg mx-4 rounded-xl bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">Nuevo Estudiante</h3>
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
              onChange={(e) => {
                setNombre(e.target.value);
                setError("");
              }}
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
              onChange={(e) => {
                setApellido(e.target.value);
                setError("");
              }}
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
              maxLength={8}
              value={numDocumento}
              onChange={(e) => {
                setNumDocumento(e.target.value);
                setError("");
              }}
              placeholder="Ej. 12345678"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* Correo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                setError("");
              }}
              placeholder="ejemplo@gmail.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={contrasenia}
              onChange={(e) => {
                setContrasenia(e.target.value);
                setError("");
              }}
              placeholder="********"
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
            className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-[#132436] hover:bg-[#224666] disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar Estudiante"}
          </button>
        </div>
      </div>
    </div>
  );
}
