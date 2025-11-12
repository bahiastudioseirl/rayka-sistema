import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, AlertCircle, BookOpen } from 'lucide-react';
import LogoRayka from '../../../assets/LogoRayka.png';
import { UserStore } from './services/UserLoginService';
import type { UserLoginRequest } from './schemas/UserLoginSchema';
import { obtenerCapacitacionPorCodigo, type CapacitacionCompleta } from '../../../admin/features/capacticacionAdmin/services/obtenerCapacitacionPorCodigo';

export const UserLoginForm = () => {
  const [credentials, setCredentials] = useState<UserLoginRequest>({
    num_documento: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [capacitacionInfo, setCapacitacionInfo] = useState<CapacitacionCompleta | null>(null);
  const [loadingCapacitacion, setLoadingCapacitacion] = useState(false);
  const navigate = useNavigate();
  const { codigo } = useParams();

  // Detectar si es acceso específico a una capacitación
  const isCapacitacionLogin = !!codigo;

  useEffect(() => {
    if (codigo) {
      const cargarCapacitacion = async () => {
        setLoadingCapacitacion(true);
        setError('');
        
        try {
          const response = await obtenerCapacitacionPorCodigo(codigo);
          
          if (response.success && response.data) {
            setCapacitacionInfo(response.data);
          } else {
            setError('El código de capacitación no es válido o ha expirado.');
            setCapacitacionInfo(null);
          }
        } catch (err) {
          console.error('Error cargando capacitación:', err);
          setError('Error al cargar la información de la capacitación.');
          setCapacitacionInfo(null);
        } finally {
          setLoadingCapacitacion(false);
        }
      };

      cargarCapacitacion();
    }
  }, [codigo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validación básica
    if (!credentials.num_documento.trim()) {
      setError('Por favor, ingresa tu DNI.');
      setIsLoading(false);
      return;
    }

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validación específica para capacitación
    if (isCapacitacionLogin && capacitacionInfo) {
      if (credentials.num_documento.length === 8) {
        // Verificar si el usuario está registrado en esta capacitación
        const usuarioEnCapacitacion = capacitacionInfo.usuarios_asignados.find(
          (usuario) => usuario.num_documento === credentials.num_documento
        );
        
        if (usuarioEnCapacitacion) {
          // Guardar datos del usuario con contexto de capacitación
          UserStore.clearAll();
          UserStore.setUser(usuarioEnCapacitacion);
          UserStore.setToken('capacitacion-token-' + Date.now());
          
          // Redirigir a los cursos de la capacitación específica
          navigate(`/capacitacion/${codigo}/cursos`);
        } else {
          setError('Tu DNI no está registrado para esta capacitación.');
        }
      } else {
        setError('DNI debe tener 8 dígitos.');
      }
    } else if (!isCapacitacionLogin) {
      // Login general - sin capacitación específica
      if (credentials.num_documento.length === 8) {
        UserStore.clearAll();
        UserStore.setUser({
          id_usuario: 1,
          nombre: 'Usuario',
          apellido: 'Demo', 
          correo: 'usuario@demo.com',
          num_documento: credentials.num_documento,
          estado: 'activo'
        });
        UserStore.setToken('user-token-' + Date.now());
        
        // Ir a la página de cursos general
        navigate('/');
      } else {
        setError('DNI no encontrado en el sistema.');
      }
    } else {
      setError('No se pudo cargar la información de la capacitación.');
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Solo permitir números
    value = value.replace(/[^0-9]/g, '');
    
    // Limitar a 8 dígitos (DNI peruano)
    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    setCredentials({
      num_documento: value
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
          
            {isCapacitacionLogin && loadingCapacitacion ? (
              <div className="mt-4 flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-[#132436] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600">Cargando información de la capacitación...</p>
              </div>
            ) : isCapacitacionLogin && capacitacionInfo ? (
              <div className="mt-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-[#132436]" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Capacitación Empresarial
                  </h2>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-[#132436] mb-1">{capacitacionInfo.empresaInfo?.nombre}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    Solicitado por: {capacitacionInfo.solicitante.nombre} {capacitacionInfo.solicitante.apellido}
                  </p>
                
                </div>
                <p className="mt-3 text-sm text-[#132436] font-medium text-center">
                  Ingresa tu DNI para acceder a esta capacitación
                </p>
              </div>
            ) : isCapacitacionLogin && !capacitacionInfo && !loadingCapacitacion ? (
              <div className="mt-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h2 className="text-lg font-semibold text-red-600">Link inválido</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  El código de capacitación no es válido o ha expirado.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#132436] rounded-lg hover:bg-[#224666] transition-colors"
                >
                  Ir al login general
                </button>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-600">
                Ingresa tu DNI para acceder a tus cursos
              </p>
            )}
          </div>

          {/* Form - Solo mostrar si no es capacitación o si la capacitación es válida */}
          {(!isCapacitacionLogin || capacitacionInfo) && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="num_documento" className="block text-sm font-medium text-gray-700 mb-2">
                Documento de Identidad (DNI)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="num_documento"
                  name="num_documento"
                  type="text"
                  required
                  value={credentials.num_documento}
                  onChange={handleChange}
                  maxLength={8}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224666] focus:border-[#224666] focus:z-10 sm:text-sm"
                  placeholder="12345678"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Ingresa tu número de DNI sin espacios ni guiones
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 shrink-0" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !credentials.num_documento.trim()}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#132436] hover:bg-[#224666] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verificando acceso...
                </div>
              ) : (
                'Ingresar'
              )}
            </button>

            {/* Demo Info */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 text-center">
                <strong>Demo:</strong> Usa el DNI <code className="bg-blue-100 px-1 rounded">12345678</code> para probar
              </p>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
};