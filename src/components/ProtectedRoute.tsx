import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useEffect, useState, type JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [carregando, setCarregando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setAutenticado(!!data.session);
      setCarregando(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAutenticado(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (carregando) return <div>Carregando...</div>;

  return autenticado ? children : <Navigate to="/login" replace />;
}
