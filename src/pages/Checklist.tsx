import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; 
import GuidePopover from "../components/GuidePopover";




interface Topico {
  id: number;
  topico: string;
  descricao: string;
}

interface Resposta {
  marcacao: "Erro" | "N/A" | null;
  comentario: string;
}

export default function ChecklistWithGuide() {
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [respostas, setRespostas] = useState<Record<number, Resposta>>({});
  const [modalAberto, setModalAberto] = useState(false);
  const [guiaSelecionado, setGuiaSelecionado] = useState<Topico | null>(null);
  const [comentariosPadrao, setComentariosPadrao] = useState<Record<string, string>>({});
  const [relatorio, setRelatorio] = useState("");
  const [relatorioGerado, setRelatorioGerado] = useState(false);
  const [guiaBtnRef, setGuiaBtnRef] = useState<HTMLElement | null>(null);

  const [nomeGC, setNomeGC] = useState("");
  const [chatId, setChatId] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { data: guideData } = await supabase.from("guide").select("topico, descricao");
      const { data: comentariosData } = await supabase.from("comentarios_padrao").select("topico, comentario");

      if (guideData) {
        const topicosFormatados: Topico[] = guideData.map((row, index) => ({
          id: index,
          topico: row.topico,
          descricao: row.descricao,
        }));
        setTopicos(topicosFormatados);
      }

      if (comentariosData) {
        const comentariosMap: Record<string, string> = {};
        comentariosData.forEach((row) => {
          comentariosMap[row.topico] = row.comentario;
        });
        setComentariosPadrao(comentariosMap);
      }
    }

    fetchData();
  }, []);

  function abrirGuia(topico: Topico) {
    console.log("Abrindo guia:", topico);
    setGuiaSelecionado(topico);
    setModalAberto(true);
  }

  function fecharGuia() {
    setModalAberto(false);
    setGuiaSelecionado(null);
  }

  function marcarResposta(id: number, marcacao: "Erro" | "N/A") {
    setRespostas({
      ...respostas,
      [id]: {
        marcacao,
        comentario: respostas[id]?.comentario || "",
      },
    });
  }

  function setComentario(id: number, comentario: string) {
    setRespostas({
      ...respostas,
      [id]: {
        marcacao: respostas[id]?.marcacao || null,
        comentario,
      },
    });
  }

  function gerarRelatorio() {
    const linhas: string[] = [];

    topicos.forEach((topico) => {
      const resposta = respostas[topico.id];
      if (resposta?.marcacao) {
        const comentarioPadrao = comentariosPadrao[topico.topico] || "Comentário não encontrado.";
        const prefixo = resposta.marcacao === "Erro" ? "❌" : "🟡 N/A";

        let comentarioFinal = comentarioPadrao;

        if (resposta.comentario) {
          if (comentarioPadrao.includes(">")) {
            comentarioFinal = comentarioPadrao.replace(">", `(Obs: ${resposta.comentario})`);
          } else {
            comentarioFinal += `\n(Obs: ${resposta.comentario})`;
          }
        }

        linhas.push(`${prefixo} ${comentarioFinal}`);
      }
    });

    setRelatorio(linhas.join("\n\n"));
    setRelatorioGerado(true);
  }

  function limparChecklist() {
    setRespostas({});
    setRelatorio("");
    setRelatorioGerado(false);
    setNomeGC("");
    setChatId("");
  }
  console.log("modalAberto:", modalAberto, "guiaSelecionado:", guiaSelecionado);
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">✅ Checklist com Guia</h2>

      <button
        onClick={limparChecklist}
        className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        🧹 Limpar Tudo
      </button>

      {topicos.map((topico) => (
        <div key={topico.id} className="border rounded-lg mb-4 p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">{topico.topico}</h3>
            <button
  onClick={(e) => {
    // toggle: se já está aberto para este tópico, fecha
    if (guiaSelecionado?.id === topico.id) {
      fecharGuia();
      return;
    }

    abrirGuia(topico);
    setGuiaBtnRef(e.currentTarget);
  }}
  className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
>
  Ver guia
</button>


          </div>

          <div className="flex gap-4 mb-3">
            {["Erro", "N/A"].map((opcao) => (
              <label key={opcao}>
                <input
                  type="radio"
                  name={`marcacao-${topico.id}`}
                  value={opcao}
                  checked={respostas[topico.id]?.marcacao === opcao}
                  onChange={() => marcarResposta(topico.id, opcao as "Erro" | "N/A")}
                />
                <span className="ml-1">{opcao}</span>
              </label>
            ))}
          </div>

          {(respostas[topico.id]?.marcacao === "Erro" ||
            respostas[topico.id]?.marcacao === "N/A") && (
            <textarea
              placeholder="Comentário adicional (opcional)"
              className="w-full border rounded p-2"
              rows={3}
              value={respostas[topico.id]?.comentario || ""}
              onChange={(e) => setComentario(topico.id, e.target.value)}
            />
          )}
        </div>
      ))}

      <button
        onClick={gerarRelatorio}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4"
      >
        ✅ Gerar Relatório
      </button>

      {relatorioGerado && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">📝 Relatório Gerado</h4>
          <textarea
            className="w-full border rounded p-3 mb-4"
            rows={10}
            value={relatorio}
            onChange={(e) => setRelatorio(e.target.value)}
          />

          <div className="flex gap-4 mb-4">
            <input
              placeholder="Nome do GC"
              className="border rounded p-2 w-1/2"
              value={nomeGC}
              onChange={(e) => setNomeGC(e.target.value)}
            />
            <input
              placeholder="ID do Chat"
              className="border rounded p-2 w-1/2"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(relatorio);
              alert("📋 Relatório copiado para área de transferência!");
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Copiar Relatório
          </button>

          {/* Aqui futuramente adicionamos o botão de salvar histórico */}
        </div>
      )}

{modalAberto && guiaSelecionado && guiaBtnRef && (
  <GuidePopover
    titulo={guiaSelecionado.topico}
    descricao={guiaSelecionado.descricao}
    onClose={fecharGuia}
    referenceElement={guiaBtnRef}
  />
)}





      
    </div>
  );
}
