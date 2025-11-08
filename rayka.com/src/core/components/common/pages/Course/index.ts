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
    ctaText: "Continuar curso"
  },
  {
    id: "entrenamiento-funcional",
    title: "Entrenamiento Funcional",
    description: "Domina los movimientos funcionales y técnicas de entrenamiento para mejorar la fuerza y movilidad.",
    progressPct: 45,
    ctaText: "Reanudar"
  },
  {
    id: "nutricion-deportiva",
    title: "Nutrición Deportiva Avanzada",
    description: "Estrategias nutricionales para optimizar el rendimiento deportivo y la composición corporal.",
    progressPct: 20,
    ctaText: "Empezar"
  },
  {
    id: "yoga-flexibilidad",
    title: "Yoga y Flexibilidad",
    description: "Técnicas de yoga, estiramientos y movilidad para complementar tu entrenamiento físico.",
    progressPct: 90,
    ctaText: "Finalizar"
  },

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