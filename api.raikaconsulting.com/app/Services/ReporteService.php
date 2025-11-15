<?php

namespace App\Services;

use App\Repositories\CapacitacionRepository;
use Shuchkin\SimpleXLSXGen;
use Exception;

class ReporteService
{
    public function __construct(
        private readonly CapacitacionRepository $capacitacionRepository
    ) {}

    /**
     * Genera un reporte Excel de una capacitación específica
     */
    public function generarReporteCapacitacion(int $idCapacitacion): array
    {
        try {
            $capacitacion = $this->capacitacionRepository->obtenerPorId($idCapacitacion);
            
            if (!$capacitacion) {
                return [
                    'success' => false,
                    'message' => 'Capacitación no encontrada.'
                ];
            }

            // Obtener estudiantes con resultados completos
            $estudiantes = $this->capacitacionRepository->obtenerEstudiantesConResultados($idCapacitacion);
            
            foreach ($estudiantes as &$estudiante) {
                // $estudiante es stdClass object del método obtenerEstudiantesConResultados
                $idUsuario = $estudiante->id_usuario;
                $estudiante->cursos = $this->capacitacionRepository->obtenerDetallesCursosEstudiante(
                    $idCapacitacion, 
                    $idUsuario
                );
            }

            // Preparar datos para Excel
            $data = $this->prepararDatosExcel($capacitacion, $estudiantes);
            
            // Generar Excel
            $filename = $this->generarArchivoExcel($data, $capacitacion);
            
            return [
                'success' => true,
                'message' => 'Reporte generado exitosamente.',
                'data' => [
                    'filename' => $filename,
                    'download_url' => url("storage/reportes/{$filename}")
                ]
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al generar el reporte.',
                'error' => $e->getMessage()
            ];
        }
    }

    private function prepararDatosExcel($capacitacion, $estudiantes): array
    {
        $data = [];
        $linkCompleto = $this->generarLinkCompleto($capacitacion->link_login_unico);
        
        // TÍTULO PRINCIPAL
        $data[] = [
            '<style bgcolor="#000080" color="#FFFFFF" border="thin" font-size="10"><center><b>INFORMACIÓN DE CAPACITACIÓN</b></center></style>',
            '', '', '', '', ''
        ];
        
        // Información de la capacitación
        $data[] = [
            '<style border="thin"><b>Link acceso:</b></style>',
            '<style border="thin">' . $linkCompleto . '</style>',
            '', '', '', ''
        ];
        
        $data[] = [
            '<style border="thin"><b>Fecha Inicio:</b></style>',
            '<style border="thin">' . ($capacitacion->fecha_inicio ? $capacitacion->fecha_inicio->format('d/m/Y') : 'N/A') . '</style>',
            '', '', '', ''
        ];
        
        $data[] = [
            '<style border="thin"><b>Fecha Fin:</b></style>',
            '<style border="thin">' . ($capacitacion->fecha_fin ? $capacitacion->fecha_fin->format('d/m/Y') : 'N/A') . '</style>',
            '', '', '', ''
        ];
        
        // Espaciado
        $data[] = ['', '', '', '', '', ''];
        
        // CURSOS ASIGNADOS - Cada curso en su propia fila
        $data[] = [
            '<style bgcolor="#000080" color="#FFFFFF" border="thin" font-size="12"><center><b>CURSOS ASIGNADOS</b></center></style>',
            '', '', '', '', ''
        ];
        
        // Listar cada curso en su propia fila
        foreach ($capacitacion->cursos as $curso) {
            $data[] = [
                '<style border="thin">' . $curso->titulo . '</style>',
                '', '', '', '', ''
            ];
        }
        
        // Espaciado
        $data[] = ['', '', '', '', '', ''];
        
        // Calcular el número total de columnas necesarias (3 fijas + 3 por cada curso)
        $totalColumnas = 3 + ($capacitacion->cursos->count() * 3);
        
        // Crear la fila de ESTUDIANTES con los nombres de cursos
        $filaEstudiantes = [
            '<style bgcolor="#000080" color="#FFFFFF" border="thin"><center><b>ESTUDIANTES</b></center></style>',
            '', ''
        ];
        
        // Colores intercalados: azul oscuro, rojo
        $coloresCursos = ['#000080', '#C00000']; // Azul oscuro, Rojo
        
        foreach ($capacitacion->cursos as $index => $curso) {
            $colorCurso = $coloresCursos[$index % 2]; // Alternar entre azul y rojo
            
            // Agregar el nombre del curso que abarca 3 columnas
            $filaEstudiantes[] = '<style bgcolor="' . $colorCurso . '" color="#FFFFFF" border="thin"><center><b>' . $curso->titulo . '</b></center></style>';
            $filaEstudiantes[] = '<style><center><b></b></center></style>';
            $filaEstudiantes[] = '<style><center><b></b></center></style>';
        }
        
        $data[] = $filaEstudiantes;
        
        // Crear headers de columnas
        $headerRow = [
            '<style bgcolor="#4472C4" color="#FFFFFF" border="thin"><center><b>Nombre</b></center></style>',
            '<style bgcolor="#4472C4" color="#FFFFFF" border="thin"><center><b>Apellido</b></center></style>',
            '<style bgcolor="#4472C4" color="#FFFFFF" border="thin"><center><b>DNI</b></center></style>'
        ];
        
        foreach ($capacitacion->cursos as $index => $curso) {
            $colorCurso = $coloresCursos[$index % 2]; // Alternar entre azul y rojo
            
            // Sub-headers para cada curso
            $headerRow[] = '<style bgcolor="' . $colorCurso . '" color="#FFFFFF" border="thin"><center><b>Nota</b></center></style>';
            $headerRow[] = '<style bgcolor="' . $colorCurso . '" color="#FFFFFF" border="thin"><center><b>Estado</b></center></style>';
            $headerRow[] = '<style bgcolor="' . $colorCurso . '" color="#FFFFFF" border="thin"><center><b>Fecha Realizado</b></center></style>';
        }
        
        $data[] = $headerRow;

        // Datos de estudiantes (una fila por estudiante con todos los cursos)
        foreach ($estudiantes as $estudiante) {
            $fila = [
                '<style border="thin">' . $estudiante->nombre . '</style>',
                '<style border="thin">' . $estudiante->apellido . '</style>',
                '<style border="thin">' . ($estudiante->num_documento ?? 'Sin DNI') . '</style>'
            ];
            
            // Agregar datos para cada curso
            foreach ($capacitacion->cursos as $curso) {
                $progresoCurso = $this->obtenerProgresoPorCurso($estudiante->cursos, $curso->id_curso);
                
                if ($progresoCurso) {
                    $nota = is_array($progresoCurso) ? $progresoCurso['nota'] : $progresoCurso->nota;
                    $resultadoExamen = is_array($progresoCurso) ? $progresoCurso['resultado_examen'] : $progresoCurso->resultado_examen;
                    $fechaUltimoIntento = is_array($progresoCurso) ? $progresoCurso['fecha_ultimo_intento'] : $progresoCurso->fecha_ultimo_intento;
                    
                    $notaTexto = ($nota !== 'no iniciado' && $nota > 0) ? number_format($nota, 2) : 'No lo inició';
                    $estado = ($resultadoExamen !== 'no iniciado') ? ucfirst($resultadoExamen) : 'No lo inició';
                    $fechaRealizado = ($fechaUltimoIntento !== 'no iniciado') ? 
                        date('d/m/Y', strtotime($fechaUltimoIntento)) : 'No lo inició';
                } else {
                    $notaTexto = 'No lo inició';
                    $estado = 'No lo inició';
                    $fechaRealizado = 'No lo inició';
                }
                
                $fila[] = '<style border="thin">' . $notaTexto . '</style>';
                $fila[] = '<style border="thin">' . $estado . '</style>';
                $fila[] = '<style border="thin">' . $fechaRealizado . '</style>';
            }
            
            $data[] = $fila;
        }

        return $data;
    }

