import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro("E-mail ou senha inválidos.");
      return;
    }

    navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-2xl font-semibold mb-6 text-center">
          Login
        </h1>

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            id="email"
            type="email"
            placeholder="E-mail"
            className="w-full p-3 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            name="email"
          />

          <input
            id="password"
            type="password"
            placeholder="Senha"
            className="w-full p-3 border rounded"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            name="password"
          />

          {erro && <p className="text-red-500 text-sm">{erro}</p>}

          <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
            Entrar
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-700">
          Não tem conta?{" "}
          <Link to="/signup" className="text-blue-600 underline">
            Criar conta
          </Link>
        </p>

      </div>
    </div>
  );
}
