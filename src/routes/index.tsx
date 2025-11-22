import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Checklist from "../pages/Checklist";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rota inicial redireciona corretamente */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rota pública */}
      <Route path="/login" element={<Login />} />

      {/* Rotas protegidas */}
      <Route
        path="/checklist"
        element={
          <ProtectedRoute>
            <Checklist />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<h1>Página não encontrada</h1>} />
    </Routes>
  );
}
