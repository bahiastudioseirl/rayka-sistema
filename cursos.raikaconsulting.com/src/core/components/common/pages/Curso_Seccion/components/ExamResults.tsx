import { Trophy, XCircle, Clock, RefreshCw, ArrowLeft } from 'lucide-react';

interface ExamAttempt {
  id: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  date: Date;
  answers: number[];
}

interface ExamResultsProps {
  result: ExamAttempt;
  onBackToCourse: () => void;
  canRetakeExam: boolean;
  onRetakeExam: () => void;
}

export const ExamResults = ({
  result,
  onBackToCourse,
  canRetakeExam,
  onRetakeExam
}: ExamResultsProps) => {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-50 border-green-200';
    if (percentage >= 70) return 'bg-blue-50 border-blue-200';
    if (percentage >= 50) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
      {/* Header con resultado */}
      <div className={`p-8 text-center ${
        result.passed 
          ? 'bg-linear-to-br from-green-500 to-green-600' 
          : 'bg-linear-to-br from-red-500 to-red-600'
      }`}>
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
          {result.passed ? (
            <Trophy className="h-10 w-10 text-white" />
          ) : (
            <XCircle className="h-10 w-10 text-white" />
          )}
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">
          {result.passed ? '¡Felicidades!' : '¡Sigue intentando!'}
        </h2>
        
        <p className="text-white/90 text-lg mb-4">
          {result.passed 
            ? 'Has aprobado el examen exitosamente' 
            : 'No alcanzaste el puntaje mínimo requerido'
          }
        </p>

        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
          <Clock className="h-4 w-4 text-white" />
          <span className="text-white text-sm">
            {result.date.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Puntuación detallada */}
      <div className="p-8">
        <div className={`rounded-2xl border-2 p-6 mb-8 ${getScoreBgColor(result.percentage)}`}>
          <div className="text-center">
            <div className={`text-5xl font-bold mb-2 ${getScoreColor(result.percentage)}`}>
              {result.percentage}%
            </div>
            <p className="text-slate-600 mb-4">
              {result.score} de {result.totalQuestions} respuestas correctas
            </p>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  result.passed ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.percentage}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Puntaje mínimo para aprobar: 70%
            </p>
          </div>
        </div>

        {/* Mensaje adicional según el resultado */}
        <div className="mb-8">
          {result.passed ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                ¡Excelente trabajo!
              </h3>
              <p className="text-green-700">
                Has demostrado un buen dominio de los conceptos del curso. 
                ¡Continúa así!
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Necesitas mejorar
              </h3>
              <p className="text-red-700 mb-3">
                Te recomendamos revisar el material del curso antes de tu próximo intento.
              </p>
              <p className="text-sm text-red-600">
                Puntaje mínimo requerido: 70% • Tu puntaje: {result.percentage}%
              </p>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-200">
          <button
            onClick={onBackToCourse}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al curso
          </button>

          {!result.passed && canRetakeExam && (
            <button
              onClick={onRetakeExam}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#132436] text-white hover:bg-[#224666] rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Intentar de nuevo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};