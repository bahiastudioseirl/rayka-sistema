import { Trophy, XCircle, Clock, Target, TrendingUp } from 'lucide-react';

interface ExamAttempt {
  id: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  date: Date;
  answers: number[];
}

interface ExamHistoryProps {
  attempts: ExamAttempt[];
  maxAttempts: number;
  onTakeExam: () => void;
}

export const ExamHistory = ({ attempts, maxAttempts, onTakeExam }: ExamHistoryProps) => {
  const remainingAttempts = maxAttempts - attempts.length;
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.percentage)) : 0;
  const hasPassedExam = attempts.some(a => a.passed);

  const getScoreColor = (percentage: number, passed: boolean) => {
    if (passed) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (percentage: number, passed: boolean) => {
    if (passed) return 'bg-green-100 text-green-800 border-green-200';
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#132436] p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Historial de Exámenes</h3>
            <p className="text-blue-100 text-sm mt-1">
              {attempts.length} de {maxAttempts} intentos utilizados
            </p>
          </div>
          
          {!hasPassedExam && remainingAttempts > 0 && (
            <button
              onClick={onTakeExam}
              className="bg-white text-[#132436] px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              {attempts.length === 0 ? 'Tomar Examen' : 'Reintentar'}
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {attempts.length === 0 ? (
          /* Sin intentos */
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <Target className="h-8 w-8 text-slate-400" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">
              Aún no has tomado el examen
            </h4>
            <p className="text-slate-600 mb-6">
              Tienes {maxAttempts} intentos disponibles para completar este examen.
            </p>
            <button
              onClick={onTakeExam}
              className="inline-flex items-center gap-2 bg-[#132436] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#224666] transition-colors"
            >
              <Trophy className="h-5 w-5" />
              Comenzar Examen
            </button>
          </div>
        ) : (
          <>
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Mejor Puntaje</p>
                    <p className="text-2xl font-bold text-blue-900">{bestScore}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Intentos Restantes</p>
                    <p className="text-2xl font-bold text-slate-900">{remainingAttempts}</p>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl p-4 border ${
                hasPassedExam 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    hasPassedExam ? 'bg-green-100' : 'bg-amber-100'
                  }`}>
                    {hasPassedExam ? (
                      <Trophy className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${
                      hasPassedExam ? 'text-green-600' : 'text-amber-600'
                    }`}>
                      Estado
                    </p>
                    <p className={`text-lg font-bold ${
                      hasPassedExam ? 'text-green-900' : 'text-amber-900'
                    }`}>
                      {hasPassedExam ? 'Aprobado' : 'En Progreso'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de intentos */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">
                Historial de Intentos
              </h4>
              
              <div className="space-y-3">
                {attempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className={`p-4 rounded-xl border-2 ${getScoreBadge(attempt.percentage, attempt.passed)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
                          {attempt.passed ? (
                            <Trophy className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        
                        <div>
                          <p className="font-semibold">
                            Intento #{attempt.id}
                          </p>
                          <p className="text-sm opacity-75">
                            {attempt.date.toLocaleDateString()} a las{' '}
                            {attempt.date.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getScoreColor(attempt.percentage, attempt.passed)}`}>
                          {attempt.percentage}%
                        </p>
                        <p className="text-sm opacity-75">
                          {attempt.score}/{attempt.totalQuestions} correctas
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 w-full bg-white/50 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          attempt.passed ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${attempt.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mensaje de intentos restantes */}
            {!hasPassedExam && remainingAttempts > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">
                      Tienes {remainingAttempts} intento{remainingAttempts !== 1 ? 's' : ''} restante{remainingAttempts !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Necesitas obtener al menos 70% para aprobar el examen.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sin intentos restantes */}
            {!hasPassedExam && remainingAttempts === 0 && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">
                      Has agotado todos tus intentos
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Contacta con tu instructor para solicitar intentos adicionales.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};