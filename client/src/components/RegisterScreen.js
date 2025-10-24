import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import '../styles/Auth.css';

const RegisterScreen = () => {
  const [tenantName, setTenantName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Inicializar useNavigate

  const registerHandler = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // El tenantId se puede generar a partir del nombre de la empresa
      const tenantId = tenantName.toLowerCase().replace(/\s+/g, '-');

      const { data } = await axios.post('/api/v1/auth/register', {
        tenantName,
        tenantId,
        name,
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
        <h2>Crear Cuenta en LAN bic</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={registerHandler}>
          <div className="form-group">
            <label htmlFor="tenantName">Nombre de la Empresa</label>
            <input
              type="text"
              required
              id="tenantName"
              placeholder="Ej: Mi Empresa S.A. de C.V."
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Tu Nombre</label>
            <input
              type="text"
              required
              id="name"
              placeholder="Ej: Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Tu Correo Electrónico</label>
            <input
              type="email"
              required
              id="email"
              placeholder="ejemplo@tuempresa.com"
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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary">
            Registrar mi Empresa
          </button>
        </form>
      </div>
      <div className="auth-welcome">
        <h1>Bienvenido a LAN bic</h1>
        <p>La solución integral para la gestión de tu negocio.</p>
      </div>
    </div>
  );
};

export default RegisterScreen;
