<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use App\Utils\RolesEnum;

class AdminRoleMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::guard('api')->check()) {
            throw new UnauthorizedHttpException('Bearer', 'No tienes autorización para acceder a este recurso. Por favor, inicia sesión.');
        }

        $usuarioAuth = Auth::guard('api')->user();
        
        $usuario = \App\Models\Usuarios::with('rol')->find($usuarioAuth->id_usuario);

        if (!$usuario || $usuario->id_rol !== RolesEnum::ADMINISTRADOR->value) {
            throw new AccessDeniedHttpException('No tienes permisos suficientes para realizar esta acción.');
        }

        return $next($request);
    }
}
