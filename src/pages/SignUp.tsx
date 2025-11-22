import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (error) {
      setErro(error.message);
      setCarregando(false);
      return;
    }

    // Se tudo deu certo, manda pro login
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white/70 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/30">
        
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Criar Conta ✨
        </h1>

        <form className="space-y-5" onSubmit={handleSignUp}>
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

          <div>
            <input
              type="password"
              placeholder="Confirmar Senha"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>

          {erro && (
            <p className="text-red-500 text-sm text-center">{erro}</p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all font-medium disabled:opacity-60"
          >
            {carregando ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-700">
          Já tem conta?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Entrar
          </Link>
        </p>

      </div>
    </div>
  );
}
