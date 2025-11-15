import { Layout } from '../../layout/layout'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { obtenerCursosEstudiante } from './services/obtenerCursosEstudiante'
import type { CursoEstudiante } from './schemas/EstudianteSchema'
import { API_CONFIG } from '../../config/api.config'
import { CoursesGrid } from '../../core/components/common/pages/Course'
import type { CourseCardProps } from '../../core/components/common/pages/Course/CourseCard'

export default function CursosPage() {
	const navigate = useNavigate()
	const { codigo } = useParams()
	const [cursos, setCursos] = useState<CursoEstudiante[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		const cargarCursos = async () => {
			setLoading(true)
			setError('')
			
			try {
				// Verificar si hay token
				const token = localStorage.getItem('estudiante_token')
				if (!token) {
					navigate(`/login/${codigo}`)
					return
				}

				const response = await obtenerCursosEstudiante()
				
				if (response.success) {
					setCursos(response.data.cursos)
				} else {
					setError('No se pudieron cargar los cursos')
				}
			} catch (err) {
				console.error('Error cargando cursos:', err)
				if (err instanceof Error) {
					setError(err.message)
					// Si el error es de sesión expirada, redirigir al login
					if (err.message.includes('sesión')) {
						setTimeout(() => navigate(`/login/${codigo}`), 2000)
					}
				} else {
					setError('Error al cargar los cursos')
				}
			} finally {
				setLoading(false)
			}
		}

		cargarCursos()
	}, [codigo, navigate])

	const handleCursoClick = (cursoId: number) => {
		navigate(`/cursos/${cursoId}`)
	}

	// Convertir cursos a formato de CourseCard
	const coursesWithNavigation: CourseCardProps[] = cursos.map(curso => ({
		title: curso.titulo,
		description: curso.descripcion,
		progressPct: 0, // Por ahora en 0, en el futuro se puede rastrear el progreso
		imageUrl: curso.url_imagen ? API_CONFIG.getFullUrl(curso.url_imagen) : undefined,
		ctaText: 'Ver curso',
		onClick: () => handleCursoClick(curso.id_curso)
	}))

	return (
		<Layout>
			<main className="min-h-[calc(100vh-4rem)] bg-[#EFEFEF]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
					<div className="text-center mb-5">
						<h1 className="text-4xl font-bold text-[#132436] tracking-tight">
							MIS CURSOS
						</h1>
						<div className="w-24 h-1 bg-[#CD321A] mt-2 rounded-full mx-auto" />
						<p className="text-lg text-gray-600 mt-3">
							Capacítate con estos cursos diseñados para ti
						</p>
					</div>

					{/* Loading State */}
					{loading && (
						<div className="flex flex-col items-center justify-center py-20">
							<div className="w-12 h-12 border-4 border-[#132436] border-t-transparent rounded-full animate-spin"></div>
							<p className="mt-4 text-gray-600">Cargando tus cursos...</p>
						</div>
					)}

					{/* Error State */}
					{error && !loading && (
						<div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
							<div className="flex flex-col items-center space-y-3">
								<div className="p-3 rounded-full bg-red-100">
									<AlertCircle className="w-8 h-8 text-red-600" />
								</div>
								<div>
									<p className="font-medium text-red-900">Error al cargar los cursos</p>
									<p className="mt-1 text-sm text-red-600">{error}</p>
								</div>
							</div>
						</div>
					)}

					{/* Cursos Grid */}
					{!loading && !error && cursos.length > 0 && (
						<CoursesGrid courses={coursesWithNavigation} />
					)}

					{/* Empty State */}
					{!loading && !error && cursos.length === 0 && (
						<div className="bg-white rounded-xl shadow-sm p-12 text-center">
							<div className="flex flex-col items-center space-y-3">
								<div className="p-4 rounded-full bg-gray-100">
									<AlertCircle className="w-12 h-12 text-gray-400" />
								</div>
								<div>
									<p className="font-medium text-gray-700">No hay cursos disponibles</p>
									<p className="mt-1 text-sm text-gray-500">
										Aún no se han asignado cursos a esta capacitación
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</main>
		</Layout>
	)
}
