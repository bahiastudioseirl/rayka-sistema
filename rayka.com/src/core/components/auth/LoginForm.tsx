import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoRayka from '../../../assets/LogoRayka.png';
import { iniciarSesion } from './services/IniciarSesion';
import { AuthStore } from './services/AuthStore';
import type { LoginRequest } from './schemas/LoginSchema';

export const LoginForm = () => {
  const [credentials, setCredentials] = useState<LoginRequest>({
    correo: '',
    contrasenia: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await iniciarSesion(credentials);
      
      // Limpiar tokens antiguos primero (por si quedaron de sesiones anteriores)
      AuthStore.clearAll();
      
      // Solo guardar el token en localStorage
      localStorage.setItem('authToken', response.access_token);
      
      // Guardar datos del usuario en sessionStorage (más seguro)
      AuthStore.setUser(response.usuario);
      
      // Redirigir según el rol
      if (response.usuario.rol.nombre === 'Administrador') {
        navigate('/administrator');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error('Error en login:', err);
      
      if (err.response?.status === 401) {
        setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al iniciar sesión. Intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    // Limpiar error al escribir
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e4e4e4]/30 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-20 w-40 rounded-full flex items-center justify-center mb-2">
              <img src={LogoRayka} alt="Logo Rayka" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Panel Administrativo</h2>
            <p className="mt-2 text-sm text-gray-600">
              Ingresa tus credenciales para acceder
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  required
                  value={credentials.correo}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224666] focus:border-[#224666] focus:z-10 sm:text-sm"
                  placeholder="admin@rayka.com"
                />
              </div>
              
              <div>
                <label htmlFor="contrasenia" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  id="contrasenia"
                  name="contrasenia"
                  type="password"
                  required
                  value={credentials.contrasenia}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224666] focus:border-[#224666] focus:z-10 sm:text-sm"
                  placeholder="Ingresa tu contraseña"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#132436] hover:bg-[#224666] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verificando...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>

            {/* Demo Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 text-center">
                <strong>Demo:</strong> admin@rayka.com | admin@rayka.com
              </p>
            </div>

            {/* Link to User Login */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
              >
                ¿Eres estudiante? Ingresa aquí
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};