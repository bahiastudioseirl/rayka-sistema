import { Edit, Plus, Search, AlertCircle, UserPlus } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import type { Solicitante, CrearSolicitanteRequest } from "../schemas/SolicitanteSchema"
import type { Empresa } from "../../empresaAdmin/schemas/EmpresaSchema"
import ModalAgregar from "../components/ModalAgregar"
import ModalEditar from "../components/ModalEditar"
import { crearSolicitante } from "../services/crearSolicitante"
import { obtenerSolicitantes } from "../services/obtenerSolicitantes"
import { actualizarSolicitante } from "../services/actualizarSolicitante"
import { obtenerEmpresas } from "../../empresaAdmin/services/obtenerEmpresas"

export default function SolicitanteAdmin() {
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)
  const [error, setError] = useState("")
  const [isModalAgregarOpen, setIsModalAgregarOpen] = useState(false)
  const [isModalEditarOpen, setIsModalEditarOpen] = useState(false)
  const [solicitantes, setSolicitantes] = useState<Solicitante[]>([])
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [solicitanteSeleccionado, setSolicitanteSeleccionado] = useState<Solicitante | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Cargar datos al montar
  useEffect(() => {
    cargarDatos()
  }, [])

  // Reset página cuando busca
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const cargarDatos = async () => {
    setLoading(true)
    setError("")
    try {
      const [resSolicitantes, resEmpresas] = await Promise.all([
        obtenerSolicitantes(),
        obtenerEmpresas()
      ])
      
      // Crear un mapa de empresas para búsqueda rápida
      const empresasMap = new Map(resEmpresas.data.map(emp => [emp.id_empresa, emp]))
      
      // Enriquecer solicitantes con información de empresa
      const solicitantesConEmpresa = resSolicitantes.data.map(sol => ({
        ...sol,
        empresa: empresasMap.get(sol.empresa_id) || null
      }))
      
      // Ordenar por ID ascendente (1, 2, 3...)
      const solicitantesOrdenados = solicitantesConEmpresa.sort((a, b) => a.id_solicitante - b.id_solicitante)
      
      setSolicitantes(solicitantesOrdenados)
      setEmpresas(resEmpresas.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los datos")
    } finally {
      setLoading(false)
    }
  }

  const filteredData = useMemo(() => {
    return solicitantes.filter(
      (sol) =>
        sol.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sol.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sol.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sol.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sol.empresa?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [solicitantes, searchTerm])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, currentPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleSaveNuevo = async (data: CrearSolicitanteRequest) => {
    setLoadingSave(true)
    try {
      const response = await crearSolicitante(data)
      setSolicitantes((prev) => [...prev, response.data.solicitante])
      setIsModalAgregarOpen(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al crear solicitante")
    } finally {
      setLoadingSave(false)
    }
  }

  const handleSaveEditar = async (id: number, data: CrearSolicitanteRequest) => {
    setLoadingSave(true)
    try {
      const response = await actualizarSolicitante(id, data)
      setSolicitantes((prev) => {
        const nuevosSelicitantes = prev.map((sol) =>
          sol.id_solicitante === id ? response.data.solicitante : sol
        )
        return nuevosSelicitantes
      })
      
      setIsModalEditarOpen(false)
      setSolicitanteSeleccionado(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al actualizar solicitante")
    } finally {
      setLoadingSave(false)
    }
  }

  const handleEdit = (solicitante: Solicitante) => {
    setSolicitanteSeleccionado(solicitante)
    setIsModalEditarOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-red-50">
                <UserPlus className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Gestión de Solicitantes</h1>
                <p className="mt-1 text-slate-600">Administra los solicitantes del sistema Rayka Academia</p>
              </div>
            </div>
            <button
              className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-[#132436] rounded-lg shadow-sm hover:bg-[#224666]"
              onClick={() => setIsModalAgregarOpen(true)}
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo solicitante</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                <input
                  placeholder="Buscar por nombre, correo, cargo, empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-200">
              <span className="font-medium text-slate-700">{filteredData.length}</span>
              <span className="ml-1 text-slate-500">solicitantes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-slate-50 border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">ID</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Nombre Completo</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Cargo</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Correo</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Teléfono</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Empresa</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-8 h-8 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                      <p className="text-slate-600">Cargando solicitantes...</p>
                    </div>
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 rounded-full bg-red-50">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-red-900">Error al cargar los solicitantes</p>
                        <p className="mt-1 text-sm text-red-600">{error}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && !error && filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 rounded-full bg-slate-100">
                        <Search className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">No se encontraron solicitantes</p>
                        <p className="mt-1 text-sm text-slate-500">Intenta con otros términos de búsqueda</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && !error &&
                paginatedData.map((solicitante) => (
                  <tr key={solicitante.id_solicitante} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">#{solicitante.id_solicitante}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{solicitante.nombre} {solicitante.apellido}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{solicitante.cargo}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">{solicitante.correo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{solicitante.telefono}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{solicitante.empresa?.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <button
                          className="p-2 transition-colors rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                          onClick={() => handleEdit(solicitante)}
                          title="Editar solicitante"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {!loading && !error && filteredData.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} solicitantes
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 text-sm rounded-lg ${
                    currentPage === page
                      ? "bg-[#132436] text-white"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      <ModalAgregar
        open={isModalAgregarOpen}
        onClose={() => setIsModalAgregarOpen(false)}
        onSave={handleSaveNuevo}
        loading={loadingSave}
        empresas={empresas}
      />

      <ModalEditar
        open={isModalEditarOpen}
        solicitante={solicitanteSeleccionado}
        onClose={() => {
          setIsModalEditarOpen(false)
          setSolicitanteSeleccionado(null)
        }}
        onSave={handleSaveEditar}
        loading={loadingSave}
        empresas={empresas}
      />
    </div>
  )
}
