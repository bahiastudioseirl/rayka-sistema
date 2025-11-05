import { useMemo, useState } from "react"
import { ArrowLeft, ChevronDown, ChevronRight, Play, CheckCircle2 } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

type Session = {
  id: string | number
  title: string
  completed?: boolean
  videoUrl?: string         // 👈 NUEVO
}

type Module = {
  id: string | number
  title: string
  totalSessions: number
  completedSessions: number
  sessions: Session[]
}

type CourseDetail = {
  id: string
  title: string
  progressPct: number
  modules: Module[]
}

// ***** DATOS HARDCODEADOS *****
const COURSE: CourseDetail = {
  id: "fundamentos-js",
  title: "Fundamentos de JavaScript",
  progressPct: 33,
  modules: [
    {
      id: 1,
      title: "Introducción a JavaScript",
      totalSessions: 5,
      completedSessions: 5,
      sessions: [
        {
          id: 1,
          title: "¿Qué es JavaScript?",
          completed: true,
          // 👇 tu video
          videoUrl:
            "https://www.youtube.com/embed/aL2KL6rvIus?si=6dc0QMeCU9e8kuTO",
        },
        { id: 2, title: "Variables y Tipos", completed: true },
        { id: 3, title: "Operadores", completed: true },
        { id: 4, title: "Entrada/Salida", completed: true },
        { id: 5, title: "Buenas prácticas", completed: true },
      ],
    },
    {
      id: 2,
      title: "Control de Flujo",
      totalSessions: 5,
      completedSessions: 0,
      sessions: [
        { id: 1, title: "Condicionales if/else" },
        { id: 2, title: "Switch" },
        { id: 3, title: "Bucles for/while" },
        { id: 4, title: "Break/Continue" },
        { id: 5, title: "Errores y try/catch" },
      ],
    },
    {
      id: 3,
      title: "Funciones",
      totalSessions: 5,
      completedSessions: 0,
      sessions: [
        { id: 1, title: "Funciones básicas" },
        { id: 2, title: "Scope y Hoisting" },
        { id: 3, title: "Arrow functions" },
        { id: 4, title: "Parámetros y retorno" },
        { id: 5, title: "Closures" },
      ],
    },
  ],
}

export default function CursoSeccion() {
  const navigate = useNavigate()
  const { cursoId } = useParams<{ cursoId: string }>()

  const [openModuleId, setOpenModuleId] = useState<string | number | undefined>(
    COURSE.modules[0]?.id
  )
  const [active, setActive] = useState<{
    moduleId?: string | number
    sessionId?: string | number
  }>({})

  const handleSelect = (moduleId: Module["id"], sessionId: Session["id"]) => {
    setActive({ moduleId, sessionId })
  }

  const activeSession = useMemo(() => {
    const mod = COURSE.modules.find((m) => m.id === active.moduleId)
    return { module: mod, session: mod?.sessions.find((s) => s.id === active.sessionId) }
  }, [active])

  return (
    <main className="bg-slate-50 min-h-[calc(100vh-4rem)] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Izquierdo */}
          <aside className="lg:col-span-4 space-y-4">
            {/* Resumen del curso */}
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-slate-900">{COURSE.title}</h2>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">Progreso</span>
                  <span className="font-semibold text-emerald-700">{COURSE.progressPct}%</span>
                </div>
                <div className="mt-2 h-2.5 w-full rounded-full bg-emerald-100">
                  <div
                    className="h-2.5 rounded-full bg-emerald-600"
                    style={{ width: `${COURSE.progressPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Módulos */}
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-slate-900">Módulos</h3>

              <div className="mt-4 space-y-3">
                {COURSE.modules.map((m) => {
                  const activeStyle =
                    m.id === openModuleId ? "bg-emerald-50 border-emerald-200" : "bg-white"
                  const pct =
                    m.totalSessions > 0
                      ? Math.round((m.completedSessions / m.totalSessions) * 100)
                      : 0

                  return (
                    <div key={m.id} className={`rounded-xl border ${activeStyle} p-3`}>
                      <button
                        className="w-full flex items-center justify-between"
                        onClick={() => setOpenModuleId((prev) => (prev === m.id ? undefined : m.id))}
                        aria-expanded={openModuleId === m.id}
                      >
                        <div>
                          <div className="font-medium text-slate-900">{m.title}</div>
                          <div className="text-xs text-slate-600">
                            {m.completedSessions} de {m.totalSessions} sesiones
                          </div>
                        </div>
                        {openModuleId === m.id ? (
                          <ChevronDown className="h-4 w-4 text-slate-600" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-600" />
                        )}
                      </button>

                      {/* Progreso */}
                      <div className="mt-3">
                        <div className="h-2 rounded-full bg-slate-200">
                          <div
                            className="h-2 rounded-full bg-emerald-600"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      {/* Sesiones */}
                      {openModuleId === m.id && (
                        <ul className="mt-3 space-y-1">
                          {m.sessions.map((s) => {
                            const isActive = active.moduleId === m.id && active.sessionId === s.id
                            return (
                              <li key={s.id}>
                                <button
                                  onClick={() => handleSelect(m.id, s.id)}
                                  className={`w-full flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors ${
                                    isActive
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "hover:bg-slate-50 text-slate-700"
                                  }`}
                                >
                                  {s.completed ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                  ) : (
                                    <Play className="h-4 w-4 text-slate-500" />
                                  )}
                                  <span className="truncate">{s.title}</span>
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* Panel Derecho */}
          <section className="lg:col-span-8">
            {activeSession.session ? (
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">
                  {activeSession.session.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Módulo: {activeSession.module?.title}
                </p>

                {/* Contenido */}
                {activeSession.session.videoUrl ? (
                  <div className="mt-5">
                    {/* Wrapper responsivo 16:9 */}
                    <div className="relative w-full overflow-hidden rounded-xl"
                         style={{ paddingTop: "56.25%" }}>
                      <iframe
                        className="absolute left-0 top-0 h-full w-full rounded-xl"
                        src={activeSession.session.videoUrl}
                        title="YouTube video player"
                        frameBorder={0}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                    <button className="m-10 bg-amber-600 p-5 border-2 border-lg">holaa</button>
                  </div>
                ) : (
                  <div className="mt-5 h-64 rounded-xl bg-slate-100 grid place-content-center text-slate-500">
                    Contenido de la sesión #{String(activeSession.session.id)}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border bg-white p-6 shadow-sm text-center text-slate-600">
                Selecciona un módulo y sesión de la izquierda para comenzar
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
