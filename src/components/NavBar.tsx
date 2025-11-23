import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white shadow px-6 py-3 flex items-center justify-between">
      
      {/* LOGO */}
      <div className="text-xl font-bold text-blue-600">
        QA Tool
      </div>

      {/* NAVEGAÇÃO */}
      <nav className="flex gap-6 text-gray-700 font-medium">
        <Link to="/" className="hover:text-blue-600">Checklist</Link>
        <Link to="/historico" className="hover:text-blue-600">Histórico</Link>
        <Link to="/comentarios" className="hover:text-blue-600">Comentários</Link>
      </nav>

      {/* MENU DO USUÁRIO */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400"
        >
          <span className="font-bold text-white">L</span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border p-2 animate-fade-in">
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
              Perfil
            </button>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
              Configurações
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
