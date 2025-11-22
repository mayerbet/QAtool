import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// Importar páginas
import Login from "../pages/Login";
import Checklist from "../pages/Checklist";
import Historico from "../pages/Historico";
import Layout from "../components/Layout";
import SignUp from "../pages/SignUp";

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
    </Routes>
  );
}
