import { Layout } from '../../layout/layout'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { obtenerCursoDetalle } from './services/obtenerCursoDetalle'
import type { CursoDetalleResponse } from './schemas/EstudianteSchema'
import { AlertCircle } from 'lucide-react'
import CursoSeccionDinamico from './components/CursoSeccionDinamico'

export default function CursoContenido() {
	const { cursoId } = useParams<{ cursoId: string }>()
	const navigate = useNavigate()
	const [cursoData, setCursoData] = useState<CursoDetalleResponse['data'] | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		const cargarCurso = async () => {
			if (!cursoId) {
				setError('ID de curso no válido')
				setLoading(false)
				return
			}

			setLoading(true)
			setError('')

			try {
				// Verificar token
				const token = localStorage.getItem('estudiante_token')
				if (!token) {
					navigate('/login')
					return
				}

				const response = await obtenerCursoDetalle(Number(cursoId))
				
				if (response.success) {
					setCursoData(response.data)
				} else {
					setError('No se pudo cargar el curso')
				}
			} catch (err) {
				console.error('Error cargando curso:', err)
				if (err instanceof Error) {
					setError(err.message)
					if (err.message.includes('sesión')) {
						setTimeout(() => navigate('/login'), 2000)
					}
				} else {
					setError('Error al cargar el curso')
				}
			} finally {
				setLoading(false)
			}
		}

		cargarCurso()
	}, [cursoId, navigate])

	return (
		<Layout>
			{loading && (
				<div className="min-h-[calc(100vh-4rem)] bg-[#e4e4e4]/30 flex items-center justify-center">
					<div className="flex flex-col items-center space-y-3">
						<div className="w-12 h-12 border-4 border-[#132436] border-t-transparent rounded-full animate-spin"></div>
						<p className="text-gray-600">Cargando curso...</p>
					</div>
				</div>
			)}

			{error && !loading && (
				<div className="min-h-[calc(100vh-4rem)] bg-[#e4e4e4]/30 flex items-center justify-center p-4">
					<div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center">
						<div className="flex flex-col items-center space-y-3">
							<div className="p-3 rounded-full bg-red-100">
								<AlertCircle className="w-8 h-8 text-red-600" />
							</div>
							<div>
								<p className="font-medium text-red-900">Error al cargar el curso</p>
								<p className="mt-1 text-sm text-red-600">{error}</p>
							</div>
							<button
								onClick={() => navigate(-1)}
								className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
							>
								Volver
							</button>
						</div>
					</div>
				</div>
			)}

			{cursoData && !loading && !error && (
				<CursoSeccionDinamico cursoData={cursoData} />
			)}
		</Layout>
	)
}