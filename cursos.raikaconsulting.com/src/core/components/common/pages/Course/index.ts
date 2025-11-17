import type { CourseCardProps } from "./CourseCard"
import Seguridad_Rayka from "../../../../../assets/Seguridad_Rayka.jpeg"
import Proyecto_Rayka from "../../../../../assets/Proyecto_Rayka.jpeg"
import Planos_Rayka from "../../../../../assets/Planos_Rayka.png"
import Maquinaria_Rayka from "../../../../../assets/Maquinaria_Rayka.jpg"
export interface CourseData extends Omit<CourseCardProps, 'onClick'> {
  id: string
}

// Datos de ejemplo para los cursos de fitness
export const mockCoursesData: CourseData[] = [
  {
    id: "seguridad-y-salud-ocupacional",
    title: "Seguridad y Salud Ocupacional",
    description: "Aprende los conceptos básicos de seguridad y salud en el trabajo.",
    progressPct: 75,
    imageUrl: Seguridad_Rayka,
    ctaText: "Continuar curso"
  },
  {
    id: "gestion-de-proyectos-construccion",
    title: "Gestión de Proyectos de Construcción",
    description: "Domina los principios de gestión de proyectos aplicados a la construcción.",
    progressPct: 45,
    imageUrl: Proyecto_Rayka,
    ctaText: "Reanudar"
  },
  {
    id: "lectura-e-interpretacion-planos",
    title: "Lectura e Interpretación de Planos",
    description: "Aprende a leer e interpretar planos arquitectónicos y de construcción.",
    progressPct: 20,
    imageUrl: Planos_Rayka,
    ctaText: "Empezar"
  },
  {
    id: "operacion-segura-maquinaria-pesada",
    title: "Operación Segura de Maquinaria Pesada",
    description: "Aprende a operar maquinaria pesada de manera segura y eficiente.",
    progressPct: 90,
    imageUrl: Maquinaria_Rayka,
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