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
			<main className="min-h-[calc(100vh-4rem)] bg-[#EFEFEF]">
				{/* CONTENEDOR CENTRAL UNIFICADO */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
					<div className="text-center mb-5">
						<h1 className="text-4xl font-bold text-[#132436] tracking-tight">
							MIS CURSOS
						</h1>
						<div className="w-24 h-1 bg-[#CD321A] mt-2 rounded-full mx-auto" />
						<p className="text-lg text-gray-600 mt-3">
							Capacitate con estos cursos diseñados para ti
						</p>
					</div>

					<CoursesGrid courses={coursesWithNavigation} />
				</div>
			</main>
		</Layout>
	)
}
