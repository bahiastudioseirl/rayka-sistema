import { X, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type {
  CrearExamenRequest,
  PreguntaCrearRequest,
} from "../schemas/ExamenSchema";

export type CursoParaSelect = {
  id_curso: number;
  titulo: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: CrearExamenRequest) => Promise<void> | void;
  loading?: boolean;
  cursos: CursoParaSelect[];
};

const nuevaPreguntaInicial: PreguntaCrearRequest = {
  texto: "",
  respuestas: [
    { texto: "", es_correcta: true },
    { texto: "", es_correcta: false },
  ],
};

export default function ModalAgregarExamen({
  open,
  onClose,
  onSave,
  loading,
  cursos, 
}: Props) {
  const [titulo, setTitulo] = useState("");
  const [idCurso, setIdCurso] = useState<number | "">("");
  const [preguntas, setPreguntas] = useState<PreguntaCrearRequest[]>([]);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitulo("");
      setIdCurso("");
      setPreguntas([]);
      setError("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);


  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && open && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  // --- Handlers: Funciones para manipular el estado ---

  const handleAgregarPregunta = () => {
    // Añade una nueva pregunta (con 2 respuestas por defecto) al estado
    setPreguntas([...preguntas, { ...nuevaPreguntaInicial, respuestas: [
      { texto: "", es_correcta: true },
      { texto: "", es_correcta: false },
    ] }]);
  };

  const handleEliminarPregunta = (pregIndex: number) => {
    // Filtra la pregunta por su índice
    setPreguntas(preguntas.filter((_, idx) => idx !== pregIndex));
  };

  const handlePreguntaTextoChange = (pregIndex: number, texto: string) => {
    // Actualiza el texto de una pregunta específica de forma inmutable
    const nuevasPreguntas = preguntas.map((preg, idx) => {
      if (idx !== pregIndex) return preg;
      return { ...preg, texto: texto };
    });
    setPreguntas(nuevasPreguntas);
  };

  const handleAgregarRespuesta = (pregIndex: number) => {
    // Añade una nueva respuesta (vacía y no correcta) a una pregunta
    const nuevasPreguntas = preguntas.map((preg, idx) => {
      if (idx !== pregIndex) return preg;
      const nuevaRespuesta = { texto: "", es_correcta: false };
      return { ...preg, respuestas: [...preg.respuestas, nuevaRespuesta] };
    });
    setPreguntas(nuevasPreguntas);
  };

  const handleEliminarRespuesta = (pregIndex: number, respIndex: number) => {
    const nuevasPreguntas = preguntas.map((preg, pIdx) => {
      if (pIdx !== pregIndex) return preg;

      // Filtra la respuesta
      const nuevasRespuestas = preg.respuestas.filter(
        (_, rIdx) => rIdx !== respIndex
      );
      
      // Lógica de seguridad: si se elimina la respuesta correcta,
      // y aún quedan respuestas, se marca la primera como correcta.
      const eraCorrecta = preg.respuestas[respIndex].es_correcta;
      if (eraCorrecta && nuevasRespuestas.length > 0) {
        nuevasRespuestas[0].es_correcta = true;
      }

      return { ...preg, respuestas: nuevasRespuestas };
    });
    setPreguntas(nuevasPreguntas);
  };

  const handleRespuestaTextoChange = (
    pregIndex: number,
    respIndex: number,
    texto: string
  ) => {
    // Actualiza el texto de una respuesta específica
    const nuevasPreguntas = preguntas.map((preg, pIdx) => {
      if (pIdx !== pregIndex) return preg;
      const nuevasRespuestas = preg.respuestas.map((resp, rIdx) => {
        if (rIdx !== respIndex) return resp;
        return { ...resp, texto: texto };
      });
      return { ...preg, respuestas: nuevasRespuestas };
    });
    setPreguntas(nuevasPreguntas);
  };

  const handleRespuestaCorrectaChange = (
    pregIndex: number,
    respIndexCorrecta: number
  ) => {
    // Marca una respuesta como correcta y todas las demás como incorrectas
    // (para esa pregunta en específico)
    const nuevasPreguntas = preguntas.map((preg, pIdx) => {
      if (pIdx !== pregIndex) return preg;
      const nuevasRespuestas = preg.respuestas.map((resp, rIdx) => {
        return { ...resp, es_correcta: rIdx === respIndexCorrecta };
      });
      return { ...preg, respuestas: nuevasRespuestas };
    });
    setPreguntas(nuevasPreguntas);
  };

  // --- Guardar (Validación y Envío) ---

  const handleSave = async () => {
    setError(""); // Limpiar error previo
    
    // 1. Validaciones básicas
    const tituloTrim = titulo.trim();
    if (!tituloTrim) {
      setError("El título del examen es obligatorio.");
      return;
    }
    if (!idCurso) {
      setError("Debes seleccionar un curso.");
      return;
    }
    if (preguntas.length === 0) {
      setError("Debes añadir al menos una pregunta.");
      return;
    }

    // 2. Validaciones anidadas (preguntas y respuestas)
    for (const [i, preg] of preguntas.entries()) {
      if (preg.texto.trim() === "") {
        setError(`El texto de la pregunta #${i + 1} no puede estar vacío.`);
        return;
      }
      if (preg.respuestas.length < 2) {
        setError(
          `La pregunta #${i + 1} debe tener al menos dos respuestas.`
        );
        return;
      }
      
      // Validar que todas las respuestas tengan texto
      for (const [j, resp] of preg.respuestas.entries()) {
        if (resp.texto.trim() === "") {
          setError(
            `El texto de la respuesta #${j + 1} (Pregunta #${i + 1}) no puede estar vacío.`
          );
          return;
        }
      }

      // Validar que exactamente UNA respuesta sea la correcta
      const numCorrectas = preg.respuestas.filter((r) => r.es_correcta).length;
      if (numCorrectas !== 1) {
        setError(
          `La pregunta #${i + 1} debe tener exactamente una respuesta correcta.`
        );
        return;
      }
    }

    // 3. Si todo está OK, llamar a onSave
    await onSave({
      titulo: tituloTrim,
      id_curso: Number(idCurso), // Aseguramos que sea número
      preguntas: preguntas, // El estado ya tiene la forma correcta
    });
  };

  // --- Renderizado ---

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative z-71 w-full max-w-2xl mx-4 rounded-xl bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">
            Nuevo Examen
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENIDO DEL FORMULARIO */}
        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Título del Examen
            </label>
            <input
              ref={inputRef}
              type="text"
              value={titulo}
              onChange={(e) => {
                setTitulo(e.target.value);
                setError("");
              }}
              placeholder="Ej. Examen Final de Seguridad"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Curso */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Curso Asociado
            </label>
            <select
              value={idCurso}
              onChange={(e) => {
                setIdCurso(Number(e.target.value));
                setError("");
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="" disabled>
                -- Selecciona un curso --
              </option>
              {cursos.map((curso) => (
                <option key={curso.id_curso} value={curso.id_curso}>
                  {curso.titulo}
                </option>
              ))}
            </select>
          </div>

          <hr className="my-4" />

          {/* === SECCIÓN DE PREGUNTAS DINÁMICAS === */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-800">Preguntas</h4>
            {preguntas.map((pregunta, pregIndex) => (
              <div
                key={pregIndex}
                className="p-4 border border-slate-200 rounded-lg space-y-3"
              >
                {/* Encabezado de Pregunta (Texto y Botón Eliminar) */}
                <div className="flex items-center gap-2">
                  <label className="flex-1 block text-sm font-medium text-slate-700">
                    Pregunta #{pregIndex + 1}
                  </label>
                  <button
                    onClick={() => handleEliminarPregunta(pregIndex)}
                    className="p-1 rounded-md text-red-500 hover:bg-red-100"
                    aria-label="Eliminar pregunta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={pregunta.texto}
                  onChange={(e) =>
                    handlePreguntaTextoChange(pregIndex, e.target.value)
                  }
                  placeholder="Escribe el texto de la pregunta..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />

                {/* Sub-sección de Respuestas */}
                <div className="pl-4 space-y-2">
                  {pregunta.respuestas.map((respuesta, respIndex) => (
                    <div key={respIndex} className="flex items-center gap-2">
                      {/* Radio button para 'es_correcta' */}
                      <input
                        type="radio"
                        name={`pregunta-${pregIndex}-correcta`}
                        checked={respuesta.es_correcta}
                        onChange={() =>
                          handleRespuestaCorrectaChange(pregIndex, respIndex)
                        }
                        className="w-4 h-4 text-blue-600"
                      />
                      {/* Texto de la respuesta */}
                      <input
                        type="text"
                        value={respuesta.texto}
                        onChange={(e) =>
                          handleRespuestaTextoChange(
                            pregIndex,
                            respIndex,
                            e.target.value
                          )
                        }
                        placeholder={`Respuesta ${respIndex + 1}`}
                        className="flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                      />
                      {/* Botón Eliminar Respuesta (solo si hay > 2) */}
                      {pregunta.respuestas.length > 2 && (
                        <button
                          onClick={() =>
                            handleEliminarRespuesta(pregIndex, respIndex)
                          }
                          className="p-1 rounded-md text-red-400 hover:bg-red-50"
                          aria-label="Eliminar respuesta"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {/* Botón para Añadir Respuesta */}
                  <button
                    onClick={() => handleAgregarRespuesta(pregIndex)}
                    className="mt-2 flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md text-blue-600 hover:bg-blue-50 border border-blue-200"
                  >
                    <Plus className="w-3 h-3" />
                    Añadir Respuesta
                  </button>
                </div>
              </div>
            ))}

            {/* Botón para Añadir Pregunta */}
            <button
              onClick={handleAgregarPregunta}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Plus className="w-4 h-4" />
              Añadir Pregunta
            </button>
          </div>
          {/* === FIN SECCIÓN PREGUNTAS === */}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {/* FOOTER (Botones de Acción) */}
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
            {loading ? "Guardando..." : "Guardar Examen"}
          </button>
        </div>
      </div>
    </div>
  );
}