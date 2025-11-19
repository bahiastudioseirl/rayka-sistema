import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'multipart/form-data',
	},
});

export const axiosWithoutMultipart = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Instancia para estudiantes (usa estudiante_token)
export const axiosEstudiante = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Interceptor para admin (authToken)
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para admin (authToken) - sin multipart
axiosWithoutMultipart.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para estudiantes (estudiante_token)
axiosEstudiante.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('estudiante_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas con errores 401 (no autorizado)
const handleUnauthorized = (error: any) => {
	if (error.response?.status === 401) {
		// Detectar si es token de admin o estudiante
		const estudianteToken = localStorage.getItem('estudiante_token');
		
		if (estudianteToken) {
			// Token de estudiante expirado
			localStorage.removeItem('estudiante_token');
		} else {
			// Token de admin expirado
			localStorage.removeItem('authToken');
		}
		
		// Redirigir al login si no estamos ya ahí
		if (!window.location.pathname.includes('/login')) {
			window.location.href = '/login';
		}
	}
	return Promise.reject(error);
};

axiosInstance.interceptors.response.use(
	(response) => response,
	handleUnauthorized
);

axiosWithoutMultipart.interceptors.response.use(
	(response) => response,
	handleUnauthorized
);

axiosEstudiante.interceptors.response.use(
	(response) => response,
	handleUnauthorized
);

