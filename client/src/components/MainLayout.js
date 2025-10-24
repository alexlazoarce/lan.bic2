import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/MainLayout.css';

const MainLayout = ({ children }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      };

      try {
        // En una implementación real, esta ruta devolvería los módulos suscritos por el tenant.
        // Por ahora, obtendremos todos los módulos disponibles como simulación.
        const { data } = await axios.get('/api/v1/modules', config);
        setModules(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching modules", error);
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>LAN bic</h2>
        </div>
        <nav className="sidebar-menu">
          <ul>
            <li className="active">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            {/* Enlace a Gestión de Usuarios */}
            <li>
              <Link to="/users">User Management</Link>
            </li>
            {!loading && modules.map(module => (
              <li key={module._id}>
                <Link to={`/modules/${module.moduleId}`}>{module.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <div className="user-info">
            <span>Bienvenido, [Nombre de Usuario]</span>
          </div>
        </header>
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
