import { Award, Trophy, CheckCircle2 } from "lucide-react"

interface ExamReadyPanelProps {
  courseTitle: string
  onTakeExam: () => void
  completedModules: number
  totalModules: number
}

export const ExamReadyPanel = ({
  courseTitle,
  onTakeExam,
 
}: ExamReadyPanelProps) => {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
      {/* Header con gradiente */}
      <div className="bg-[#132436] p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
          <Trophy className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          ¡Felicidades!
        </h2>
        <p className="text-emerald-50 text-lg">
          Has completado todos los módulos
        </p>
      </div>

      {/* Contenido */}
      <div className="p-8">
        {/* Mensaje principal */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            Estás apto para dar tu examen
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Has demostrado dedicación al completar todos los módulos de{" "}
            <span className="font-semibold text-emerald-700">{courseTitle}</span>.
            Ahora es momento de poner a prueba tus conocimientos.
          </p>
        </div>

        {/* Mensaje motivacional */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900">
            💡 <strong>Consejo:</strong> Tómate tu tiempo para responder cada pregunta con calma. 
            ¡Confía en lo que has aprendido!
          </p>
        </div>

        {/* Botón de acción */}
        <button
            onClick={onTakeExam}
            className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-[#132436] px-8 py-4 text-lg font-semibold text-white hover:bg-[#224666] active:translate-y-px transition-all"
        >
          <Award className="h-6 w-6" />
          Empezar examen ahora
        </button>

        {/* Información adicional */}
        <div className="mt-6 pt-6 border-t border-slate-200/60">
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900 mb-1">¿Qué esperar del examen?</p>
              <ul className="space-y-1 text-slate-600">
                <li>• Preguntas sobre todos los módulos completados</li>
                <li>• Tiempo recomendado: 30-45 minutos</li>
                <li>• Necesitas 70% o más para aprobar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
