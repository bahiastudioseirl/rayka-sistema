import { Edit, Plus, Search, Trash2, AlertCircle, ClipboardCheck, FileSpreadsheet } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import type { CapacitacionConDetalles, Usuario, Curso, CrearCapacitacionRequest, CrearCapacitacionResponse } from "../schemas/CapacitacionSchema";
import type { Solicitante } from "../../solicitanteAdmin/schemas/SolicitanteSchema";
import { obtenerCapacitaciones } from "../services/obtenerCapacitaciones";
import { obtenerUsuarios } from "../services/obtenerUsuarios";
import { obtenerCursos } from "../services/obtenerCursos";
import { crearCapacitacion } from "../services/crearCapacitacion";
import { obtenerSolicitantes } from "../../solicitanteAdmin/services/obtenerSolicitantes";
import ModalAgregar from "../components/ModalAgregar";
import ModalEditar from "../components/ModalEditar";

export default function CapacitacionAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingModal, setSavingModal] = useState(false);
  
  // Modal de edición
  const [editOpen, setEditOpen] = useState(false);
  const [capacitacionSel, setCapacitacionSel] = useState<CapacitacionConDetalles | null>(null);

  // Data states
  const [capacitaciones, setCapacitaciones] = useState<CapacitacionConDetalles[]>([]);
  const [solicitantes, setSolicitantes] = useState<Solicitante[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError("");
    try {
      const [respCapacitaciones, respSolicitantes, respUsuarios, respCursos] = await Promise.all([
        obtenerCapacitaciones(),
        obtenerSolicitantes(),
        obtenerUsuarios(),
        obtenerCursos(),
      ]);

      setCapacitaciones(respCapacitaciones.data || []);
      setSolicitantes(respSolicitantes.data || []);
      setUsuarios(respUsuarios.data || []);
      // Filtrar solo cursos activos
      setCursos(respCursos.data?.filter(curso => curso.activo) || []);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("No se pudieron cargar los datos. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Función para recargar solo los usuarios (usada cuando se crea un estudiante)
  const recargarUsuarios = async () => {
    try {
      const respUsuarios = await obtenerUsuarios();
      setUsuarios(respUsuarios.data || []);
    } catch (err) {
      console.error("Error recargando usuarios:", err);
    }
  };

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return capacitaciones;
    const term = searchTerm.toLowerCase();
    return capacitaciones.filter((cap) => {
      const solicitanteNombre = `${cap.solicitante.nombre} ${cap.solicitante.apellido}`.toLowerCase();
      return (
        cap.capacitacion.id_capacitacion.toString().includes(term) ||
        solicitanteNombre.includes(term) ||
        cap.capacitacion.duracion_examen_min.toString().includes(term) ||
        cap.capacitacion.max_intentos.toString().includes(term) ||
        cap.resumen.codigo_unico.toLowerCase().includes(term)
      );
    });
  }, [searchTerm, capacitaciones]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Funciones para modal de edición
  const openEdit = (capacitacion: CapacitacionConDetalles) => {
    setCapacitacionSel(capacitacion);
    setEditOpen(true);
  };
  
  const closeEdit = () => {
    setEditOpen(false);
    setCapacitacionSel(null);
  };
  
  const onSaveEdit = async (data: any) => {
    setSavingModal(true);
    try {
      console.log("Guardando edición:", data);
      // TODO: Implementar servicio de actualización
      
      // Recargar datos después de editar
      await cargarDatos();
      closeEdit();
    } catch (err) {
      console.error("Error editando capacitación:", err);
      alert("Error al editar la capacitación");
    } finally {
      setSavingModal(false);
    }
  };

  const handleSaveNuevo = async (data: CrearCapacitacionRequest) => {
    setSavingModal(true);
    try {
      const response: CrearCapacitacionResponse = await crearCapacitacion(data);
      console.log("Capacitación creada:", response);

      // Reload data after creating
      await cargarDatos();

      closeModal();
    } catch (err) {
      console.error("Error creando capacitación:", err);
      alert("Error al crear la capacitación");
    } finally {
      setSavingModal(false);
    }
  };

  const handleEdit = (id: number) => {
    const capacitacion = capacitaciones.find(cap => cap.capacitacion.id_capacitacion === id);
    if (capacitacion) {
      openEdit(capacitacion);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta capacitación?")) {
      console.log("Eliminar capacitación:", id);
      // TODO: Implement delete service
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-red-50">
                <ClipboardCheck className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Gestión de Capacitaciones</h1>
                <p className="mt-1 text-slate-600">Administra las capacitaciones del sistema Rayka Academia</p>
              </div>
            </div>
            <div className="flex items-center gap-3">

              <button
                className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-[#132436] rounded-lg shadow-sm hover:bg-[#224666]"
                onClick={openModal}
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Capacitación</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                <input
                  placeholder="Buscar por solicitante, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-200">
              <span className="font-medium text-slate-700">{filteredData.length}</span>
              <span className="ml-1 text-slate-500">capacitaciones</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-slate-50 border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">ID</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Solicitante</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Duración (min)</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Intentos</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Estudiantes</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Cursos</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Estado</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Link</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading && (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-8 h-8 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                      <p className="text-slate-600">Cargando capacitaciones...</p>
                    </div>
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 rounded-full bg-red-50">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-red-900">Error al cargar las capacitaciones</p>
                        <p className="mt-1 text-sm text-red-600">{error}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && !error && paginatedData.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 rounded-full bg-slate-100">
                        <Search className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">No se encontraron capacitaciones</p>
                        <p className="mt-1 text-sm text-slate-500">Intenta con otros términos de búsqueda</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              {!loading &&
                paginatedData.map((item) => {
                  const numEstudiantes = item.resumen.total_estudiantes;
                  const numCursos = item.resumen.total_cursos;

                  return (
                    <tr key={item.capacitacion.id_capacitacion} className="transition-colors hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">#{item.capacitacion.id_capacitacion}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm font-medium text-slate-900">
                            {`${item.solicitante.nombre} ${item.solicitante.apellido}`}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{item.capacitacion.duracion_examen_min} min</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{item.capacitacion.max_intentos}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {numEstudiantes} estudiantes
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {numCursos} cursos
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${item.capacitacion.estado === 'activa'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {item.capacitacion.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-sm">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800 break-all">
                              http://localhost:5173/login/{item.resumen.codigo_unico}
                            </code>
                            <button
                              onClick={() => navigator.clipboard.writeText(`http://localhost:5173/login/${item.resumen.codigo_unico}`)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Copiar link"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <button
                            className="p-2 transition-colors rounded-lg text-slate-400 hover:text-green-600 hover:bg-blue-50"
                            title="Exportar detalle"
                          >
                            <FileSpreadsheet className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 transition-colors rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                            onClick={() => handleEdit(item.capacitacion.id_capacitacion)}
                            title="Editar capacitación"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 transition-colors rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(item.capacitacion.id_capacitacion)}
                            title="Eliminar capacitación"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} resultados
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-3 py-1.5 text-sm text-slate-700">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>


      {/* Modal */}
      <ModalAgregar
        open={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveNuevo}
        loading={savingModal}
        solicitantes={solicitantes}
        usuarios={usuarios}
        cursos={cursos}
        onUsuarioCreado={recargarUsuarios}
      />

      {/* Modal Editar */}
      <ModalEditar
        open={editOpen}
        capacitacion={capacitacionSel}
        onClose={closeEdit}
        onSave={onSaveEdit}
        loading={savingModal}
        solicitantes={solicitantes}
        usuarios={usuarios}
        cursos={cursos}
      />
    </div>
  );
}
