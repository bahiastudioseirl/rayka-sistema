import { useState, useEffect } from "react"
import { ArrowLeft, Play, CheckCircle2, ChevronRight } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { CourseCompletionModal, ExamReadyPanel } from "./components"

type Module = {
  id: string | number
  title: string
  completed?: boolean
  videoUrl?: string
  duration?: string
}

type CourseDetail = {
  id: string
  title: string
  description?: string
  progressPct: number
  modules: Module[]
}

// ***** DATOS HARDCODEADOS *****
const COURSE: CourseDetail = {
  id: "fundamentos-js",
  title: "Fundamentos de JavaScript",
  description: "Aprende los conceptos básicos de JavaScript desde cero",
  progressPct: 20,
  modules: [
    {
      id: 1,
      title: "¿Qué es JavaScript?",
      completed: true,
      duration: "15:30",
      videoUrl: "https://www.youtube.com/embed/aL2KL6rvIus?si=6dc0QMeCU9e8kuTO",
    },
    {
      id: 2,
      title: "Variables y Tipos de Datos",
      completed: false,
      duration: "22:45",
      videoUrl: "https://www.youtube.com/embed/Z34BF9PCfYg",
    },
    {
      id: 3,
      title: "Operadores y Expresiones",
      completed: false,
      duration: "18:20",
    },
    {
      id: 4,
      title: "Control de Flujo",
      completed: false,
      duration: "25:10",
    },
    {
      id: 5,
      title: "Funciones en JavaScript",
      completed: false,
      duration: "30:00",
    },
  ],
}

