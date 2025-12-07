import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import api from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Intentando login con:', email);
      
      // Como tu API no tiene login, buscamos el cliente por email
      const response = await api.get('/clients/');
      const allClients = response.data;
      
      console.log('📋 Clientes obtenidos:', allClients.length);
      
      // Buscar cliente con este email
      const client = allClients.find(c => c.email === email);
      
      if (!client) {
        throw new Error('Usuario no encontrado. ¿Ya te registraste?');
      }
      
      console.log('✅ Cliente encontrado:', client);
      
      // Verificar contraseña guardada localmente
      const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      const savedPassword = savedUsers[email];
      
      if (savedPassword && savedPassword !== password) {
        throw new Error('Contraseña incorrecta');
      }
      
      // Guardar datos de sesión
      localStorage.setItem('token', 'temp-token-' + client.id_key);
      localStorage.setItem('user', JSON.stringify(client));
      
      console.log('✅ Login exitoso');
      navigate('/products');
      
    } catch (err) {
      console.error('❌ Error:', err);
      
      let message = 'Error al iniciar sesión';
      
      if (err.message.includes('Usuario no encontrado')) {
        message = '❌ Usuario no encontrado. Por favor regístrate primero.';
      } else if (err.message.includes('Contraseña incorrecta')) {
        message = '❌ Contraseña incorrecta';
      } else if (err.response) {
        if (err.response.status === 404) {
          message = '🚫 No se pudieron cargar los usuarios. Verifica el backend.';
        } else {
          message = err.response.data?.detail || 
                   `Error del servidor (${err.response.status})`;
        }
      } else if (err.request) {
        message = '🚫 No se pudo conectar con el servidor. Verifica que esté corriendo.';
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent mb-2">
            TechStore
          </h1>
          <p className="text-gray-400">Bienvenido de vuelta</p>
        </div>

        {/* Card de Login */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Iniciar Sesión</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Iniciando sesión...'
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Registro */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              ¿No tienes una cuenta?{' '}
              <Link 
                to="/register" 
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                Regístrate
              </Link>
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
          <p className="text-gray-400 text-xs text-center">
            💡 Primero regístrate, luego podrás iniciar sesión
          </p>
        </div>
      </div>
    </div>
  );
}