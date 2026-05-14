import api from '../api/axios';

export const loginUsuario = async (credenciales) => {
    const response = await api.post('/login', credenciales);
    
    // Si el login es exitoso, guardamos el token y los datos del usuario en el navegador
    if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
};

export const logoutUsuario = async () => {
    try {
        await api.post('/logout');
    } catch (error) {
        console.error("Error al cerrar sesión", error);
    } finally {
        // Pase lo que pase, limpiamos el navegador
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login'; // Redirigimos al login
    }
};