    private function generarLinkCompleto(string $linkLoginUnico): string
    {
        $frontendUrl = config('app.frontend.url', 'https://www.rayka.com');
        $loginPath = config('app.frontend.capacitacion_login_path', '/login');
        
        return $frontendUrl . $loginPath . '/' . $linkLoginUnico;
    }

    private function calcularNotaMaxima($cursos): float
    {
        $notaMaxima = 0;
        
        foreach ($cursos as $curso) {
            if (isset($curso->nota) && $curso->nota > $notaMaxima) {
                $notaMaxima = $curso->nota;
            }
        }
        
        return $notaMaxima;
    }

    private function determinarAprobacion($cursos): bool
    {
        $notaMinima = 14.0; // Nota mínima para aprobar
        
        foreach ($cursos as $curso) {
            if (isset($curso->nota_maxima) && $curso->nota_maxima >= $notaMinima) {
                return true;
            }
        }
        
        return false;
    }

    private function determinarEstadoEstudiante($cursos): string
    {
        $tieneProgreso = false;
        
        foreach ($cursos as $curso) {
            if (isset($curso->resultado_examen) && $curso->resultado_examen !== null) {
                $tieneProgreso = true;
                if ($curso->resultado_examen === 'aprobado') {
                    return 'APROBADO';
                } else if ($curso->resultado_examen === 'desaprobado') {
                    return 'DESAPROBADO';
                }
            }
        }
        
        return 'No lo inició';
    }

    private function generarArchivoExcel(array $data, $capacitacion): string
    {
        $filename = 'reporte_capacitacion_' . $capacitacion->id_capacitacion . '_' . date('Y-m-d_H-i-s') . '.xlsx';
        $filepath = storage_path('app/public/reportes/' . $filename);
        
        // Crear directorio si no existe
        if (!file_exists(dirname($filepath))) {
            mkdir(dirname($filepath), 0755, true);
        }
        
        // Generar Excel usando SimpleXLSXGen
        $xlsx = SimpleXLSXGen::fromArray($data);
        $xlsx->saveAs($filepath);
        
        return $filename;
    }

    private function obtenerProgresoPorCurso($cursosData, $cursoId)
    {
        foreach ($cursosData as $cursoData) {
            // $cursoData es array del método obtenerDetallesCursosEstudiante
            $idCursoData = is_array($cursoData) ? $cursoData['id_curso'] : $cursoData->id_curso;
            if ($idCursoData == $cursoId) {
                return $cursoData;
            }
        }
        return null;
    }
}