import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterScreen from './components/RegisterScreen';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import MainLayout from './components/MainLayout';
import UserManagement from './components/users/UserManagement';
import ContractManagement from './components/contracts/ContractManagement'; // Importar el nuevo componente

// Este componente servirá para proteger rutas en el futuro
const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');
  return authToken ? children : <LoginScreen />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/login" element={<LoginScreen />} />

        {/* Ruta protegida para el dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <DashboardScreen />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Ruta para la gestión de usuarios */}
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <MainLayout>
                <UserManagement />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Ruta para la gestión de contratos */}
        <Route
          path="/contracts"
          element={
            <PrivateRoute>
              <MainLayout>
                <ContractManagement />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Ruta por defecto */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                <DashboardScreen />
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