// ******************************** COMPONENTE PRINCIPAL ********************************
export default function CursoSeccion() {
  const navigate = useNavigate()
  const { cursoId } = useParams<{ cursoId: string }>()

  // Módulo seleccionado (por defecto el primero no completado, o el primero)
  const [activeModuleId, setActiveModuleId] = useState<string | number>(
    COURSE.modules.find(m => !m.completed)?.id || COURSE.modules[0]?.id
  )

  // Lista de módulos con estado de completado (simulado en estado local)
  const [moduleStates, setModuleStates] = useState<Record<string | number, boolean>>(
    COURSE.modules.reduce((acc, m) => ({ ...acc, [m.id]: m.completed || false }), {})
  )

  // Estado del modal de completación
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [hasShownModal, setHasShownModal] = useState(false)

  const activeModule = COURSE.modules.find(m => m.id === activeModuleId)
  const completedCount = Object.values(moduleStates).filter(Boolean).length
  const progressPct = Math.round((completedCount / COURSE.modules.length) * 100)

  // Verificar si todos los módulos están completados
  useEffect(() => {
    const allCompleted = COURSE.modules.every(m => moduleStates[m.id])
    if (allCompleted && completedCount === COURSE.modules.length && !hasShownModal) {
      // Pequeño delay para que se vea la animación de completado
      setTimeout(() => {
        setShowCompletionModal(true)
        setHasShownModal(true)
      }, 500)
    }
  }, [moduleStates, completedCount, hasShownModal])

  const handleMarkAsCompleted = () => {
    if (!activeModuleId) return
    
    // Marcar como completado
    setModuleStates(prev => ({ ...prev, [activeModuleId]: true }))

    // Buscar el siguiente módulo no completado
    const currentIndex = COURSE.modules.findIndex(m => m.id === activeModuleId)
    const nextModule = COURSE.modules
      .slice(currentIndex + 1)
      .find(m => !moduleStates[m.id])

    // Si hay siguiente módulo, seleccionarlo
    if (nextModule) {
      setActiveModuleId(nextModule.id)
    }
  }

  const handleSelectModule = (moduleId: string | number) => {
    setActiveModuleId(moduleId)
  }

  const handleTakeExam = () => {
    setShowCompletionModal(false)
    // TODO: Navegar a la página del examen
    console.log("Navegar a examen del curso:", COURSE.id)
    // navigate(`/examen/${cursoId}`)
  }

  return (
    <>
      <main className="min-h-[calc(100vh-4rem)] bg-[#e4e4e4]/30 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Botón Volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 shadow-sm transition-colors border-slate-200/60"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        {/* Layout 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Izquierdo - Lista de Módulos */}
          <aside className="lg:col-span-4 space-y-4">
            {/* Información del curso */}
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
                  {completedCount} de {COURSE.modules.length} módulos completados
                </p>
              </div>
            </div>

            {/* Lista de Módulos */}
            <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4">Módulos del Curso</h3>

              <ul className="space-y-2">
                {COURSE.modules.map((module, index) => {
                  const isActive = module.id === activeModuleId
                  const isCompleted = moduleStates[module.id]

                  return (
                    <li key={module.id}>
                      <button
                        onClick={() => handleSelectModule(module.id)}
                        className={`w-full flex items-start gap-3 rounded-xl p-3 text-left transition-all
                          ${isActive
                            ? "bg-[#224666]/10 border border-[#224666]/50 shadow-sm"
                            : "bg-slate-50 border border-slate-200/50 hover:bg-slate-100 hover:border-slate-300/50"
                          }`}
                      >
                        {/* Icono */}
                        <div className="shrink-0 mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-[#224666]" />
                          ) : (
                            <Play className="h-5 w-5 text-slate-500" />
                          )}
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <span className="text-xs font-medium text-slate-500">
                                Módulo {index + 1}
                              </span>
                              <h4 className={`font-medium mt-0.5 ${
                                isActive ? "text-[#132436]" : "text-[#374151]"
                              }`}>
                                {module.title}
                              </h4>
                            </div>
                          </div>
                          {module.duration && (
                            <p className="text-xs text-slate-600 mt-1">{module.duration}</p>
                          )}
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </aside>

          {/* Panel Derecho - Contenido del Módulo */}
          <section className="lg:col-span-8">
            {completedCount === COURSE.modules.length ? (
              /* Panel de Examen Listo - Todos los módulos completados */
              <ExamReadyPanel
                courseTitle={COURSE.title}
                onTakeExam={handleTakeExam}
                completedModules={completedCount}
                totalModules={COURSE.modules.length}
              />
            ) : activeModule ? (
              <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
                {/* Header del módulo */}
                <div className="p-6 border-b border-slate-200/60">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-sm font-medium text-[#132436]">
                        Módulo {COURSE.modules.findIndex(m => m.id === activeModule.id) + 1}
                      </span>
                      <h2 className="text-2xl font-semibold text-[#132436] mt-1">
                        {activeModule.title}
                      </h2>
                      {activeModule.duration && (
                        <p className="text-sm text-slate-600 mt-1">
                          Duración: {activeModule.duration}
                        </p>
                      )}
                    </div>
                    {moduleStates[activeModule.id] && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-[#008000] text-white rounded-full text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        Completado
                      </div>
                    )}
                  </div>
                </div>

                {/* Video/Contenido */}
                <div className="p-6">
                  {activeModule.videoUrl ? (
                    <div className="aspect-video rounded-xl overflow-hidden bg-slate-900">
                      <iframe
                        src={activeModule.videoUrl}
                        className="w-full h-full"
                        title={activeModule.title}
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

                  {/* Botones de acción */}
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="text-sm text-slate-600">
                      {completedCount} de {COURSE.modules.length} módulos completados
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {!moduleStates[activeModule.id] && (
                        <button
                          onClick={handleMarkAsCompleted}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#132436] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#224666] active:translate-y-px transition-all shadow-sm"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Marcar como completado
                        </button>
                      )}
                      
                      {moduleStates[activeModule.id] && 
                        COURSE.modules.findIndex(m => m.id === activeModule.id) < COURSE.modules.length - 1 && (
                        <button
                          onClick={() => {
                            const currentIndex = COURSE.modules.findIndex(m => m.id === activeModule.id)
                            const nextModule = COURSE.modules[currentIndex + 1]
                            if (nextModule) setActiveModuleId(nextModule.id)
                          }}
                          className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800 active:translate-y-px transition-all shadow-sm"
                        >
                          Siguiente módulo
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200/60 bg-white p-12 shadow-sm text-center text-slate-600">
                <p>Selecciona un módulo de la izquierda para comenzar</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>

    {/* Modal de Completación del Curso */}
    <CourseCompletionModal
      isOpen={showCompletionModal}
      onClose={() => setShowCompletionModal(false)}
      courseTitle={COURSE.title}
      onTakeExam={handleTakeExam}
    />
    </>
  )
}
