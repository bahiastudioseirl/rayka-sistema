import { useState, useEffect } from "react";
import { ArrowLeft, Play, CheckCircle2, ChevronRight, Lock, BookOpen, Clock, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import confetti from 'canvas-confetti';
import type { CursoDetalleResponse, Pregunta, Respuesta } from "../schemas/EstudianteSchema";
import { API_CONFIG } from "../../../config/api.config";
import { marcarVideoFinalizado } from "../services/marcarVideoFinalizado";
import { rendirExamen, type RespuestaExamen } from "../services/rendirExamen";

interface Props {
  cursoData: CursoDetalleResponse['data'];
}

type ActiveView = "module" | "exam" | "exam-quiz";

export default function CursoSeccionDinamico({ cursoData }: Props) {
  const navigate = useNavigate();
  const [moduleCompleted, setModuleCompleted] = useState(false);
  const [active, setActive] = useState<ActiveView>("module");
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);
  const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);
  
  // Estado del examen
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [examCompleted, setExamCompleted] = useState(false);
  const [examScore, setExamScore] = useState<number | null>(null);
  const [examResult, setExamResult] = useState<any>(null);
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);
  
  // Timer del examen
  const [examTime, setExamTime] = useState(0);
  const [isExamTimerRunning, setIsExamTimerRunning] = useState(false);
  
  // Obtener datos de capacitación del localStorage
  const capacitacionData = localStorage.getItem('capacitacion_data');
  const capacitacion = capacitacionData ? JSON.parse(capacitacionData) : null;
  const maxIntentos = capacitacion?.max_intentos || 3;
  const duracionExamen = capacitacion?.duracion_examen_min || 30;

  const progressPct = moduleCompleted ? 100 : 0;
  const hasExam = cursoData.examen && cursoData.examen.preguntas.length > 0;

  useEffect(() => {
    if (moduleCompleted && !hasShownModal && hasExam) {
      // Lanzar confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => {
        setShowCompletionModal(true);
        setHasShownModal(true);
      }, 400);
    }
  }, [moduleCompleted, hasShownModal, hasExam]);

  // Timer del examen
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExamTimerRunning && !examCompleted) {
      interval = setInterval(() => {
        setExamTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExamTimerRunning, examCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMarkAsCompleted = async () => {
    if (moduleCompleted) return;
    
    setIsMarkingCompleted(true);
    try {
      await marcarVideoFinalizado(cursoData.id_curso);
      setModuleCompleted(true);
      if (hasExam) {
        setActive("exam");
      }
    } catch (error) {
      console.error('Error al marcar como completado:', error);
      alert(error instanceof Error ? error.message : 'Error al marcar el video como completado');
    } finally {
      setIsMarkingCompleted(false);
    }
  };

  const handleTakeExam = () => {
    setShowCompletionModal(false);
    setActive("exam-quiz");
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setExamCompleted(false);
    setExamTime(0);
    setIsExamTimerRunning(true);
  };

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < cursoData.examen.preguntas.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitExam = async () => {
    const totalQuestions = cursoData.examen.preguntas.length;
    const answeredQuestions = Object.keys(selectedAnswers).length;
    
    if (answeredQuestions < totalQuestions) {
      if (!window.confirm(`Has respondido ${answeredQuestions} de ${totalQuestions} preguntas. ¿Deseas enviar el examen de todas formas?`)) {
        return;
      }
    }

    setIsSubmittingExam(true);
    setIsExamTimerRunning(false);
    
    try {
      // Convertir selectedAnswers al formato requerido por la API
      const respuestas: RespuestaExamen[] = Object.entries(selectedAnswers).map(([preguntaId, respuestaId]) => ({
        id_pregunta: Number(preguntaId),
        id_respuesta: respuestaId
      }));

      const result = await rendirExamen(cursoData.id_curso, respuestas);
      
      if (result.success) {
        setExamScore(result.data.nota);
        setExamResult(result.data);
        setExamCompleted(true);
        
        // Confetti si aprobó
        if (result.data.aprobado) {
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (error) {
      console.error('Error al rendir examen:', error);
      alert(error instanceof Error ? error.message : 'Error al enviar el examen');
      setIsExamTimerRunning(true);
    } finally {
      setIsSubmittingExam(false);
    }
  };

  const handleBackToCourse = () => {
    setActive("module");
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setExamCompleted(false);
    setExamScore(null);
  };

  const renderVideoContent = () => {
    if (!cursoData.contenido) {
      return (
        <div className="aspect-video rounded-xl bg-slate-100 grid place-content-center text-slate-500">
          <div className="text-center">
            <Play className="h-16 w-16 mx-auto mb-2 text-slate-400" />
            <p>Contenido no disponible</p>
          </div>
        </div>
      );
    }

    if (cursoData.tipo_contenido === 'link') {
      // Convertir link de YouTube a embed
      let embedUrl = cursoData.contenido;
      
      // Si es un link de YouTube normal, convertirlo a embed
      if (embedUrl.includes('youtube.com/watch?v=')) {
        const videoId = embedUrl.split('v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (embedUrl.includes('youtu.be/')) {
        const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }

      return (
        <div className="aspect-video rounded-xl overflow-hidden bg-slate-900">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            title={cursoData.titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    if (cursoData.tipo_contenido === 'archivo') {
      return (
        <div className="aspect-video rounded-xl overflow-hidden bg-slate-900">
          <video
            src={API_CONFIG.getFullUrl(cursoData.contenido)}
            className="w-full h-full"
            controls
            controlsList="nodownload"
          >
            Tu navegador no soporta el elemento de video.
          </video>
        </div>
      );
    }

    return null;
  };

  const currentQuestion = hasExam && active === "exam-quiz" && !examCompleted
    ? cursoData.examen.preguntas[currentQuestionIndex]
    : null;

  return (
    <>
      <main className="min-h-[calc(100vh-4rem)] bg-[#e4e4e4]/30 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 shadow-sm transition-colors border-slate-200/60"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-4">
              {/* Info del curso */}
              <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
                {cursoData.url_imagen && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                      src={API_CONFIG.getFullUrl(cursoData.url_imagen)}
                      alt={cursoData.titulo}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
                <h2 className="font-semibold text-slate-900 text-lg">{cursoData.titulo}</h2>
                {cursoData.descripcion && (
                  <p className="text-sm text-slate-600 mt-1">{cursoData.descripcion}</p>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  Por: {cursoData.creado_por.nombre} {cursoData.creado_por.apellido}
                </p>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">Progreso del curso</span>
                    <span className="font-semibold text-[#132436]">{progressPct}%</span>
                  </div>
                  <div className="mt-2 h-2.5 w-full rounded-full bg-blue-100">
                    <div
                      className="h-2.5 rounded-full bg-[#132436] transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    {moduleCompleted ? "Módulo completado" : "En progreso"}
                  </p>
                </div>
              </div>

              {/* Lista de contenido */}
              <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-4">Contenido</h3>

                <ul className="space-y-2">
                  {/* Módulo del curso */}
                  <li>
                    <button
                      onClick={() => setActive("module")}
                      className={`w-full flex items-start gap-3 rounded-xl p-3 text-left transition-all
                        ${active === "module"
                          ? "bg-[#224666]/10 border border-[#224666]/50 shadow-sm"
                          : "bg-slate-50 border border-slate-200/50 hover:bg-slate-100 hover:border-slate-300/50"
                        }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {moduleCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-[#224666]" />
                        ) : (
                          <Play className="h-5 w-5 text-slate-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-slate-500">Contenido</span>
                        <h4 className={`font-medium mt-0.5 ${active === "module" ? "text-[#132436]" : "text-[#374151]"}`}>
                          {cursoData.titulo}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1">{cursoData.tipo_contenido}</p>
                      </div>
                    </button>
                  </li>

                  {/* Examen */}
                  {hasExam && (
                    <li>
                      <button
                        onClick={() => moduleCompleted && setActive("exam")}
                        disabled={!moduleCompleted}
                        className={`w-full flex items-start gap-3 rounded-xl p-3 text-left transition-all
                          ${active === "exam"
                            ? "bg-[#224666]/10 border border-[#224666]/50 shadow-sm"
                            : "bg-slate-50 border border-slate-200/50 hover:bg-slate-100 hover:border-slate-300/50"
                          } ${!moduleCompleted ? "opacity-70 cursor-not-allowed" : ""}`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {moduleCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-[#224666]" />
                          ) : (
                            <Lock className="h-5 w-5 text-slate-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium text-slate-500">Evaluación</span>
                          <h4 className={`font-medium mt-0.5 ${active === "exam" ? "text-[#132436]" : "text-[#374151]"}`}>
                            {cursoData.examen.titulo}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1">
                            {cursoData.examen.total_preguntas} pregunta{cursoData.examen.total_preguntas !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </aside>

            {/* Panel principal */}
            <section className="lg:col-span-8">
              {active === "exam" && hasExam ? (
                <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
                  <div className="text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#132436] mb-2">
                      ¡Listo para el examen!
                    </h2>
                    <p className="text-slate-600 mb-6">
                      Has completado el curso. Ahora puedes rendir el examen final.
                    </p>
                    
                    <div className="bg-slate-50 rounded-xl p-6 mb-6">
                      <h3 className="font-semibold text-slate-900 mb-4">Detalles del examen</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-left">
                          <p className="text-slate-600">Total de preguntas</p>
                          <p className="font-semibold text-[#132436]">{cursoData.examen.total_preguntas}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-slate-600">Duración máxima</p>
                          <p className="font-semibold text-[#132436] flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {duracionExamen} minutos
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="text-slate-600">Intentos máximos</p>
                          <p className="font-semibold text-[#132436]">{maxIntentos}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-slate-600">Título</p>
                          <p className="font-semibold text-[#132436]">{cursoData.examen.titulo}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleTakeExam}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#132436] px-8 py-3 text-sm font-medium text-white hover:bg-[#224666] transition-all shadow-sm"
                    >
                      Comenzar examen
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : active === "exam-quiz" && hasExam ? (
                <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
                  {examCompleted ? (
                    <div className="p-8 text-center">
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                        examResult?.aprobado ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <CheckCircle2 className={`w-10 h-10 ${
                          examResult?.aprobado ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <h2 className="text-2xl font-bold text-[#132436] mb-2">
                        {examResult?.aprobado ? '¡Felicitaciones!' : 'Examen completado'}
                      </h2>
                      <p className="text-slate-600 mb-4">
                        {examResult?.aprobado 
                          ? 'Has aprobado el examen' 
                          : 'No alcanzaste el puntaje mínimo para aprobar'}
                      </p>
                      <div className="bg-slate-50 rounded-xl p-6 mb-6 max-w-md mx-auto">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-slate-600 mb-1">Tu puntuación</p>
                            <p className="text-4xl font-bold text-[#132436]">{examScore}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600 mb-1">Tiempo empleado</p>
                            <p className="text-2xl font-bold text-slate-700">{formatTime(examTime)}</p>
                          </div>
                        </div>
                        <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Respuestas correctas</span>
                            <span className="font-semibold text-green-600">
                              {examResult?.respuestas_correctas} / {examResult?.total_preguntas}
                            </span>
                          </div>
                          {examResult?.intentos_restantes !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-slate-600">Intentos restantes</span>
                              <span className={`font-semibold ${examResult.intentos_restantes > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                {examResult.intentos_restantes}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={handleBackToCourse}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#132436] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#224666] transition-all shadow-sm"
                      >
                        Volver al curso
                      </button>
                    </div>
                  ) : currentQuestion ? (
                    <>
                      <div className="p-6 border-b border-slate-200/60 bg-slate-50">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm text-slate-600">
                              Pregunta {currentQuestionIndex + 1} de {cursoData.examen.total_preguntas}
                            </p>
                            <h2 className="text-xl font-semibold text-[#132436] mt-1">
                              {cursoData.examen.titulo}
                            </h2>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-xs text-slate-600">Tiempo</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span className="text-lg font-bold text-blue-600">{formatTime(examTime)}</span>
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-slate-600">Respondidas</p>
                              <p className="text-lg font-bold text-slate-700 mt-1">
                                {Object.keys(selectedAnswers).length} / {cursoData.examen.total_preguntas}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200">
                          <div
                            className="h-2 rounded-full bg-[#132436] transition-all"
                            style={{ width: `${((currentQuestionIndex + 1) / cursoData.examen.total_preguntas) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-8">
                        <h3 className="text-lg font-medium text-slate-900 mb-6">
                          {currentQuestion.texto}
                        </h3>

                        <div className="space-y-3">
                          {currentQuestion.respuestas.map((respuesta: Respuesta) => (
                            <button
                              key={respuesta.id_respuesta}
                              onClick={() => handleAnswerSelect(currentQuestion.id_pregunta, respuesta.id_respuesta)}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                selectedAnswers[currentQuestion.id_pregunta] === respuesta.id_respuesta
                                  ? 'border-[#132436] bg-[#132436]/5'
                                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  selectedAnswers[currentQuestion.id_pregunta] === respuesta.id_respuesta
                                    ? 'border-[#132436] bg-[#132436]'
                                    : 'border-slate-300'
                                }`}>
                                  {selectedAnswers[currentQuestion.id_pregunta] === respuesta.id_respuesta && (
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                  )}
                                </div>
                                <span className="text-slate-900">{respuesta.texto}</span>
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="mt-8 flex items-center justify-between gap-4">
                          <button
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Anterior
                          </button>

                          {currentQuestionIndex < cursoData.examen.total_preguntas - 1 ? (
                            <button
                              onClick={handleNextQuestion}
                              disabled={isSubmittingExam}
                              className="px-6 py-2 text-sm font-medium text-white bg-[#132436] rounded-lg hover:bg-[#224666] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Siguiente
                            </button>
                          ) : (
                            <button
                              onClick={handleSubmitExam}
                              disabled={isSubmittingExam}
                              className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
                            >
                              {isSubmittingExam ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Enviando...
                                </>
                              ) : (
                                'Finalizar examen'
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-200/60">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-sm font-medium text-[#132436]">Contenido del curso</span>
                        <h2 className="text-2xl font-semibold text-[#132436] mt-1">{cursoData.titulo}</h2>
                      </div>
                      {moduleCompleted && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-[#008000] text-white rounded-full text-sm font-medium">
                          <CheckCircle2 className="h-4 w-4" />
                          Completado
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    {renderVideoContent()}

                    <div className="mt-6 flex items-center justify-between gap-4">
                      <div className="text-sm text-slate-600">
                        {moduleCompleted ? "Módulo completado" : "En progreso"}
                      </div>

                      <div className="flex items-center gap-3">
                        {!moduleCompleted ? (
                          <button
                            onClick={handleMarkAsCompleted}
                            disabled={isMarkingCompleted}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#132436] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#224666] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                          >
                            {isMarkingCompleted ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Marcando...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4" />
                                Marcar como completado
                              </>
                            )}
                          </button>
                        ) : hasExam ? (
                          <button
                            onClick={() => setActive("exam")}
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-all shadow-sm"
                          >
                            Ir al examen
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Modal de completado */}
      {showCompletionModal && hasExam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-[#132436] mb-2">
              ¡Felicitaciones!
            </h3>
            <p className="text-slate-600 mb-6">
              Has completado el curso. Ahora puedes rendir el examen final.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompletionModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Ver más tarde
              </button>
              <button
                onClick={handleTakeExam}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#132436] rounded-lg hover:bg-[#224666] transition-colors"
              >
                Ir al examen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
