import { X, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CrearExamenRequest,PreguntaCrearRequest,ExamenEnLista,Pregunta,ActualizarExamenRequest,AgregarPreguntaRequest,RespuestaCrearRequest} from "../schemas/examenSchema";
import ConfirmModal from "./ConfirmModal";
import { eliminarPregunta } from '../services/eliminarPregunta';
import { agregarPregunta } from '../services/agregarPregunta';
import { actualizarExamen} from '../services/actualizarExamen';
import { agregarRespuestas } from '../services/agregarRespuesta';
import { eliminarRespuesta } from '../services/eliminarRespuesta'; 

export type CursoParaSelect = {
  id_curso: number;
  titulo: string;
};

type RespuestaEnEstado = RespuestaCrearRequest & {
  id_respuesta?: number;
};

type PreguntaEnEstado = {
  id_pregunta?: number;
  texto: string;
  respuestas: RespuestaEnEstado[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; 
  cursos: CursoParaSelect[];
  examenParaEditar: ExamenEnLista | null;
};

const nuevaPreguntaInicial: PreguntaEnEstado = {
  texto: "",
  respuestas: [
    { texto: "", es_correcta: true },
    { texto: "", es_correcta: false },
  ],
};

export default function ModalEditarExamen({
  open,
  onClose,
  onSuccess, 
  cursos,
  examenParaEditar,
}: Props) {
  const [isSaving, setIsSaving] = useState(false);
  
  const [titulo, setTitulo] = useState("");
  const [idCurso, setIdCurso] = useState<number | "">("");
  const [preguntas, setPreguntas] = useState<PreguntaEnEstado[]>([]);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [preguntaToDelete, setPreguntaToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (open && examenParaEditar) {
      setTitulo(examenParaEditar.titulo);
      setIdCurso(examenParaEditar.curso.id_curso);

      const preguntasFormateadas: PreguntaEnEstado[] = examenParaEditar.preguntas.map(
        (preg: Pregunta) => ({
          id_pregunta: preg.id_pregunta, 
          texto: preg.texto,
          respuestas: preg.respuestas.map((resp) => ({
            id_respuesta: resp.id_respuesta,
            texto: resp.texto,
            es_correcta: resp.es_correcta,
          })),
        })
      );
      setPreguntas(preguntasFormateadas);

      setError("");
      setIsSaving(false); 
      setTimeout(() => inputRef.current?.focus(), 0);
    }
    
    if (!open) {
      setTitulo("");
      setIdCurso("");
      setPreguntas([]);
      setError("");
      setIsSaving(false);
    }
  }, [open, examenParaEditar]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && open && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  const handleAgregarPregunta = () => {
    setPreguntas([...preguntas, { ...nuevaPreguntaInicial, respuestas: [
      { texto: "", es_correcta: true },
      { texto: "", es_correcta: false },
    ] }]);
  };

  const handleEliminarPregunta = (pregIndex: number) => {
    const preguntaAEliminar = preguntas[pregIndex];
    if (preguntaAEliminar.id_pregunta && examenParaEditar?.id_examen) {
      setPreguntaToDelete(pregIndex);
      setShowConfirmDelete(true);
    } else {
      setPreguntas(preguntas.filter((_, idx) => idx !== pregIndex));
    }
  };
  
  const confirmarEliminarPregunta = async () => {
    if (preguntaToDelete === null) return;
    
    setError("");
    const preguntaAEliminar = preguntas[preguntaToDelete];
    
    try {
      if (preguntaAEliminar.id_pregunta && examenParaEditar?.id_examen) {
        await eliminarPregunta(examenParaEditar.id_examen, preguntaAEliminar.id_pregunta);
      }
      setPreguntas(preguntas.filter((_, idx) => idx !== preguntaToDelete));
    } catch (err) {
      let errorMessage = "Error al eliminar la pregunta";
      if (err instanceof Error) errorMessage = err.message;
      setError(errorMessage);
    } finally {
      setPreguntaToDelete(null);
    }
  };

  const handlePreguntaTextoChange = (pregIndex: number, texto: string) => {
    const nuevasPreguntas = preguntas.map((preg, idx) => {
      if (idx !== pregIndex) return preg;
      return { ...preg, texto: texto };
    });
    setPreguntas(nuevasPreguntas);
  };
  const handleAgregarRespuesta = (pregIndex: number) => {
    const nuevasPreguntas = preguntas.map((preg, idx) => {
      if (idx !== pregIndex) return preg;
      const nuevaRespuesta = { texto: "", es_correcta: false };
      return { ...preg, respuestas: [...preg.respuestas, nuevaRespuesta] };
    });
    setPreguntas(nuevasPreguntas);
  };
  const handleEliminarRespuesta = async (pregIndex: number, respIndex: number) => {
    const pregunta = preguntas[pregIndex];
    const respuesta = pregunta.respuestas[respIndex];
    
    // Si la respuesta tiene ID y la pregunta también, eliminar del backend
    if (respuesta.id_respuesta && pregunta.id_pregunta && examenParaEditar?.id_examen) {
      try {
        await eliminarRespuesta(examenParaEditar.id_examen, pregunta.id_pregunta);
      } catch (err) {
        let errorMessage = "Error al eliminar la respuesta";
        if (err instanceof Error) errorMessage = err.message;
        setError(errorMessage);
        return;
      }
    }
    
    // Actualizar el estado local
    const nuevasPreguntas = preguntas.map((preg, pIdx) => {
      if (pIdx !== pregIndex) return preg;
      const nuevasRespuestas = preg.respuestas.filter(
        (_, rIdx) => rIdx !== respIndex
      );
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
    const nuevasPreguntas = preguntas.map((preg, pIdx) => {
      if (pIdx !== pregIndex) return preg;
      const nuevasRespuestas = preg.respuestas.map((resp, rIdx) => {
        return { ...resp, es_correcta: rIdx === respIndexCorrecta };
      });
      return { ...preg, respuestas: nuevasRespuestas };
    });
    setPreguntas(nuevasPreguntas);
  };

  // --- LÓGICA DE handleSave TOTALMENTE NUEVA ---
  // 4. Esta función ahora orquesta TODAS las llamadas a la API
  const handleSave = async () => {
    setError("");
    setIsSaving(true); // 1. Activar loading

    if (!examenParaEditar) {
      setError("No se pudo encontrar el examen a editar.");
      setIsSaving(false);
      return;
    }

    // 2. Validaciones (las mismas de antes)
    const tituloTrim = titulo.trim();
    if (!tituloTrim) { setError("El título es obligatorio."); setIsSaving(false); return; }
    if (!idCurso) { setError("Debes seleccionar un curso."); setIsSaving(false); return; }
    // ... (aquí van tus validaciones de preguntas, respuestas, etc.) ...
    // ...
    // ...
    
    try {
      // --- INICIO DE LLAMADAS GRANULARES ---

      // 3. Llamada 1: Actualizar Título y Curso
      const dataHeader: ActualizarExamenRequest = {
        titulo: tituloTrim,
        id_curso: Number(idCurso),
      };
      await actualizarExamen(examenParaEditar.id_examen, dataHeader);

      // 4. Llamada 2: Agregar Preguntas Nuevas
      const preguntasNuevas = preguntas.filter(p => !p.id_pregunta);
      if (preguntasNuevas.length > 0) {
        for (const preguntaNueva of preguntasNuevas) {
          const dataPregunta: AgregarPreguntaRequest = {
            texto: preguntaNueva.texto,
            respuestas: preguntaNueva.respuestas.map(r => ({
              texto: r.texto,
              es_correcta: r.es_correcta,
            })),
          };
          await agregarPregunta(examenParaEditar.id_examen, dataPregunta);
        }
      }

      // 5. Llamada 3: Agregar Respuestas Nuevas a Preguntas Existentes
      const preguntasExistentes = preguntas.filter(p => p.id_pregunta);
      for (const pregunta of preguntasExistentes) {
        // Filtrar respuestas nuevas (sin id_respuesta)
        const respuestasNuevas = pregunta.respuestas.filter(r => !r.id_respuesta);
        
        if (respuestasNuevas.length > 0 && pregunta.id_pregunta) {
          const dataRespuestas = {
            respuestas: respuestasNuevas.map(r => ({
              texto: r.texto,
              es_correcta: r.es_correcta,
            })),
          };
          await agregarRespuestas(
            examenParaEditar.id_examen,
            pregunta.id_pregunta,
            dataRespuestas
          );
        }
      }

      // --- FIN DE LLAMADAS ---

      // 6. Si todo salió bien
      setIsSaving(false);
      onSuccess(); // Le decimos a la página que refresque
      onClose(); // Cerramos el modal

    } catch (err) {
      let errorMessage = "Ocurrió un error al guardar";
      if (err instanceof Error) errorMessage = err.message;
      setError(errorMessage);
      setIsSaving(false); // 7. Detener loading en caso de error
    }
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
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">
            Editar Examen
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
              <option value="" disabled> -- Selecciona un curso -- </option>
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
                key={pregunta.id_pregunta || `new-${pregIndex}`} // 8. Key mejorado
                className="p-4 border border-slate-200 rounded-lg space-y-3"
              >
                {/* Encabezado de Pregunta (Texto y Botón Eliminar) */}
                <div className="flex items-center gap-2">
                  <label className="flex-1 block text-sm font-medium text-slate-700">
                    Pregunta #{pregIndex + 1}
                  </label>
                  <button
                    onClick={() => handleEliminarPregunta(pregIndex)} // Conectado
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
                <div className="pl-4 space-y-2 pt-2">
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
            disabled={isSaving} // 9. Usa el loading interno
            className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-[#132436] hover:bg-[#224666] disabled:opacity-60"
          >
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
      
      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        open={showConfirmDelete}
        onClose={() => {
          setShowConfirmDelete(false);
          setPreguntaToDelete(null);
        }}
        onConfirm={confirmarEliminarPregunta}
        title="Confirmar eliminación"
        message="¿Seguro que deseas eliminar esta pregunta de la base de datos? Esta acción es permanente."
        type="danger"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}