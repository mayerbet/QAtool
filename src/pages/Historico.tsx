import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Registro {
  id: number;
  data: string;
  atendente: string;
  contato_id: string;
  relatorio: string;
}

export default function Historico() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // 🔍 Filtros
  const [filtroAgente, setFiltroAgente] = useState("");
  const [filtroChat, setFiltroChat] = useState("");
  const [filtroData, setFiltroData] = useState("");

  useEffect(() => {
    async function carregarRegistros() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        setErro("Usuário não autenticado.");
        setCarregando(false);
        return;
      }

      console.log("ID do usuário logado:", user.id);

      const { data, error } = await supabase
        .from("history")
        .select("*")
        .eq("usuario_id", user.id)
        .order("data", { ascending: false });

      if (error) {
        console.error("Erro Supabase:", error);
        setErro("Erro ao carregar histórico.");
      } else {
        setRegistros(data as Registro[]);
      }

      setCarregando(false);
    }

    carregarRegistros();
  }, []);

  if (carregando) return <p className="p-4">Carregando histórico...</p>;
  if (erro) return <p className="p-4 text-red-600">{erro}</p>;

  // ============================================================
  // 🔥 FILTRAGEM (em memória, super rápido)
  // ============================================================

  const registrosFiltrados = registros
    .filter((item) =>
      filtroAgente
        ? item.atendente.toLowerCase().includes(filtroAgente.toLowerCase())
        : true
    )
    .filter((item) =>
      filtroChat
        ? item.contato_id.toLowerCase().includes(filtroChat.toLowerCase())
        : true
    )
    .filter((item) =>
      filtroData ? item.data.startsWith(filtroData) : true
    );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">📚 Histórico de Monitorias</h2>

      {/* =======================================
          🔍 FILTROS
      ========================================= */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder="Filtrar por atendente"
          className="border p-2 rounded w-full"
          value={filtroAgente}
          onChange={(e) => setFiltroAgente(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filtrar por ID do chat"
          className="border p-2 rounded w-full"
          value={filtroChat}
          onChange={(e) => setFiltroChat(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 rounded w-full"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
        />

      </div>

      {/* =======================================
          🧾 LISTAGEM
      ========================================= */}
      {registrosFiltrados.length === 0 ? (
        <p className="text-gray-600">Nenhum registro encontrado.</p>
      ) : (
        <div className="space-y-4">
          {registrosFiltrados.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
            >
              <p className="text-sm text-gray-500">
                {new Date(item.data).toLocaleString()}
              </p>

              <p className="font-semibold text-gray-800 mt-2">
                👤 Atendente: {item.atendente}
              </p>

              <p className="text-gray-700">
                💬 ID do Chat:{" "}
                <span className="font-medium">{item.contato_id}</span>
              </p>

              <div className="mt-3 p-3 bg-gray-50 border rounded whitespace-pre-line text-gray-800">
                {item.relatorio}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
