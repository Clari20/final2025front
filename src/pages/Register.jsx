import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, UserPlus } from 'lucide-react';
import api from '../api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // ✅ Tu backend usa estos campos exactos
      const clientData = {
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        telephone: formData.telephone
        // NO enviamos password porque tu backend no lo acepta
      };

      console.log('📤 Registrando cliente:', clientData);
      
      const response = await api.post('/clients/', clientData);
      
      console.log('✅ Cliente registrado:', response.data);
      
      // Guardar contraseña localmente para poder hacer login después
      const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      savedUsers[formData.email] = formData.password;
      localStorage.setItem('registeredUsers', JSON.stringify(savedUsers));
      
      // Guardar datos de sesión
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('token', 'temp-token-' + response.data.id_key);
      
      alert('¡Registro exitoso! Bienvenido a TechStore');
      navigate('/products');
      
    } catch (err) {
      console.error('❌ Error:', err);
      
      let message = 'Error al registrar';
      
      if (err.response) {
        if (err.response.status === 400) {
          message = 'Datos inválidos. Verifica la información.';
        } else if (err.response.status === 422) {
          const details = err.response.data?.detail;
          if (Array.isArray(details)) {
            message = 'Error: ' + details.map(d => d.msg).join(', ');
          } else {
            message = 'Datos inválidos: ' + JSON.stringify(details);
          }
        } else {
          message = err.response.data?.detail || 
                   `Error del servidor (${err.response.status})`;
        }
      } else if (err.request) {
        message = '🚫 No se pudo conectar con el servidor en ' + api.defaults.baseURL;
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent mb-2">
            TechStore
          </h1>
          <p className="text-gray-400">Crea tu cuenta</p>
        </div>

        {/* Card de Registro */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Registro</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Juan"
                    required
                  />
                </div>
              </div>

              {/* Apellido */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Apellido *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Pérez"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Teléfono *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="+52 123 456 7890"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Info Note */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-blue-400 text-xs">
              ℹ️ Tu contraseña se guardará de forma segura en tu navegador para futuras sesiones
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Registrando...'
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          {/* Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                to="/" 
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}