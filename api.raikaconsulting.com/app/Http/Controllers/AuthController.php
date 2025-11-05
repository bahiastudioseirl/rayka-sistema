<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Usuarios;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{

    public function __construct()
    {
        // Solo login es público, el resto requiere autenticación
    }


    public function login(Request $request)
    {
        $request->validate([
            'correo' => 'required|email',
            'contrasenia' => 'required|string',
        ]);

        $credentials = [
            'correo' => $request->correo,
            'password' => $request->contrasenia
        ];

        $usuario = Usuarios::where('correo', $request->correo)->first();

        if (!$usuario || !Hash::check($request->contrasenia, $usuario->contrasenia)) {
            throw ValidationException::withMessages([
                'correo' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        if (!$usuario->activo) {
            throw ValidationException::withMessages([
                'correo' => ['Tu cuenta está desactivada.'],
            ]);
        }

        $token = JWTAuth::fromUser($usuario);

        return $this->respondWithToken($token, $usuario);
    }

    public function logout(Request $request)
    {
        try {
            // Obtener token del header Authorization
            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json([
                    'success' => true,
                    'message' => 'Sesión cerrada exitosamente'
                ], 200);
            }

            // Invalidar el token manualmente sin usar middleware
            JWTAuth::setToken($token);
            
            // Verificar que el token sea válido antes de invalidarlo
            $payload = JWTAuth::getPayload();
            $userId = $payload->get('sub');
            
            // Buscar usuario para confirmar que existe
            $usuario = Usuarios::find($userId);
            
            if ($usuario) {
                // Invalidar el token
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


    public function refresh()
    {
        try {
            $token = JWTAuth::refresh(JWTAuth::getToken());
            $usuario = auth('api')->user();

            return $this->respondWithToken($token, $usuario);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Token inválido'], 401);
        }
    }

    protected function respondWithToken($token, $usuario)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
            'usuario' => [
                'id' => $usuario->id_usuario,
                'nombre' => $usuario->nombre,
                'apellido' => $usuario->apellido,
                'correo' => $usuario->correo,
                'rol' => $usuario->rol,
            ]
        ]);
    }
}
