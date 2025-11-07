import { useEffect, useState } from "react"
import { CheckCircle2, Trophy, Award } from "lucide-react"

interface CourseCompletionModalProps {
  isOpen: boolean
  onClose: () => void
  courseTitle: string
  onTakeExam: () => void
}

export const CourseCompletionModal = ({
  isOpen,
  onClose,
  courseTitle,
  onTakeExam,
}: CourseCompletionModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      // Detener confetti después de 5 segundos
      const timer = setTimeout(() => setShowConfetti(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50  z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icono de trofeo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-50 animate-pulse" />
             
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              ¡Felicidades!
            </h2>
            <p className="text-lg text-slate-600">
              Has completado exitosamente
            </p>
            <p className="text-xl font-semibold text-emerald-700 mt-2">
              {courseTitle}
            </p>
          </div>

          {/* Estadísticas */}
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="text-2xl font-bold text-slate-900">100%</span>
                </div>
                <p className="text-xs text-slate-600">Completado</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Award className="h-5 w-5 text-amber-600" />
                  <span className="text-2xl font-bold text-slate-900">5/5</span>
                </div>
                <p className="text-xs text-slate-600">Módulos</p>
              </div>
            </div>
          </div>

          {/* Mensaje de examen */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900 text-center">
              Ahora estás listo para demostrar lo que has aprendido
            </p>
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onTakeExam}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#132436] px-6 py-3 text-base font-semibold text-white hover:bg-[#224666] active:translate-y-px transition-all "
            >
              <Award className="h-5 w-5" />
              Listo para dar el examen
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-lg border-2 border-slate-200 bg-white px-6 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 active:translate-y-px transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Confetti */}
      {showConfetti && <Confetti />}
    </>
  )
}

// Componente de Confetti
const Confetti = () => {
  const colors = [
    "bg-emerald-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
  ]

  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: colors[Math.floor(Math.random() * colors.length)],
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className={`absolute w-3 h-3 ${piece.color} rounded-sm animate-confetti`}
          style={{
            left: `${piece.left}%`,
            top: "-20px",
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
