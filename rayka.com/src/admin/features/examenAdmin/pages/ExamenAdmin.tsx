import { Edit, Plus, Search, Trash2, Eye, AlertCircle, FileText } from "lucide-react"
import { useState, useEffect } from "react"
import ModalAgregarExamen from "../components/ModalAgregar"
import { crearExamen } from "../services/crearExamen"
import type { CrearExamenRequest } from "../schemas/ExamenSchema"
import { obtenerCursos } from "../../cursosAdmin/services/obtenerCursos"
import type { CursoParaSelect } from "../components/ModalAgregar"

export default function ExamenAdmin() {
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cursos, setCursos] = useState<CursoParaSelect[]>([])


  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const response = await obtenerCursos()
        setCursos(response.data || [])
      } catch (error) {
        console.error("Error al cargar cursos:", error)
      }
    }

    cargarCursos()
  }, [])

  const handleSaveExamen = async (data: CrearExamenRequest) => {
    setIsSubmitting(true)
    try {
      await crearExamen(data)

      alert("¡Examen creado con éxito!")
      setIsModalOpen(false)

    } catch (error) {
      console.error("Error al crear el examen:", error)
      let errorMessage = "Ocurrió un error desconocido";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(`Error al guardar: ${errorMessage}`)

    } finally {
      setIsSubmitting(false)
    }
  }
  // --- FIN DE CAMBIOS ---

  // Tus datos de ejemplo - ¡los mantenemos!
  const filteredData = [
    {
      id: 1,
      fecha: "2025-06-30",
      titulo: "Elemento de Ejemplo",
      categoria: "Categoria1",
      descripcion: "Esta es una descripción de ejemplo para el elemento",
      archivo: "/placeholder.svg"
    }
  ]
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleEdit = () => {
    console.log("Editar elemento:")
  }

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
      console.log("Eliminar elemento:")
    }
  }

  return (
    <div className="space-y-6">
      {/* ... (Todo tu JSX del Header y la Tabla se mantiene EXACTAMENTE IGUAL) ... */}

      {/* Header */}
      <div className="bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Gestión de Exámenes</h1>
                <p className="mt-1 text-slate-600">Administra los elementos del sistema Rayka Academia</p>
              </div>
            </div>
            <button
              className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-[#132436] rounded-lg shadow-sm hover:bg-[#224666]"
              onClick={openModal}
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Examen</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                <input
                  placeholder="Buscar por título, categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-200">
              <span className="font-medium text-slate-700">{filteredData.length}</span>
              <span className="ml-1 text-slate-500">elementos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content (Tu tabla estática) */}
      <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
        {/* ... (Tu tabla <table>...</table> se mantiene igual) ... */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-slate-50 border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Fecha</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Titulo</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Curso</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Preguntas</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading && (<tr>...</tr>)}
              {error && (<tr>...</tr>)}
              {!loading && !error && filteredData.length === 0 && (<tr>...</tr>)}
              {!loading &&
                filteredData.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{item.fecha}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm font-medium text-slate-900 line-clamp-2">{item.titulo}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="max-w-md text-sm text-slate-600 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: item.descripcion }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm font-medium text-slate-900 line-clamp-2">{item.archivo}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <button
                          className="p-2 transition-colors rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                          title="Ver elemento"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 transition-colors rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                          onClick={() => handleEdit()}
                          title="Editar elemento"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 transition-colors rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete()}
                          title="Eliminar elemento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 9. RENDERIZAR EL MODAL AL FINAL */}
      <ModalAgregarExamen
        open={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveExamen}
        loading={isSubmitting} // 10. Conectamos el 'loading' a nuestro 'isSubmitting'
        cursos={cursos} // 11. Pasamos los cursos de nuestro 'useState'
      />
    </div>
  )
}