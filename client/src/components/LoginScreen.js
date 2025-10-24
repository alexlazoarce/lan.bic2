import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import '../styles/Auth.css';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Inicializar useNavigate

  const loginHandler = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await axios.post('/api/v1/auth/login', {
        email,
        password,
      });

      localStorage.setItem('authToken', data.token);
      // Usar navigate para redirigir sin recargar la página
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Iniciar Sesión en LAN bic</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={loginHandler}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              required
              id="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              required
              id="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary">
            Iniciar Sesión
          </button>
        </form>
      </div>
      <div className="auth-welcome">
        <h1>Bienvenido de Nuevo</h1>
        <p>Gestiona tu negocio con inteligencia.</p>
      </div>
    </div>
  );
};

export default LoginScreen;
