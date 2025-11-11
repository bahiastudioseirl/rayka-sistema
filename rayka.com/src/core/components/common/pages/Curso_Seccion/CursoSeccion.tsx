import { useState, useEffect } from "react";
import { ArrowLeft, Play, CheckCircle2, ChevronRight, Lock, History } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { CourseCompletionModal, ExamReadyPanel, ExamQuiz, ExamHistory } from "./components";

type Module = {
  id: string | number;
  title: string;
  completed?: boolean;
  videoUrl?: string;
  duration?: string;
};

type CourseDetail = {
  id: string;
  title: string;
  description?: string;
  modules: Module[]; // ahora solo 1 módulo
};

interface ExamAttempt {
  id: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  date: Date;
  answers: number[];
}

type ActiveView =
  | { kind: "module"; id: string | number }
  | { kind: "exam" }
  | { kind: "exam-quiz" }
  | { kind: "exam-history" };

const COURSE: CourseDetail = {
  id: "seguridad-y-salud-ocupacional",
  title: "Seguridad y Salud Ocupacional",
  description: "Aprende los conceptos básicos de seguridad y salud en el trabajo.",
  modules: [
    {
      id: 1,
      title: "Fundamentos del curso",
      completed: false,
      duration: "22:45",
      videoUrl: "https://www.youtube.com/embed/Z34BF9PCfYg",
    },
  ],
};

