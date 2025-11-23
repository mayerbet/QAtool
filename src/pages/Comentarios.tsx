import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Comentario {
  original_id: number;
  topico: string;
  comentario: string;
  usuario_id: string | null; // null = comentário padrão
}

export default function Comentarios() {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [comentarioEditado, setComentarioEditado] = useState("");

  const [userId, setUserId] = useState<string | null>(null);

  // 🔥 1. Carregar usuário logado
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  // 🔥 2. Buscar comentários final (VIEW)
  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase
        .from("comentarios_final")
        .select("*")
        .order("topico", { ascending: true });

      if (error) {
        console.error(error);
        setErro("Erro ao carregar comentários.");
      } else {
        setComentarios(data as Comentario[]);
      }

      setCarregando(false);
    }

    carregar();
  }, []);

  // 🔥 Entrar no modo edição
  function editar(id: number, texto: string) {
    setEditandoId(id);
    setComentarioEditado(texto);
  }

  // 🔥 Cancelar edição
  function cancelarEdicao() {
    setEditandoId(null);
    setComentarioEditado("");
  }

  // 🔥 Salvar edição (cria ou atualiza comentário do usuário)
  async function salvarComentario(item: Comentario) {
    if (!userId) {
      alert("Usuário não autenticado.");
      return;
    }

    // Verificar se já existe na comentarios_usuario
    const { data: existente } = await supabase
      .from("comentarios_usuario")
      .select("*")
      .eq("usuario_id", userId)
      .eq("original_id", item.original_id)
      .maybeSingle();

    let error;

    if (existente) {
      // Atualizar comentário já existente
      const result = await supabase
        .from("comentarios_usuario")
        .update({
          comentario: comentarioEditado,
        })
        .eq("usuario_id", userId)
        .eq("original_id", item.original_id);

      error = result.error;
    } else {
      // Criar novo comentário personalizado
      const result = await supabase.from("comentarios_usuario").insert({
        usuario_id: userId,
        original_id: item.original_id,
        comentario: comentarioEditado,
      });

      error = result.error;
    }

    if (error) {
      console.error(error);
      alert("Erro ao salvar comentário.");
      return;
    }

    // Atualizar a lista local (sem recarregar tudo)
    setComentarios((prev) =>
      prev.map((c) =>
        c.original_id === item.original_id
          ? {
              ...c,
              comentario: comentarioEditado,
              usuario_id: userId, // Agora pertence ao usuário
            }
          : c
      )
    );

    cancelarEdicao();
  }

  if (carregando) return <p className="p-4">Carregando comentários...</p>;
  if (erro) return <p className="p-4 text-red-600">{erro}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">📝 Comentários Personalizáveis</h2>

      <p className="text-gray-600 mb-6">
        Aqui você pode editar os comentários-padrão usados no checklist.
        Cada alteração fica salva apenas para sua conta.  
      </p>

      <div className="space-y-6">
        {comentarios.map((item) => (
          <div
            key={item.original_id}
            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500 font-medium mb-1">
              📌 Tópico: <span className="text-gray-700">{item.topico}</span>
            </p>

            {/* Comentário */}
            {editandoId === item.original_id ? (
              <textarea
                value={comentarioEditado}
                onChange={(e) => setComentarioEditado(e.target.value)}
                className="w-full border rounded p-2 mt-2 text-sm"
                rows={4}
              />
            ) : (
              <div className="p-3 bg-gray-50 border rounded whitespace-pre-line text-gray-800 mt-2">
                {item.comentario}
              </div>
            )}

            {/* Botões */}
            <div className="mt-3 flex gap-3">
              {editandoId === item.original_id ? (
                <>
                  <button
                    onClick={() => salvarComentario(item)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Salvar
                  </button>

                  <button
                    onClick={cancelarEdicao}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => editar(item.original_id, item.comentario)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Editar
                </button>
              )}
            </div>

            {/* Indicação visual */}
            {item.usuario_id ? (
              <p className="text-xs text-green-700 mt-2">✔ Comentário personalizado</p>
            ) : (
              <p className="text-xs text-gray-500 mt-2">Comentário padrão</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
