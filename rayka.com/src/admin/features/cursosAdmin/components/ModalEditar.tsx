import { Link, Upload, X, Image as ImageIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Curso, TipoContenido } from "../schemas/CursoSchema";
import { API_CONFIG } from "../../../../config/api.config";

type Props = {
  open: boolean;
  curso: Curso | null;
  onClose: () => void;
  onSave: (data: {
    titulo: string;
    tipo_contenido: TipoContenido;
    contenido?: string;
    archivo?: File;
    descripcion: string;
    url_imagen?: File;
  }) => Promise<void>;
  loading?: boolean;
};

export default function ModalEditar({ open, curso, onClose, onSave, loading }: Props) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoContenido, setTipoContenido] = useState<TipoContenido>("link");
  const [contenidoLink, setContenidoLink] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagenInputRef = useRef<HTMLInputElement>(null);

  // URL de preview para la imagen seleccionada
  const imagenPreview = useMemo(() => {
    if (imagenArchivo) return URL.createObjectURL(imagenArchivo);
    // Si no hay nuevo archivo, usa la imagen actual del curso (si existe)
    return curso?.url_imagen ? API_CONFIG.getFullUrl(curso.url_imagen) : "";
  }, [imagenArchivo, curso?.url_imagen]);

  // Limpieza de object URL
  useEffect(() => {
    return () => {
      if (imagenPreview?.startsWith("blob:")) URL.revokeObjectURL(imagenPreview);
    };
  }, [imagenPreview]);

  useEffect(() => {
    if (open && curso) {
      setTitulo(curso.titulo);
      setDescripcion(curso.descripcion ?? "");
      setTipoContenido(curso.tipo_contenido);
      if (curso.tipo_contenido === "link") {
        setContenidoLink(curso.contenido ?? "");
      } else {
        setContenidoLink("");
      }
      setArchivo(null);
      setImagenArchivo(null); // no pre-cargamos File, solo mostramos preview de url_imagen
      setError("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open, curso]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && open && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  // Video
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

  // Imagen
  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP)");
        return;
      }
      setImagenArchivo(file);
      setError("");
    }
  };

  const handleSave = async () => {
    const tituloValue = titulo.trim();
    const descripcionValue = descripcion.trim();

    if (!tituloValue) {
      setError("Ingresa el título del curso.");
      return;
    }

    if (!descripcionValue) {
      setError("Ingresa la descripción del curso.");
      return;
    }

    if (!curso) return;

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
        url_imagen: imagenArchivo || undefined, // solo enviamos si el usuario reemplazó
      });
    } else {
      // carga_archivo
      if (!archivo) {
        setError("Selecciona un archivo de video.");
        return;
      }
      await onSave({
        titulo: tituloValue,
        tipo_contenido: "carga_archivo",
        archivo,
        descripcion: descripcionValue,
        url_imagen: imagenArchivo || undefined,
      });
    }
  };

  if (!open || !curso) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative z-[61] w-full max-w-lg mx-4 rounded-xl bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">Editar Curso</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con scroll por si se alarga */}
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

          {/* Descripción */}
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
                    {archivo ? "Cambiar video" : "Seleccionar nuevo video"}
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

          {/* Imagen (thumbnail) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Imagen del curso (Thumbnail)
            </label>

            {/* Preview */}
            {(imagenPreview || imagenArchivo) && (
              <div className="flex items-center gap-3">
                {imagenPreview ? (
                  <img
                    src={imagenPreview}
                    alt="Thumbnail del curso"
                    className="h-20 w-20 rounded-md object-cover border border-slate-200"
                  />
                ) : null}
                <button
                  type="button"
                  onClick={() => imagenInputRef.current?.click()}
                  className="px-3 py-2 rounded-md border text-sm border-slate-300 hover:bg-blue-50 hover:border-blue-400"
                >
                  Reemplazar imagen
                </button>
                {imagenArchivo && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagenArchivo(null);
                      if (imagenInputRef.current) imagenInputRef.current.value = "";
                    }}
                    className="px-3 py-2 rounded-md border text-sm border-slate-300 hover:bg-slate-50"
                  >
                    Quitar cambio
                  </button>
                )}
              </div>
            )}

            {/* Botón para seleccionar si no hay preview aún */}
            {!imagenPreview && (
              <div className="flex items-center gap-3 mt-2">
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
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Seleccionar imagen
                  </span>
                </button>
              </div>
            )}

            {/* Si seleccionaste una nueva imagen, muestra info */}
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
                    if (imagenInputRef.current) imagenInputRef.current.value = "";
                  }}
                  className="p-1 rounded hover:bg-blue-100 text-blue-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Input real (oculto) */}
            <input
              ref={imagenInputRef}
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              className="hidden"
            />
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
            {loading ? "Actualizando..." : "Actualizar Curso"}
          </button>
        </div>
      </div>
    </div>
  );
}