export default function CursoSeccion() {
  const navigate = useNavigate();
  const { cursoId } = useParams<{ cursoId: string }>();

  // Estado del único módulo
  const [moduleCompleted, setModuleCompleted] = useState<boolean>(!!COURSE.modules[0].completed);

  // Vista activa: por defecto el módulo
  const [active, setActive] = useState<ActiveView>({ kind: "module", id: COURSE.modules[0].id });

  // Modal de "curso completo"
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  // Estado de exámenes
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);
  const MAX_EXAM_ATTEMPTS = 3;

  const progressPct = moduleCompleted ? 100 : 0;

  // Cuando se complete el módulo por primera vez → mostrar modal
  useEffect(() => {
    if (moduleCompleted && !hasShownModal) {
      setTimeout(() => {
        setShowCompletionModal(true);
        setHasShownModal(true);
      }, 400);
    }
  }, [moduleCompleted, hasShownModal]);

  const handleMarkAsCompleted = () => {
    if (!moduleCompleted) {
      setModuleCompleted(true);
      // Opcional: pasar directo a “Examen final”
      setActive({ kind: "exam" });
    }
  };

  const handleTakeExam = () => {
    setShowCompletionModal(false);
    setActive({ kind: "exam-quiz" });
  };

  const handleExamComplete = (attempt: ExamAttempt) => {
    setExamAttempts(prev => [...prev, attempt]);
  };

  const handleBackToCourse = () => {
    setActive({ kind: "module", id: COURSE.modules[0].id });
  };

  const module = COURSE.modules[0];

  return (
    <>
      <main className="min-h-[calc(100vh-4rem)] bg-[#e4e4e4]/30 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Volver */}
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 shadow-sm transition-colors border-slate-200/60"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>

          {/* Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-4">
              {/* Info del curso */}
              <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
                <h2 className="font-semibold text-slate-900 text-lg">{COURSE.title}</h2>
                {COURSE.description && (
                  <p className="text-sm text-slate-600 mt-1">{COURSE.description}</p>
                )}

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">Progreso del curso</span>
                    <span className="font-semibold text-[#132436] ">{progressPct}%</span>
                  </div>
                  <div className="mt-2 h-2.5 w-full rounded-full bg-blue-100">
                    <div
                      className="h-2.5 rounded-full bg-[#132436] transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    {moduleCompleted ? "1 de 1 módulo completado" : "0 de 1 módulo completado"}
                  </p>
                </div>
              </div>

              {/* Lista: 1 módulo + Examen final */}
              <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-4">Contenido</h3>

                <ul className="space-y-2">
                  {/* Único módulo */}
                  <li>
                    <button
                      onClick={() => setActive({ kind: "module", id: module.id })}
                      className={`w-full flex items-start gap-3 rounded-xl p-3 text-left transition-all
                        ${active.kind === "module"
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
                        <span className="text-xs font-medium text-slate-500">Módulo 1</span>
                        <h4 className={`font-medium mt-0.5 ${active.kind === "module" ? "text-[#132436]" : "text-[#374151]"}`}>
                          {module.title}
                        </h4>
                        {module.duration && (
                          <p className="text-xs text-slate-600 mt-1">{module.duration}</p>
                        )}
                      </div>
                    </button>
                  </li>

                  {/* Examen final */}
                  <li>
                    <button
                      onClick={() => moduleCompleted && setActive({ kind: "exam" })}
                      disabled={!moduleCompleted}
                      className={`w-full flex items-start gap-3 rounded-xl p-3 text-left transition-all
                        ${active.kind === "exam"
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
                        <h4 className={`font-medium mt-0.5 ${active.kind === "exam" ? "text-[#132436]" : "text-[#374151]"}`}>
                          Examen final
                        </h4>
                        <p className="text-xs text-slate-600 mt-1">
                          {moduleCompleted ? "Listo para rendir" : "Completa el módulo para habilitar"}
                        </p>
                      </div>
                    </button>
                  </li>

                  {/* Historial de exámenes */}
                  {moduleCompleted && examAttempts.length > 0 && (
                    <li>
                      <button
                        onClick={() => setActive({ kind: "exam-history" })}
                        className={`w-full flex items-start gap-3 rounded-xl p-3 text-left transition-all
                          ${active.kind === "exam-history"
                            ? "bg-[#224666]/10 border border-[#224666]/50 shadow-sm"
                            : "bg-slate-50 border border-slate-200/50 hover:bg-slate-100 hover:border-slate-300/50"
                          }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          <History className="h-5 w-5 text-[#224666]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium text-slate-500">Historial</span>
                          <h4 className={`font-medium mt-0.5 ${active.kind === "exam-history" ? "text-[#132436]" : "text-[#374151]"}`}>
                            Mis intentos
                          </h4>
                          <p className="text-xs text-slate-600 mt-1">
                            {examAttempts.length} intento{examAttempts.length !== 1 ? 's' : ''} realizado{examAttempts.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </aside>

            {/* Panel derecho */}
            <section className="lg:col-span-8">
              {active.kind === "exam" ? (
                <ExamReadyPanel
                  courseTitle={COURSE.title}
                  onTakeExam={handleTakeExam}
                  completedModules={moduleCompleted ? 1 : 0}
                  totalModules={1}
                />
              ) : active.kind === "exam-quiz" ? (
                <ExamQuiz
                  courseTitle={COURSE.title}
                  onExamComplete={handleExamComplete}
                  onBackToCourse={handleBackToCourse}
                  attempts={examAttempts}
                  maxAttempts={MAX_EXAM_ATTEMPTS}
                />
              ) : active.kind === "exam-history" ? (
                <ExamHistory
                  attempts={examAttempts}
                  maxAttempts={MAX_EXAM_ATTEMPTS}
                  onTakeExam={() => setActive({ kind: "exam-quiz" })}
                />
              ) : (
                <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-slate-200/60">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-sm font-medium text-[#132436]">Módulo 1</span>
                        <h2 className="text-2xl font-semibold text-[#132436] mt-1">{module.title}</h2>
                        {module.duration && (
                          <p className="text-sm text-slate-600 mt-1">Duración: {module.duration}</p>
                        )}
                      </div>
                      {moduleCompleted && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-[#008000] text-white rounded-full text-sm font-medium">
                          <CheckCircle2 className="h-4 w-4" />
                          Completado
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6">
                    {module.videoUrl ? (
                      <div className="aspect-video rounded-xl overflow-hidden bg-slate-900">
                        <iframe
                          src={module.videoUrl}
                          className="w-full h-full"
                          title={module.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-xl bg-slate-100 grid place-content-center text-slate-500">
                        <div className="text-center">
                          <Play className="h-16 w-16 mx-auto mb-2 text-slate-400" />
                          <p>Contenido del módulo próximamente</p>
                        </div>
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="mt-6 flex items-center justify-between gap-4">
                      <div className="text-sm text-slate-600">
                        {moduleCompleted ? "1 de 1 módulo completado" : "0 de 1 módulo completado"}
                      </div>

                      <div className="flex items-center gap-3">
                        {!moduleCompleted ? (
                          <button
                            onClick={handleMarkAsCompleted}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#132436] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#224666] active:translate-y-px transition-all shadow-sm"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Marcar como completado
                          </button>
                        ) : (
                          <button
                            onClick={() => setActive({ kind: "exam" })}
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800 active:translate-y-px transition-all shadow-sm"
                          >
                            Ir al examen
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Modal al completar el módulo */}
      <CourseCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        courseTitle={COURSE.title}
        onTakeExam={handleTakeExam}
      />
    </>
  );
}
