import { Edit, Plus, Search, Power, KeySquare, AlertCircle, FileText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ModalAgregar from "../components/ModalAgregar";
import ModalEditarAdministrador from "../components/ModalEditar";
import { crearAdministrador } from "../services/crearAdministrador";
import { obtenerAdministradores } from "../services/obtenerAdministrador";
import { actualizarAdministrador } from "../services/actualizarAdministrador";
import { cambiarContrasenia } from "../services/cambiarContrasenia";
import type { CambiarContraseniaRequest, ActualizarAdministradorRequest, Administrador } from "../schemas/AdministradorSchema";
import { cambiarEstadoAdministrador } from "../services/estadoEstudiante";
import ModalCambiarContrasenia from "../components/ModalCambiarContrasenia";

type SavePayload = { nombre: string; apellido: string; num_documento: string; correo: string; contrasenia: string };

export default function AdministradorAdmin() {
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Modal Cambiar Contraseña
    const [pwdOpen, setPwdOpen] = useState(false);
    const [pwdSaving, setPwdSaving] = useState(false);
    const [pwdUserId, setPwdUserId] = useState<number | null>(null);

    const [administradores, setAdministradores] = useState<Administrador[]>([]);

    // Estados de edición
    const [editOpen, setEditOpen] = useState(false);
    const [administradorSel, setAdministradorSel] = useState<Administrador | null>(null);

    // Carga inicial
    useEffect(() => {
        (async () => {
            setLoading(true);
            setError("");
            try {
                const res = await obtenerAdministradores(); // { message, data }
                setAdministradores(res.data);
            } catch (e: any) {
                setError(e?.response?.data?.message ?? "No se pudo cargar administradores.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Filtro por nombre, apellido o documento
    const filteredData = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return administradores;
        return administradores.filter((s) =>
            [s.nombre, s.apellido, s.num_documento, s.correo].some((v) => (v ?? "").toLowerCase().includes(q))
        );
    }, [searchTerm, administradores]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const openEdit = (s: Administrador) => { setAdministradorSel(s); setEditOpen(true); };
    const closeEdit = () => setEditOpen(false);

    const handleSave = async ({ nombre, apellido, num_documento, correo, contrasenia }: SavePayload) => {
        setLoadingCreate(true);
        setError("");
        try {
            const res = await crearAdministrador({
                nombre,
                apellido,
                num_documento,
                correo,
                contrasenia,
                id_rol: 1,
            });
            setAdministradores((prev) => [res.data, ...prev]);
            closeModal();
        } catch (e: any) {
            setError(e?.response?.data?.message ?? "No se pudo crear el estudiante.");
        } finally {
            setLoadingCreate(false);
        }
    };

    const onSaveEdit = async (id: number, payload: ActualizarAdministradorRequest) => {
        setLoading(true);
        setError("");
        try {
            const res = await actualizarAdministrador(id, payload); 
            const updated = res.data;
            setAdministradores(prev =>
                prev.map(e => e.id_usuario === id ? updated : e)
            );
            closeEdit();
        } catch (e: any) {
            setError(e?.response?.data?.message ?? "No se pudo actualizar el administrador.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleEstado = async (id: number) => {
        try {
            const response = await cambiarEstadoAdministrador(id);
            setAdministradores((prev) => {
                const nuevaLista = prev.map((c) => {
                    if (c.id_usuario === id) {
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
    const openPwd = (s: Administrador) => {
        setPwdUserId(s.id_usuario);
        setPwdOpen(true);
    };

    const closePwd = () => {
        setPwdOpen(false);
        setPwdUserId(null);
    };

    const onSavePwd = async (payload: CambiarContraseniaRequest) => {
        if (!pwdUserId) return;
        setPwdSaving(true);
        setError("");
        try {
            await cambiarContrasenia(pwdUserId, payload);

            closePwd();
        } catch (e: any) {
            setError(e?.response?.data?.message ?? "No se pudo cambiar la contraseña.");
        } finally {
            setPwdSaving(false);
        }
    };


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white border shadow-sm rounded-xl border-slate-200">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-blue-50">
                                <FileText className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Gestión de Administradores</h1>
                                <p className="mt-1 text-slate-600">Administra los estudiantes de Rayka Academia</p>
                            </div>
                        </div>
                        <button
                            className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-[#132436] rounded-lg shadow-sm hover:bg-[#224666]"
                            onClick={openModal}
                        >
                            <Plus className="w-4 h-4" />
                            <span>Nuevo Administrador</span>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                                <input
                                    placeholder="Buscar por nombre, apellido o documento..."
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

            {/* Content */}
            <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b bg-slate-50 border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Fecha</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Nombre</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Apellido</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Documento</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Correo</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Estado</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading && (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <div className="w-8 h-8 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                            <p className="text-slate-600">Cargando estudiantes...</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {error && !loading && (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <div className="p-3 rounded-full bg-red-50">
                                                <AlertCircle className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-red-900">Error al cargar</p>
                                                <p className="mt-1 text-sm text-red-600">{error}</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!loading && !error && filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <div className="p-3 rounded-full bg-slate-100">
                                                <Search className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-700">No se encontraron estudiantes</p>
                                                <p className="mt-1 text-sm text-slate-500">Intenta con otros términos</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!loading && !error && filteredData.map((s) => (
                                <tr key={s.id_usuario} className="transition-colors hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900">
                                            {new Date(s.fecha_creacion).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-slate-900">{s.nombre}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-slate-900">{s.apellido}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-slate-900">{s.num_documento}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-slate-900">{s.correo}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${s.activo
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {s.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                                title="Cambiar contraseña"
                                                onClick={() => openPwd(s)} // ⬅️ abre modal
                                            >
                                                <KeySquare className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                                onClick={() => openEdit(s)}
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                className={`p-2 transition-colors rounded-lg ${s.activo
                                                    ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                                    }`}
                                                title={s.activo ? "Desactivar estudiante" : "Activar estudiante"}
                                                onClick={() => handleToggleEstado(s.id_usuario)}
                                            >
                                                <Power className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Crear */}
            <ModalAgregar open={isModalOpen} onClose={closeModal} onSave={handleSave} loading={loadingCreate} />

            {/* Modal Editar */}
            <ModalEditarAdministrador
                open={editOpen}
                administrador={administradorSel}
                onClose={closeEdit}
                onSave={onSaveEdit}
                loading={loading}
            />
             {/* Modal Cambiar Contraseña */}
                  <ModalCambiarContrasenia
                    open={pwdOpen}
                    onClose={closePwd}
                    onSave={onSavePwd}
                    loading={pwdSaving}
                  />
        </div>
    );
}
