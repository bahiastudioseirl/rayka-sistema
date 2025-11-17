import { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { ExamResults } from './ExamResults';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // índice de la respuesta correcta
}

interface ExamAttempt {
  id: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  date: Date;
  answers: number[];
}

interface ExamQuizProps {
  courseTitle: string;
  onExamComplete: (attempt: ExamAttempt) => void;
  onBackToCourse: () => void;
  attempts: ExamAttempt[];
  maxAttempts: number;
}

// Preguntas de ejemplo para JavaScript
const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "¿Cuál es la forma correcta de declarar una variable en JavaScript?",
    options: ["var nombre;", "variable nombre;", "declare nombre;", "let nombre;"],
    correctAnswer: 0
  },
  {
    id: 2,
    question: "¿Qué método se utiliza para agregar un elemento al final de un array?",
    options: ["push()", "add()", "append()", "insert()"],
    correctAnswer: 0
  },
  {
    id: 3,
    question: "¿Cuál es el operador de comparación estricta en JavaScript?",
    options: ["==", "===", "!=", "!=="],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "¿Qué tipo de datos NO existe en JavaScript?",
    options: ["string", "boolean", "integer", "undefined"],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "¿Cómo se escribe un comentario de una línea en JavaScript?",
    options: ["/* comentario */", "# comentario", "// comentario", "<!-- comentario -->"],
    correctAnswer: 2
  }
];

export const ExamQuiz = ({ 
  courseTitle, 
  onExamComplete, 
  onBackToCourse,
  attempts,
  maxAttempts 
}: ExamQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>(new Array(SAMPLE_QUESTIONS.length).fill(-1));
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutos en segundos
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [examResult, setExamResult] = useState<ExamAttempt | null>(null);

  const canTakeExam = attempts.length < maxAttempts;

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmitExam();
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleSubmitExam = () => {
    let correctAnswers = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === SAMPLE_QUESTIONS[index].correctAnswer) {
        correctAnswers++;
      }
    });

    const percentage = Math.round((correctAnswers / SAMPLE_QUESTIONS.length) * 100);
    const passed = percentage >= 70;

    const attempt: ExamAttempt = {
      id: attempts.length + 1,
      score: correctAnswers,
      totalQuestions: SAMPLE_QUESTIONS.length,
      percentage,
      passed,
      date: new Date(),
      answers: userAnswers
    };

    setExamResult(attempt);
    setIsSubmitted(true);
    onExamComplete(attempt);
  };

  const answeredQuestions = userAnswers.filter(answer => answer !== -1).length;
  const progress = (answeredQuestions / SAMPLE_QUESTIONS.length) * 100;

  // Si no puede tomar más exámenes
  if (!canTakeExam) {
    return (
      <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            Límite de intentos alcanzado
          </h3>
          <p className="text-slate-600 mb-6">
            Has utilizado todos tus {maxAttempts} intentos disponibles para este examen.
          </p>
          <button
            onClick={onBackToCourse}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
          >
            Volver al curso
          </button>
        </div>
      </div>
    );
  }

  // Mostrar resultados
  if (isSubmitted && examResult) {
    return (
      <ExamResults
        result={examResult}
        onBackToCourse={onBackToCourse}
        canRetakeExam={attempts.length < maxAttempts - 1}
        onRetakeExam={() => {
          setCurrentQuestion(0);
          setUserAnswers(new Array(SAMPLE_QUESTIONS.length).fill(-1));
          setTimeLeft(30 * 60);
          setIsSubmitted(false);
          setExamResult(null);
        }}
      />
    );
  }

  const question = SAMPLE_QUESTIONS[currentQuestion];

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
      {/* Header del examen */}
      <div className="bg-[#132436] p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Examen: {courseTitle}</h2>
            <p className="text-blue-100 text-sm mt-1">
              Intento {attempts.length + 1} de {maxAttempts}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Progreso del examen</span>
            <span>{answeredQuestions}/{SAMPLE_QUESTIONS.length}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Contenido del examen */}
      <div className="p-6">
        {/* Navegación de preguntas */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Pregunta</span>
            <span className="font-semibold text-[#132436]">
              {currentQuestion + 1} de {SAMPLE_QUESTIONS.length}
            </span>
          </div>
          
          <div className="flex gap-1">
            {SAMPLE_QUESTIONS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  index === currentQuestion
                    ? 'bg-[#132436] text-white'
                    : userAnswers[index] !== -1
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Pregunta actual */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  userAnswers[currentQuestion] === index
                    ? 'border-[#132436] bg-[#132436]/5'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    userAnswers[currentQuestion] === index
                      ? 'border-[#132436] bg-[#132436]'
                      : 'border-slate-300'
                  }`}>
                    {userAnswers[currentQuestion] === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-slate-900">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navegación */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>

          <div className="flex items-center gap-3">
            {answeredQuestions < SAMPLE_QUESTIONS.length && (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                Faltan {SAMPLE_QUESTIONS.length - answeredQuestions} preguntas
              </div>
            )}

            {currentQuestion < SAMPLE_QUESTIONS.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="px-4 py-2 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg"
              >
                Siguiente →
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                disabled={answeredQuestions < SAMPLE_QUESTIONS.length}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#132436] text-white text-sm font-medium rounded-lg hover:bg-[#224666] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                Finalizar examen
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};