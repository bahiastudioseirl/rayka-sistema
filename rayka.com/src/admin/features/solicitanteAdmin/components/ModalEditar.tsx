import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Solicitante, ActualizarSolicitanteRequest } from "../schemas/SolicitanteSchema";
import type { Empresa } from "../../empresaAdmin/schemas/EmpresaSchema";

type Props = {
    open: boolean;
    solicitante: Solicitante | null;
    onClose: () => void;
    onSave: (id: number, data: ActualizarSolicitanteRequest) => Promise<void>;
    loading?: boolean;
    empresas: Empresa[];
};

export default function ModalEditar({ open, solicitante, onClose, onSave, loading, empresas }: Props) {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [cargo, setCargo] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [idEmpresa, setIdEmpresa] = useState<number | "">("");
    const [error, setError] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open && solicitante) {
            setNombre(solicitante.nombre);
            setApellido(solicitante.apellido);
            setCargo(solicitante.cargo);
            setCorreo(solicitante.correo);
            setTelefono(solicitante.telefono);
            setIdEmpresa(solicitante.empresa?.id_empresa || solicitante.empresa_id);
            setError("");
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [open, solicitante]);

    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => e.key === "Escape" && open && onClose();
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [open, onClose]);

    const handleSave = async () => {
        const nombreValue = nombre.trim();
        const apellidoValue = apellido.trim();
        const cargoValue = cargo.trim();
        const correoValue = correo.trim();
        const telefonoValue = telefono.trim();

        if (!nombreValue) {
            setError("Ingresa el nombre del solicitante.");
            return;
        }
        if (!apellidoValue) {
            setError("Ingresa el apellido del solicitante.");
            return;
        }
        if (!cargoValue) {
            setError("Ingresa el cargo del solicitante.");
            return;
        }
        if (!correoValue) {
            setError("Ingresa el correo del solicitante.");
            return;
        }
        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correoValue)) {
            setError("Ingresa un correo válido.");
            return;
        }
        if (!telefonoValue) {
            setError("Ingresa el teléfono del solicitante.");
            return;
        }
        if (!idEmpresa) {
            setError("Selecciona una empresa.");
            return;
        }
        if (!solicitante) return;

        const cambios: ActualizarSolicitanteRequest = {};
        
        if (nombreValue !== solicitante.nombre) cambios.nombre = nombreValue;
        if (apellidoValue !== solicitante.apellido) cambios.apellido = apellidoValue;
        if (cargoValue !== solicitante.cargo) cambios.cargo = cargoValue;
        if (correoValue !== solicitante.correo) cambios.correo = correoValue;
        if (telefonoValue !== solicitante.telefono) cambios.telefono = telefonoValue;
        if (idEmpresa !== (solicitante.empresa?.id_empresa || solicitante.empresa_id)) {
            cambios.id_empresa = idEmpresa as number;
        }

        // Si no hay cambios, cerrar modal
        if (Object.keys(cambios).length === 0) {
            setError("No se detectaron cambios.");
            return;
        }

        await onSave(solicitante.id_solicitante, cambios as any);
    };

    if (!open || !solicitante) return null;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
                onClick={onClose}
            />
            {/* Modal */}
            <div className="relative z-61 w-full max-w-lg mx-4 rounded-xl bg-white shadow-xl border border-slate-200">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                    <h3 className="text-base font-semibold text-slate-900">Editar Solicitante</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        aria-label="Cerrar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Nombre
                        </label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={nombre}
                            onChange={(e) => {
                                setNombre(e.target.value);
                                setError("");
                            }}
                            placeholder="Ej. Juan"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Apellido */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Apellido
                        </label>
                        <input
                            type="text"
                            value={apellido}
                            onChange={(e) => {
                                setApellido(e.target.value);
                                setError("");
                            }}
                            placeholder="Ej. Corales"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Cargo */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Cargo
                        </label>
                        <input
                            type="text"
                            value={cargo}
                            onChange={(e) => {
                                setCargo(e.target.value);
                                setError("");
                            }}
                            placeholder="Ej. Jefe de Sistemas"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Correo */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => {
                                setCorreo(e.target.value);
                                setError("");
                            }}
                            placeholder="Ej. juan@ejemplo.com"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            value={telefono}
                            onChange={(e) => {
                                setTelefono(e.target.value);
                                setError("");
                            }}
                            placeholder="Ej. 987654321"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Empresa */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Empresa
                        </label>
                        <select
                            value={idEmpresa}
                            onChange={(e) => {
                                setIdEmpresa(e.target.value ? Number(e.target.value) : "");
                                setError("");
                            }}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Selecciona una empresa</option>
                            {empresas.map((empresa) => (
                                <option key={empresa.id_empresa} value={empresa.id_empresa}>
                                    {empresa.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}
                </div>

                <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
                    >
                        {loading ? "Actualizando..." : "Actualizar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
