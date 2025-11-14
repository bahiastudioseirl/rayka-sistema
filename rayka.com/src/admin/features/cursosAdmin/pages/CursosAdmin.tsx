import { Edit, Plus, Search, Power, Eye, FileText, Link, Video, Book } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ModalAgregar from "../components/ModalAgregar";
import ModalEditar from "../components/ModalEditar";
import { crearCurso } from "../services/crearCurso";
import { obtenerCursos } from "../services/obtenerCursos";
import { actualizarCurso } from "../services/actualizarCurso";
import { cambiarEstadoCurso } from "../services/estadoCurso";
import type { CrearCursoRequest, Curso, ActualizarCursoRequest } from "../schemas/CursoSchema";
import { API_CONFIG } from "../../../../config/api.config";

export default function CursosAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cursoEditar, setCursoEditar] = useState<Curso | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const openModal = () => setIsModalOpen(true);

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await obtenerCursos();
      const cursosOrdenados = response.data.sort((a, b) => a.id_curso - b.id_curso);
      setCursos(cursosOrdenados);
    } catch (err: any) {
      console.error("❌ Error al cargar cursos:", err);
      console.error("Response data:", err?.response?.data);
      const msg = err?.response?.data?.message || "Error al cargar los cursos";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(
    () => {
      const filtered = cursos.filter(
        (curso) =>
          curso.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return filtered;
    },
    [cursos, searchTerm]
  );

  // Calcular datos paginados
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Resetear a página 1 cuando cambia el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);


  const handleSaveCurso = async (data: CrearCursoRequest) => {
    setSaving(true);
    setError("");
    try {
      const response = await crearCurso(data);
      if (response.success) {
        setCursos((prev) => {
          const nuevaLista = [...prev, response.data.curso].sort((a, b) => a.id_curso - b.id_curso);
          return nuevaLista;
        });
        setIsModalOpen(false);
      }
    } catch (err: any) {
      console.error("❌ Error al crear curso:", err);
      console.error("Response data:", err?.response?.data);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "No se pudo crear el curso.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (curso: Curso) => {
    setCursoEditar(curso);
    setIsEditModalOpen(true);
  };

  const handleUpdateCurso = async (
    id: number,
    data: ActualizarCursoRequest
  ) => {
    setSaving(true);
    setError("");
    try {
      const response = await actualizarCurso(id, data);
      if (response.success) {
        setCursos((prev) =>
          prev.map((c) => {
            if (c.id_curso === id) {
              return response.data.curso;
            }
            return c;
          })
        );
        setIsEditModalOpen(false);
        setCursoEditar(null);
      }
    } catch (err: any) {
      console.error("❌ Error al actualizar curso:", err);
      console.error("Response data:", err?.response?.data);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "No se pudo actualizar el curso.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEstado = async (id: number) => {
    try {
      const response = await cambiarEstadoCurso(id);
      setCursos((prev) => {
        const nuevaLista = prev.map((c) => {
          if (c.id_curso === id) {
            return response.data;
          }
          return c;
        });
        return nuevaLista;
      });
    } catch (err: any) {
      console.error("❌ Error al cambiar estado:", err);
      console.error("❌ Error response:", err?.response);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo cambiar el estado.";
      setError(msg);
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
                <Book className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Gestión de Cursos</h1>
                <p className="mt-1 text-slate-600">Administra los elementos del sistema Rayka Academia</p>
              </div>
            </div>
            <button
              className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-[#132436] rounded-lg shadow-sm hover:bg-[#224666]"
              onClick={openModal}
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo curso</span>
            </button>
          </div>
        </div>

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
              <span className="font-medium text-slate-700">{filteredData.length}</span>
              <span className="ml-1 text-slate-500">cursos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Errores globales */}
      {error && !loading && (
        <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white border shadow-sm rounded-xl border-slate-200">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-sm text-slate-600">Cargando cursos...</p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-slate-50 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">ID</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Fecha</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Título</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Descripción</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Imagen</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Video</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Estado</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <FileText className="w-12 h-12 mb-3" />
                        <p className="text-sm font-medium">No se encontraron cursos</p>
                        <p className="text-xs mt-1">
                          {searchTerm ? "Intenta con otro término de búsqueda" : "Agrega tu primer curso"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((curso) => (
                    <tr key={curso.id_curso} className="transition-colors hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{curso.id_curso}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-600">
                          {new Date(curso.fecha_creacion).toLocaleDateString('es-PE', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm font-medium text-slate-900 line-clamp-2">{curso.titulo}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm font-medium text-slate-900 line-clamp-2">{curso.descripcion}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          {curso.url_imagen ? (
                            <img
                              src={API_CONFIG.getFullUrl(curso.url_imagen)}
                              alt={"Imagen del curso"}
                              className="h-16 w-16 object-cover rounded-md shadow-sm border border-slate-200"
                            />
                          ) : (
                            <p className="text-sm text-slate-400 italic">Sin imagen</p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {curso.tipo_contenido === 'link' ? (
                            <>
                              <div className="p-1.5 rounded bg-blue-50">
                                <Link className="w-4 h-4 text-blue-600" />
                              </div>
                              <a
                                href={curso.contenido}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline max-w-xs truncate"
                              >
                                {curso.contenido}
                              </a>
                            </>
                          ) : (
                            <>
                              <div className="p-1.5 rounded bg-emerald-50">
                                <Video className="w-4 h-4 text-emerald-600" />
                              </div>
                              <span className="text-sm text-slate-600">Archivo subido</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {curso.activo ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <button
                            className="p-2 transition-colors rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            title="Ver curso"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 transition-colors rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                            title="Editar curso"
                            onClick={() => handleEditClick(curso)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className={`p-2 transition-colors rounded-lg ${curso.activo
                                ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                              }`}
                            title={curso.activo ? "Desactivar curso" : "Activar curso"}
                            onClick={() => handleToggleEstado(curso.id_curso)}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {filteredData.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
              <div className="text-sm text-slate-600">
                Mostrando <span className="font-medium">{startIndex + 1}</span> a{" "}
                <span className="font-medium">{Math.min(endIndex, filteredData.length)}</span> de{" "}
                <span className="font-medium">{filteredData.length}</span> cursos
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
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg ${currentPage === page
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
      )}

      {/* Modal Agregar */}
      <ModalAgregar
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCurso}
        loading={saving}
      />

      {/* Modal Editar */}
      <ModalEditar
        open={isEditModalOpen}
        curso={cursoEditar}
        onClose={() => {
          setIsEditModalOpen(false);
          setCursoEditar(null);
        }}
        onSave={(data) => cursoEditar ? handleUpdateCurso(cursoEditar.id_curso, data) : Promise.resolve()}
        loading={saving}
      />
    </div>
  );
}
