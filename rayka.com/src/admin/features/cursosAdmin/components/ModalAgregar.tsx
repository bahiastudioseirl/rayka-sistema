import { Link, Upload, X, Image } from "lucide-react"; // Queda igual
import { useEffect, useRef, useState } from "react";
import type { TipoContenido } from "../schemas/CursoSchema";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    titulo: string;
    tipo_contenido: TipoContenido;
    contenido?: string;
    archivo?: File;
    descripcion: string; // Ya no es opcional
    url_imagen?: File;
  }) => Promise<void> | void;
  loading?: boolean;
};

export default function ModalAgregar({ open, onClose, onSave, loading }: Props) {
  // Todos los estados quedan igual
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoContenido, setTipoContenido] = useState<TipoContenido>("link");
  const [contenidoLink, setContenidoLink] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  // Todos los refs quedan igual
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagenInputRef = useRef<HTMLInputElement>(null);

  // El useEffect de 'open' queda igual
  useEffect(() => {
    if (open) {
      setTitulo("");
      setDescripcion("");
      setTipoContenido("link");
      setContenidoLink("");
      setArchivo(null);
      setImagenArchivo(null);
      setError("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // El useEffect de 'onEsc' queda igual
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && open && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  // handleFileChange (video) queda igual
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        setError("Por favor selecciona un archivo de video válido");
        return;
      }
      setArchivo(file);
      setError("");
    }
  };

  // handleImagenChange (imagen) queda igual
  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError(
          "Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP)"
        );
        return;
      }
      setImagenArchivo(file);
      setError("");
    }
  };

  // handleSave se MODIFICA
  const handleSave = async () => {
    const tituloValue = titulo.trim();
    if (!tituloValue) {
      setError("Ingresa el título del curso.");
      return;
    }

    const descripcionValue = descripcion.trim();
    // 'imagenArchivo' es el estado interno que contiene el File

    if (tipoContenido === "link") {
      const linkValue = contenidoLink.trim();
      if (!linkValue) {
        setError("Ingresa el link del video.");
        return;
      }
      try {
        new URL(linkValue);
      } catch {
        setError("Ingresa una URL válida.");
        return;
      }
      
      await onSave({
        titulo: tituloValue,
        tipo_contenido: "link",
        contenido: linkValue,
        descripcion: descripcionValue,
        url_imagen: imagenArchivo || undefined, // MODIFICADO: Enviamos el File bajo la key 'url_imagen'
      });
    } else {
      if (!archivo) {
        setError("Selecciona un archivo de video.");
        return;
      }
      
      await onSave({
        titulo: tituloValue,
        tipo_contenido: "carga_archivo",
        archivo,
        descripcion: descripcionValue,
        url_imagen: imagenArchivo || undefined, // MODIFICADO: Enviamos el File bajo la key 'url_imagen'
      });
    }
  };

  if (!open) return null;

  return (
    // Todo el JSX (HTML) es exactamente el mismo que en la respuesta anterior
    // Incluyendo el scroll, el límite de caracteres y el botón de subir imagen.
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative z-[61] w-full max-w-lg mx-4 rounded-xl bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">Nuevo Curso</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenedor del contenido con scroll */}
        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Título del curso
            </label>
            <input
              ref={inputRef}
              type="text"
              value={titulo}
              onChange={(e) => {
                setTitulo(e.target.value);
                setError("");
              }}
              placeholder="Ej. Introducción a React"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Descripción (con límite y sin resize) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => {
                setDescripcion(e.target.value);
                setError("");
              }}
              rows={3}
              maxLength={200}
              placeholder="Describe brevemente el contenido del curso..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-slate-500 text-right mt-1">
              {descripcion.length} / 200
            </p>
          </div>

          {/* Tipo de contenido */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de contenido
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setTipoContenido("link");
                  setArchivo(null);
                  setError("");
                }}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  tipoContenido === "link"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                <Link className="w-4 h-4" />
                <span className="text-sm font-medium">Link / URL</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTipoContenido("carga_archivo");
                  setContenidoLink("");
                  setError("");
                }}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  tipoContenido === "carga_archivo"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Subir Video</span>
              </button>
            </div>
          </div>

          {/* Contenido según tipo */}
          {tipoContenido === "link" ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Link del video
              </label>
              <input
                type="url"
                value={contenidoLink}
                onChange={(e) => {
                  setContenidoLink(e.target.value);
                  setError("");
                }}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Archivo de video
              </label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50 transition-all text-slate-600 hover:text-emerald-700"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {archivo ? "Cambiar video" : "Seleccionar video"}
                  </span>
                </button>
              </div>
              {archivo && (
                <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-emerald-900 truncate">
                      {archivo.name}
                    </p>
                    <p className="text-xs text-emerald-600">
                      {(archivo.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setArchivo(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="p-1 rounded hover:bg-emerald-100 text-emerald-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Subida de Imagen (Thumbnail) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Imagen del curso (Thumbnail)
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={imagenInputRef}
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => imagenInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all text-slate-600 hover:text-blue-700"
              >
                <Image className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {imagenArchivo ? "Cambiar imagen" : "Seleccionar imagen"}
                </span>
              </button>
            </div>
            {/* Display para el archivo de imagen seleccionado */}
            {imagenArchivo && (
              <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900 truncate">
                    {imagenArchivo.name}
                  </p>
                  <p className="text-xs text-blue-600">
                    {(imagenArchivo.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImagenArchivo(null);
                    if (imagenInputRef.current)
                      imagenInputRef.current.value = "";
                  }}
                  className="p-1 rounded hover:bg-blue-100 text-blue-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        {/* FIN del div con scroll */}

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
            className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-[#132436] hover:bg-[#224666] disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar Curso"}
          </button>
        </div>
      </div>
    </div>
  );
}