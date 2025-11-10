import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CrearCapacitacionRequest, Usuario, Curso } from "../schemas/CapacitacionSchema";
import type { Solicitante } from "../../solicitanteAdmin/schemas/SolicitanteSchema";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: CrearCapacitacionRequest) => Promise<void> | void;
  loading?: boolean;
  solicitantes: Solicitante[];
  usuarios: Usuario[];
  cursos: Curso[];
};

export default function ModalAgregar({ open, onClose, onSave, loading, solicitantes, usuarios, cursos }: Props) {
  const [duracionExamen, setDuracionExamen] = useState("");
  const [maxIntentos, setMaxIntentos] = useState("");
  const [idSolicitante, setIdSolicitante] = useState("");
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState<number[]>([]);
  const [cursosSeleccionados, setCursosSeleccionados] = useState<number[]>([]);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setDuracionExamen("");
      setMaxIntentos("");
      setIdSolicitante("");
      setUsuariosSeleccionados([]);
      setCursosSeleccionados([]);
      setError("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && open && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  const toggleUsuario = (id: number) => {
    setUsuariosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const toggleCurso = (id: number) => {
    setCursosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    const duracion = parseInt(duracionExamen.trim());
    if (!duracionExamen.trim() || isNaN(duracion) || duracion <= 0) {
      setError("Ingresa una duración válida mayor a 0.");
      return;
    }

    const intentos = parseInt(maxIntentos);
    if (!maxIntentos || isNaN(intentos) || intentos < 1 || intentos > 5) {
      setError("Selecciona el número máximo de intentos.");
      return;
    }

    if (!idSolicitante) {
      setError("Selecciona un solicitante.");
      return;
    }

    if (usuariosSeleccionados.length === 0) {
      setError("Selecciona al menos un estudiante.");
      return;
    }

    if (cursosSeleccionados.length === 0) {
      setError("Selecciona al menos un curso.");
      return;
    }

    const data: CrearCapacitacionRequest = {
      duracion_examen_min: duracion,
      max_intentos: intentos,
      id_solicitante: parseInt(idSolicitante),
      usuarios_estudiantes: usuariosSeleccionados,
      cursos: cursosSeleccionados,
    };

    await onSave(data);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative z-[61] w-full max-w-2xl mx-4 rounded-xl bg-white shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h3 className="text-base font-semibold text-slate-900">Nueva Capacitación</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Duración del Examen */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Duración del examen (minutos)
            </label>
            <input
              ref={inputRef}
              type="number"
              min="1"
              value={duracionExamen}
              onChange={(e) => {
                setDuracionExamen(e.target.value);
                setError("");
              }}
              placeholder="Ej. 60"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Máximo de Intentos */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Máximo de intentos
            </label>
            <select
              value={maxIntentos}
              onChange={(e) => {
                setMaxIntentos(e.target.value);
                setError("");
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona un número</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          {/* Solicitante */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Solicitante
            </label>
            <select
              value={idSolicitante}
              onChange={(e) => {
                setIdSolicitante(e.target.value);
                setError("");
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona un solicitante</option>
              {solicitantes.map((sol) => (
                <option key={sol.id_solicitante} value={sol.id_solicitante}>
                  {sol.nombre} {sol.apellido} - {sol.empresa?.nombre || "Sin empresa"}
                </option>
              ))}
            </select>
          </div>

          {/* Estudiantes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Estudiantes ({usuariosSeleccionados.length} seleccionados)
            </label>
            <div className="border border-slate-300 rounded-lg max-h-48 overflow-y-auto">
              {usuarios.length === 0 ? (
                <div className="px-3 py-4 text-sm text-slate-500 text-center">
                  No hay usuarios disponibles
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {usuarios.map((usuario) => (
                    <label
                      key={usuario.id_usuario}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={usuariosSeleccionados.includes(usuario.id_usuario)}
                        onChange={() => toggleUsuario(usuario.id_usuario)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">
                        {usuario.nombre} {usuario.apellido} - {usuario.correo}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cursos */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Cursos ({cursosSeleccionados.length} seleccionados)
            </label>
            <div className="border border-slate-300 rounded-lg max-h-48 overflow-y-auto">
              {cursos.length === 0 ? (
                <div className="px-3 py-4 text-sm text-slate-500 text-center">
                  No hay cursos disponibles
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {cursos.map((curso) => (
                    <label
                      key={curso.id_curso}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={cursosSeleccionados.includes(curso.id_curso)}
                        onChange={() => toggleCurso(curso.id_curso)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">
                        {curso.titulo}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-200 sticky bottom-0 bg-white">
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
            {loading ? "Guardando..." : "Guardar Capacitación"}
          </button>
        </div>
      </div>
    </div>
  );
}
