import type { CourseCardProps } from "./CourseCard"

// Extender la interfaz para incluir el ID
export interface CourseData extends Omit<CourseCardProps, 'onClick'> {
  id: string
}

// Datos de ejemplo para los cursos de fitness
export const mockCoursesData: CourseData[] = [
  {
    id: "fundamentos-fitness",
    title: "Fundamentos de Fitness",
    description: "Aprende los conceptos básicos del entrenamiento físico, anatomía y nutrición deportiva.",
    progressPct: 75,
    modules: 8,
    sessions: 24,
    ctaText: "Continuar curso"
  },
  {
    id: "entrenamiento-funcional",
    title: "Entrenamiento Funcional",
    description: "Domina los movimientos funcionales y técnicas de entrenamiento para mejorar la fuerza y movilidad.",
    progressPct: 45,
    modules: 6,
    sessions: 18,
    ctaText: "Reanudar"
  },
  {
    id: "nutricion-deportiva",
    title: "Nutrición Deportiva Avanzada",
    description: "Estrategias nutricionales para optimizar el rendimiento deportivo y la composición corporal.",
    progressPct: 20,
    modules: 10,
    sessions: 32,
    ctaText: "Empezar"
  },
  {
    id: "yoga-flexibilidad",
    title: "Yoga y Flexibilidad",
    description: "Técnicas de yoga, estiramientos y movilidad para complementar tu entrenamiento físico.",
    progressPct: 90,
    modules: 5,
    sessions: 15,
    ctaText: "Finalizar"
  },
  {
    id: "entrenamiento-hiit",
    title: "Entrenamiento HIIT",
    description: "Intervalos de alta intensidad para quemar grasa y mejorar tu condición cardiovascular.",
    progressPct: 60,
    modules: 4,
    sessions: 12,
    ctaText: "Continuar"
  },
  {
    id: "psicologia-deporte",
    title: "Psicología del Deporte",
    description: "Desarrolla la mentalidad correcta y técnicas de motivación para alcanzar tus objetivos fitness.",
    progressPct: 0,
    modules: 7,
    sessions: 21,
    ctaText: "Comenzar curso"
  }
]

// Función helper para crear cursos con navegación
export const createCourseWithNavigation = (courseData: CourseData, navigate: (path: string) => void): CourseCardProps => ({
  ...courseData,
  onClick: () => navigate(`/cursos/${courseData.id}`)
})

// Para compatibilidad con el código existente
export const mockCourses: CourseCardProps[] = mockCoursesData.map(course => ({
  ...course,
  onClick: () => console.log(`Navegando a ${course.title}`)
}))

// Exportar componentes
export { default as CourseCard } from "./CourseCard"
export { default as CoursesGrid } from "./CoursesGrid"
export type { CourseCardProps } from "./CourseCard"