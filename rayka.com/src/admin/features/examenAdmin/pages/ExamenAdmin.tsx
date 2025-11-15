import { Edit, Plus, Search, Trash2, Eye, FileText, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { obtenerExamenes } from "../services/obtenerExamen"
import type { ExamenEnLista } from "../schemas/examenSchema"
import ModalAgregarExamen from "../components/ModalAgregar"
import { crearExamen } from "../services/crearExamen"
import type { CrearExamenRequest } from "../schemas/examenSchema"
import { obtenerCursos } from "../../cursosAdmin/services/obtenerCursos"
import type { CursoParaSelect } from "../components/ModalAgregar"
import ModalEditarExamen from "../components/ModalEditar"
import ConfirmModal from "../components/ConfirmModal"


const ITEMS_PER_PAGE = 5;

export default function ExamenAdmin() {
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true) 
  const [error, setError] = useState("")
  const [examenes, setExamenes] = useState<ExamenEnLista[]>([]) 
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // --- CAMBIO ---
  // 2. Estados para el modal de "Agregar"
  const [isModalAgregarOpen, setIsModalAgregarOpen] = useState(false); // Renombrado
  const [isSubmitting, setIsSubmitting] = useState(false) // Loading para crear
  
  // Estados para el modal de "Editar"
  const [isModalEditarOpen, setIsModalEditarOpen] = useState(false);
  const [examenAEditar, setExamenAEditar] = useState<ExamenEnLista | null>(null);
  
  // Estados para modales de confirmación y éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: "", message: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  
  const [cursos, setCursos] = useState<CursoParaSelect[]>([])
  const [currentPage, setCurrentPage] = useState(1);

  // useEffect para cargar cursos (sin cambios)
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

  // useEffect para cargar exámenes (sin cambios)
  useEffect(() => {
    const cargarExamenes = async () => {
      setLoading(true)
      setError("")
      setCurrentPage(1); 
      try {
        const data = await obtenerExamenes({ search: searchTerm })
        setExamenes(data) 
      } catch (err) {
        let errorMessage = "Error al cargar exámenes";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }
    cargarExamenes()
  }, [searchTerm, refreshTrigger]) 


  const openModalAgregar = () => setIsModalAgregarOpen(true);
  const closeModalAgregar = () => setIsModalAgregarOpen(false);

  const handleSaveExamen = async (data: CrearExamenRequest) => {
    setIsSubmitting(true)
    try {
      await crearExamen(data)
      closeModalAgregar()
      setRefreshTrigger(prev => prev + 1)
      setSuccessMessage({
        title: "¡Éxito!",
        message: "El examen ha sido creado correctamente."
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al crear el examen:", error)
      let errorMessage = "Ocurrió un error desconocido";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setSuccessMessage({
        title: "Error",
        message: `No se pudo crear el examen: ${errorMessage}`
      });
      setShowSuccessModal(true);
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- NUEVO ---
  // 5. Lógica del modal "Editar"
  const openModalEditar = (examen: ExamenEnLista) => {
    setExamenAEditar(examen); // Guardamos el examen a editar
    setIsModalEditarOpen(true); // Abrimos el modal
  };

  const closeModalEditar = () => {
    setIsModalEditarOpen(false);
    setExamenAEditar(null); // Limpiamos el estado al cerrar
  };

  const handleSuccessUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
    setSuccessMessage({
      title: "¡Éxito!",
      message: "El examen ha sido actualizado correctamente."
    });
    setShowSuccessModal(true);
  };

  const handleDelete = (examen: ExamenEnLista) => {
    setConfirmAction(() => () => {
      // Aquí iría la lógica de eliminación
      console.log("Eliminar examen:", examen.id_examen);
      // TODO: Llamar al servicio de eliminar examen
      setSuccessMessage({
        title: "Eliminado",
        message: "El examen ha sido eliminado correctamente."
      });
      setShowSuccessModal(true);
      setRefreshTrigger(prev => prev + 1);
    });
    setShowConfirmModal(true);
  }
  
  // Lógica de paginación (sin cambios)
  const totalExamenes = examenes.length;
  const totalPages = Math.ceil(totalExamenes / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentExamenes = examenes.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="p-6 border-b border-slate-200">
           <div className="flex items-center justify-between">
              {/* ... (título) ... */}
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
                // --- CAMBIO ---
                onClick={openModalAgregar} // 7. onClick actualizado
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Examen</span>
              </button>
            </div>
        </div>
        {/* ... (Barra de búsqueda y paginación sin cambios) ... */}
        <div className="p-6">
           <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
             <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                  <input
                    placeholder="Buscar por título..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2.5 pl-10 pr-4 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
              <div className="flex items-center px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-200">
                <span className="font-medium text-slate-700">{totalExamenes}</span>
                <span className="ml-1 text-slate-500">exámenes</span>
              </div>
            </div>
        </div>
      </div>

      {/* Content (Tabla) */}
      <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-slate-50 border-slate-200">
               {/* ... (thead sin cambios) ... */}
               <tr>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">ID</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Titulo</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Curso</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">N° Preguntas</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-8 h-8 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                      <p className="text-slate-600">Cargando exámenes...</p>
                    </div>
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 rounded-full bg-red-50">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-red-900">Error al cargar los exámenes</p>
                        <p className="mt-1 text-sm text-red-600">{error}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && !error && examenes.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 rounded-full bg-slate-100">
                        <Search className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">No se encontraron exámenes</p>
                        <p className="mt-1 text-sm text-slate-500">Intenta con otros términos de búsqueda</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              
              {!loading && !error &&
                currentExamenes.map((item) => ( 
                  <tr key={item.id_examen} className="transition-colors hover:bg-slate-50">
                    {/* (Columnas de datos sin cambios) */}
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm font-medium text-slate-900 line-clamp-2">{item.id_examen}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm font-medium text-slate-900 line-clamp-2">{item.titulo}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-slate-600 line-clamp-2">{item.curso.titulo}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm font-medium text-center text-slate-700">{item.total_preguntas}</p>
                      </div>
                    </td>
                    
                    {/* --- CAMBIO --- */}
                    {/* 8. Botones de acción conectados */}
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
                          onClick={() => openModalEditar(item)} // 9. Conectado
                          title="Editar elemento"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 transition-colors rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(item)}
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
        
        {/* Paginación (sin cambios) */}
        {!loading && totalExamenes > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
            {/* ... (lógica de paginación) ... */}
            <div className="text-sm text-slate-600">
               Mostrando <span className="font-medium">{startIndex + 1}</span> a{" "}
               <span className="font-medium">{Math.min(endIndex, totalExamenes)}</span> de{" "}
               <span className="font-medium">{totalExamenes}</span> exámenes
             </div>
             <div className="flex items-center gap-2">
               <button
                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                 disabled={currentPage === 1}
                 className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Anterior
               </button>
               <div className="flex items-center gap-1">
                 {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                   <button
                     key={page}
                     onClick={() => setCurrentPage(page)}
                     className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                       currentPage === page
                         ? "bg-[#132436] text-white"
                         : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                     }`}
                   >
                     {page}
                   </button>
                 ))}
               </div>
               <button
                 onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                 disabled={currentPage === totalPages}
                 className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Siguiente
               </button>
             </div>
          </div>
        )}
      </div>
      
      <ModalAgregarExamen
        open={isModalAgregarOpen}
        onClose={closeModalAgregar}
        onSave={handleSaveExamen}
        loading={isSubmitting}
        cursos={cursos}
      />
      
      <ModalEditarExamen
        open={isModalEditarOpen}
        onClose={closeModalEditar}
        onSuccess={handleSuccessUpdate}
        cursos={cursos}
        examenParaEditar={examenAEditar}
      />

      <ConfirmModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => confirmAction && confirmAction()}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este examen? Esta acción no se puede deshacer."
        type="danger"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  )
}