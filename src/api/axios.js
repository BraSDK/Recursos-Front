import axios from 'axios';

const api = axios.create({
    baseURL: 'http://sistema-rrhh.test/api', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor: Revisa cada petición antes de que salga hacia Laravel
api.interceptors.request.use((config) => {
    // Buscamos si el usuario ya inició sesión y tiene un token guardado
    const token = localStorage.getItem('auth_token');
    
    // Si hay token, lo pegamos en la cabecera de la petición
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;