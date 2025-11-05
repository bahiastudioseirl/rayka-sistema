import { CoursesGrid, mockCoursesData, createCourseWithNavigation } from '../../core/components/common/pages/Course'
import { Layout } from '../../layout/layout'
import { useNavigate } from 'react-router-dom'

export default function CursosPage() {
	const navigate = useNavigate()
	
	// Crear cursos con navegación funcional
	const coursesWithNavigation = mockCoursesData.map(course => 
		createCourseWithNavigation(course, navigate)
	)

	return (
		<Layout>
			<main className="bg-gradient-to-br from-emerald-50 to-blue-50 min-h-[calc(100vh-4rem)]">
				{/* CONTENEDOR CENTRAL UNIFICADO */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
					<div className="text-left mb-5">
						<h1 className="text-4xl font-bold text-gray-800 tracking-tight">
							MIS CURSOS
						</h1>
						<div className="w-24 h-1 bg-emerald-600 mt-2 rounded-full" />
						<p className="text-lg text-gray-600 mt-6 ">
							Descubre nuestra amplia gama de cursos de fitness y nutrición diseñados para todos los niveles
						</p>
					</div>
					<CoursesGrid courses={coursesWithNavigation} />
				</div>
			</main>
		</Layout>
	)
}
