import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro("E-mail ou senha inválidos.");
      setCarregando(false);
      return;
    }

    navigate("/checklist");

  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-200 flex items-center justify-center p-4">

      <div className="bg-white/70 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/30">

        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Bem-vindo 👋
        </h1>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="E-mail"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Senha"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {erro && (
            <p className="text-red-500 text-sm text-center">{erro}</p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-60"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
