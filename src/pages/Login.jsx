import React, { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { loginUsuario } from '@/services/authService';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginUsuario(formData);
      // Redirigir al Dashboard o página principal tras login exitoso
      window.location.href = '/'; 
    } catch (err) {
      setError(err.response?.data?.message || 'Ocurrió un error al intentar acceder.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      
      {/* Lado Izquierdo - Branding (Oculto en móviles) */}
      {/* Cambiamos el fondo principal a red-600 */}
      <div className="hidden lg:flex lg:w-1/2 bg-red-600 relative overflow-hidden items-center justify-center">
        {/* Círculos decorativos de fondo en tonos rojos/rosados */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rose-700 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        
        <div className="relative z-10 text-center text-white px-12">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl">
            {/* Puedes cambiar esto por una etiqueta <img> con el logo blanco de la empresa */}
            <span className="text-3xl font-extrabold tracking-wider">CK2</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-4">Gestión de Talento</h1>
          {/* Texto de apoyo en un rojo muy claro */}
          <p className="text-red-100 text-lg">Centraliza tus reclutamientos, capacitaciones y empleados en una sola plataforma moderna.</p>
        </div>
      </div>

      {/* Lado Derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900">Bienvenido de nuevo</h2>
            <p className="text-slate-500 mt-2">Ingresa tus credenciales para acceder al panel.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold mb-6 border border-red-100 flex items-center justify-center text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                 
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all text-slate-700 font-medium shadow-sm"
                  placeholder="ejemplo@ck2.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Contraseña</label>
                {/* Enlace de olvido de clave en rojo */}
                <a href="#" className="text-xs font-bold text-red-600 hover:text-red-500 transition-colors">¿Olvidaste tu clave?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
               
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all text-slate-700 font-medium shadow-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
    
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Verificando...
                </>
              ) : (
                <>
                  Ingresar al sistema <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>

    </div>
  );
};

export default Login;