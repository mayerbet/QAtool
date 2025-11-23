import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// Importar páginas
import Login from "../pages/Login";
import Checklist from "../pages/Checklist";
import Historico from "../pages/Historico";
import Layout from "../components/Layout";
import SignUp from "../pages/SignUp";
import Comentarios from "../pages/Comentarios"; // mesmo que vazio
import Dashboard from "../pages/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rota de Login */}
      <Route path="/login" element={<Login />} />

      {/* Rota de Criar Conta */}
      <Route path="/signup" element={<SignUp />} />

      {/* Rotas protegidas dentro do Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/checklist"
        element={
          <ProtectedRoute>
            <Layout>
              <Checklist />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/historico"
        element={
          <ProtectedRoute>
            <Layout>
              <Historico />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
  path="/comentarios"
  element={
    <ProtectedRoute>
      <Layout>
        <Comentarios />
      </Layout>
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}
