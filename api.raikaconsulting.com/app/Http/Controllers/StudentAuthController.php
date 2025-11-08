<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuarios;
use App\Models\Capacitaciones;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Validation\ValidationException;

class StudentAuthController extends Controller
{

    public function login(Request $request, $link_login_unico)
    {
        $request->validate([
            'num_documento' => 'required|string',
        ]);

        $capacitacion = Capacitaciones::where('link_login_unico', $link_login_unico)
            ->where('estado', 'activa')
            ->with(['solicitante.empresa', 'cursos' => function($query) {
                $query->where('activo', true);
            }])
            ->first();

        if (!$capacitacion) {
            throw ValidationException::withMessages([
                'num_documento' => ['Link de acceso inválido o capacitación no disponible.'],
            ]);
        }

        $usuario = Usuarios::where('num_documento', $request->num_documento)
            ->where('activo', true)
            ->first();

        if (!$usuario) {
            throw ValidationException::withMessages([
                'num_documento' => ['Número de documento no encontrado o usuario inactivo.'],
            ]);
        }

        $estaEnCapacitacion = $capacitacion->usuarios()
            ->where('usuarios.id_usuario', $usuario->id_usuario)
            ->exists();

        if (!$estaEnCapacitacion) {
            throw ValidationException::withMessages([
                'num_documento' => ['No tienes acceso a esta capacitación.'],
            ]);
        }

        $token = JWTAuth::fromUser($usuario);

        return $this->respondWithToken($token, $usuario, $capacitacion);
    }


    public function logout(Request $request)
    {
        try {
            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json([
                    'success' => true,
                    'message' => 'Sesión cerrada exitosamente'
                ], 200);
            }

            JWTAuth::setToken($token);
            $payload = JWTAuth::getPayload();
            $userId = $payload->get('sub');
            
            $usuario = Usuarios::find($userId);
            
            if ($usuario) {
                JWTAuth::invalidate();
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Sesión cerrada exitosamente'
            ], 200);
            
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json([
                'success' => true,
                'message' => 'Token ya expirado, sesión cerrada'
            ], 200);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json([
                'success' => true,
                'message' => 'Token inválido, sesión cerrada'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => true,
                'message' => 'Sesión cerrada exitosamente'
            ], 200);
        }
    }

    protected function respondWithToken($token, $usuario, $capacitacion)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
            'usuario' => [
                'id' => $usuario->id_usuario,
                'nombre' => $usuario->nombre,
                'apellido' => $usuario->apellido,
                'num_documento' => $usuario->num_documento,
                'rol' => $usuario->rol,
            ],
            'capacitacion' => [
                'id' => $capacitacion->id_capacitacion,
                'duracion_examen_min' => $capacitacion->duracion_examen_min,
                'max_intentos' => $capacitacion->max_intentos,
                'estado' => $capacitacion->estado,
                'fecha_creacion' => $capacitacion->fecha_creacion,
                'solicitante' => [
                    'nombre' => $capacitacion->solicitante->nombre,
                    'apellido' => $capacitacion->solicitante->apellido,
                    'cargo' => $capacitacion->solicitante->cargo,
                    'empresa' => [
                        'nombre' => $capacitacion->solicitante->empresa->nombre,
                    ]
                ],
                'cursos' => $capacitacion->cursos->map(function($curso) {
                    return [
                        'id' => $curso->id_curso,
                        'titulo' => $curso->titulo,
                        'contenido' => $curso->contenido,
                        'tipo_contenido' => $curso->tipo_contenido,
                        'fecha_creacion' => $curso->fecha_creacion,
                    ];
                }),
            ]
        ]);
    }
}
