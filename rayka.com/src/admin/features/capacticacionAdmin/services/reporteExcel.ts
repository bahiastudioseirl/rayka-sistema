import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

export interface ReporteExcelResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    download_url: string;
  };
}

/**
 * Genera y descarga el reporte Excel de una capacitación
 * @param idCapacitacion - ID de la capacitación
 * @returns Promise con la respuesta del servidor
 */
export const generarReporteExcel = async (idCapacitacion: number): Promise<ReporteExcelResponse> => {
  const response = await axiosWithoutMultipart.get<ReporteExcelResponse>(
    `reportes/capacitaciones/${idCapacitacion}/excel`
  );
  return response.data;
};

/**
 * Descarga un archivo desde una URL
 * @param url - URL del archivo a descargar
 * @param filename - Nombre del archivo
 */
export const descargarArchivo = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};