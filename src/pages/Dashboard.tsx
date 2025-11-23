// ...existing code...
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface HistoryItem {
  id: number;
  data: string; // ISO date string
  atendente?: string;
  contato_id?: string;
  relatorio?: string;
  usuario_id?: string;
  // optional field if KPAs were persisted as JSON/object
  kpas?: Record<string, number>;
  pontuacao?: number;
}

const DEFAULT_KPAS = [
  { nome: "Eficiência de Atendimento", pontuacao: 9.6 },
  { nome: "Resolução no Primeiro Contato", pontuacao: 9.3 },
  { nome: "Postura e Comunicação", pontuacao: 9.1 },
];

function BarraProgresso({ valor, meta }: { valor: number; meta: number }) {
  const percentual = Math.min((valor / meta) * 100, 100);

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-600">
        <span>{valor} concluídas</span>
        <span>{meta} meta</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-linear-to-r from-blue-500 to-blue-600"
          style={{ width: `${percentual}%` }}
        />
      </div>
    </div>
  );
}

function ListaPontuacoes({
  titulo,
  dados,
}: {
  titulo: string;
  dados: { nome: string; pontuacao: number; monitorias?: number }[];
}) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>
        <span className="text-sm text-gray-500">Últimos 30 dias</span>
      </div>
      <div className="space-y-3">
        {dados.map((item) => (
          <div
            key={item.nome}
            className="flex items-center justify-between rounded-xl border border-gray-100 p-3"
          >
            <div>
              <p className="font-medium text-gray-900">{item.nome}</p>
              {item.monitorias && (
                <p className="text-xs text-gray-500">{item.monitorias} monitorias</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-blue-600">
                {Number.isFinite(item.pontuacao) ? item.pontuacao.toFixed(1) : "—"}
              </p>
              <p className="text-xs text-gray-500">pontuação</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [monitoriasPorMes, setMonitoriasPorMes] = useState<
    { mes: string; quantidade: number }[]
  >([]);
  const [kpasMaisPontuadas, setKpasMaisPontuadas] = useState<
    { nome: string; pontuacao: number }[]
  >(DEFAULT_KPAS);
  const [agentesMaisPontuados, setAgentesMaisPontuados] = useState<
    { nome: string; pontuacao: number; monitorias?: number }[]
  >([]);
  const [recentReports, setRecentReports] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      try {
        const {
          data: userData,
        } = await supabase.auth.getUser();
        const userId = (userData as any)?.user?.id ?? null;

        const { data, error } = await supabase
          .from("history")
          .select("*")
          .eq("usuario_id", userId)
          .order("data", { ascending: false });

        if (error) {
          console.error("Erro ao buscar histórico:", error);
          setHistory([]);
          return;
        }

        const items = (data ?? []) as HistoryItem[];
        setHistory(items);

        // Monitorias por mês (últimos 6 meses)
        const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const today = new Date();
        const lastSix = [];
        for (let i = 5; i >= 0; i--) {
          const dt = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const mesIndex = dt.getMonth();
          const quantidade = items.filter((it) => {
            const d = new Date(it.data);
            return !isNaN(d.getTime()) && d.getMonth() === mesIndex && d.getFullYear() === dt.getFullYear();
          }).length;
          lastSix.push({ mes: months[mesIndex], quantidade });
        }
        setMonitoriasPorMes(lastSix);

        // Top agentes por número de monitorias
        const agenteMap: Record<string, { count: number; totalScore: number; scored: number }> = {};
        items.forEach((it) => {
          const nome = it.atendente?.trim() || "Desconhecido";
          if (!agenteMap[nome]) agenteMap[nome] = { count: 0, totalScore: 0, scored: 0 };
          agenteMap[nome].count += 1;
          // if pontuacao or kpas were saved, try to extract an overall score
          if (typeof it.pontuacao === "number") {
            agenteMap[nome].totalScore += it.pontuacao;
            agenteMap[nome].scored += 1;
          } else if (it.kpas && typeof it.kpas === "object") {
            const vals = Object.values(it.kpas).filter((v) => typeof v === "number") as number[];
            if (vals.length) {
              agenteMap[nome].totalScore += vals.reduce((a, b) => a + b, 0) / vals.length;
              agenteMap[nome].scored += 1;
            }
          }
        });
        const topAgentes = Object.entries(agenteMap)
          .map(([nome, v]) => ({
            nome,
            monitorias: v.count,
            pontuacao: v.scored ? v.totalScore / v.scored : 0,
          }))
          .sort((a, b) => b.monitorias - a.monitorias)
          .slice(0, 6);
        setAgentesMaisPontuados(topAgentes);

        // KPAs agregadas (se existirem no histórico)
        const kpaAcc: Record<string, { total: number; count: number }> = {};
        items.forEach((it) => {
          if (it.kpas && typeof it.kpas === "object") {
            Object.entries(it.kpas).forEach(([k, v]) => {
              if (typeof v === "number") {
                if (!kpaAcc[k]) kpaAcc[k] = { total: 0, count: 0 };
                kpaAcc[k].total += v;
                kpaAcc[k].count += 1;
              }
            });
          }
        });
        const kpaList = Object.entries(kpaAcc)
          .map(([nome, v]) => ({ nome, pontuacao: v.total / v.count }))
          .sort((a, b) => b.pontuacao - a.pontuacao)
          .slice(0, 6);
        if (kpaList.length) setKpasMaisPontuadas(kpaList);
        else setKpasMaisPontuadas(DEFAULT_KPAS);

        // Relatórios recentes
        setRecentReports(items.slice(0, 5));
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const maiorQuantidade =
    monitoriasPorMes.length > 0 ? Math.max(...monitoriasPorMes.map((item) => item.quantidade), 1) : 1;

  const currentMonthCount = monitoriasPorMes.length ? monitoriasPorMes[monitoriasPorMes.length - 1].quantidade : 0;
  const currentDayCount = history.filter((it) => {
    const d = new Date(it.data);
    const today = new Date();
    return (
      !isNaN(d.getTime()) &&
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  }).length;

  const uniqueAgentes = Array.from(new Set(history.map((h) => (h.atendente || "Desconhecido").trim()))).length;
  const kpaMedia =
    kpasMaisPontuadas.length > 0
      ? kpasMaisPontuadas.reduce((a, b) => a + b.pontuacao, 0) / kpasMaisPontuadas.length
      : 0;

  const metas = [
    {
      titulo: "Monitorias no mês",
      meta: 140,
      valorAtual: currentMonthCount,
      detalhe: "Meta mensal de avaliações",
    },
    {
      titulo: "Monitorias no dia",
      meta: 8,
      valorAtual: currentDayCount,
      detalhe: "Meta diária para manter o ritmo",
    },
  ];

  const cardsResumo = [
    {
      titulo: "Monitorias no mês",
      valor: String(currentMonthCount),
      variacao: loading ? "carregando..." : `${currentMonthCount >= 0 ? "+/-" : ""}`,
      icone: "📊",
      cor: "bg-blue-100 text-blue-700",
    },
    {
      titulo: "KPA médio",
      valor: kpaMedia ? kpaMedia.toFixed(1) : "—",
      variacao: "+0,2 ponto",
      icone: "📈",
      cor: "bg-purple-100 text-purple-700",
    },
    {
      titulo: "Meta diária",
      valor: `${currentDayCount} / 8`,
      variacao: `${Math.max(0, 8 - currentDayCount)} restantes hoje`,
      icone: "🎯",
      cor: "bg-amber-100 text-amber-700",
    },
    {
      titulo: "Agentes avaliados",
      valor: String(uniqueAgentes),
      variacao: "+0 nesta semana",
      icone: "🧑‍💻",
      cor: "bg-emerald-100 text-emerald-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-600">Visão geral</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">Dashboard de Qualidade</h1>
          <p className="text-gray-600 mt-1">
            Acompanhe as métricas principais de monitoria e resultados do time.
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors">
          Exportar relatório
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cardsResumo.map((card) => (
          <div
            key={card.titulo}
            className="rounded-2xl bg-white shadow-sm border border-gray-100 p-4 flex items-center gap-4"
          >
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl ${card.cor}`}>
              <span aria-hidden>{card.icone}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.titulo}</p>
              <p className="text-2xl font-semibold text-gray-900">{card.valor}</p>
              <p className="text-xs text-emerald-600 font-medium">{card.variacao}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monitorias por mês</h3>
              <p className="text-sm text-gray-500">Quantidade concluída em cada mês</p>
            </div>
            <span className="text-sm font-medium text-blue-600">últimos 6 meses</span>
          </div>

          <div className="mt-2 grid grid-cols-6 gap-3 items-end">
            {monitoriasPorMes.length === 0 ? (
              <div className="col-span-6 text-center text-sm text-gray-500">Sem dados</div>
            ) : (
              monitoriasPorMes.map((item) => (
                <div key={item.mes} className="flex flex-col gap-2">
                  <div className="h-32 bg-gray-100 rounded-xl flex items-end justify-center p-2">
                    <div
                      className="w-9 rounded-lg bg-linear-to-t from-blue-600 to-blue-400 shadow-inner"
                      style={{ height: `${(item.quantidade / maiorQuantidade) * 100}%` }}
                      aria-label={`${item.quantidade} monitorias em ${item.mes}`}
                    />
                  </div>
                  <div className="text-center text-sm font-medium text-gray-700">{item.mes}</div>
                  <div className="text-center text-xs text-gray-500">{item.quantidade} mon.</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Metas</h3>
            <span className="text-sm text-gray-500">Atualizado agora</span>
          </div>

          <div className="space-y-4">
            {metas.map((meta) => (
              <div key={meta.titulo} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{meta.detalhe}</p>
                    <p className="text-lg font-semibold text-gray-900">{meta.titulo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-blue-600">{meta.valorAtual}</p>
                    <p className="text-xs text-gray-500">Meta {meta.meta}</p>
                  </div>
                </div>
                <BarraProgresso valor={meta.valorAtual} meta={meta.meta} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ListaPontuacoes titulo="KPAs mais pontuadas" dados={kpasMaisPontuadas} />
        <ListaPontuacoes titulo="Agentes mais pontuados" dados={agentesMaisPontuados} />
      </div>

      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Relatórios recentes</h3>
          <span className="text-sm text-gray-500">Últimos 5</span>
        </div>

        <div className="space-y-3">
          {recentReports.length === 0 ? (
            <p className="text-sm text-gray-500">Sem relatórios recentes.</p>
          ) : (
            recentReports.map((r) => (
              <div key={r.id} className="rounded-xl border border-gray-100 p-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{r.atendente || "Desconhecido"}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(r.data).toLocaleString()} • {r.contato_id || ""}
                    </p>
                    {r.relatorio && (
                      <p className="mt-2 text-sm text-gray-700 line-clamp-3">{r.relatorio}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <button
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => {
                        navigator.clipboard?.writeText(r.relatorio || "");
                      }}
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
// ...existing code...