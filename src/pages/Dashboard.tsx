const monitoriasPorMes = [
  { mes: "Jan", quantidade: 32 },
  { mes: "Fev", quantidade: 28 },
  { mes: "Mar", quantidade: 35 },
  { mes: "Abr", quantidade: 30 },
  { mes: "Mai", quantidade: 34 },
  { mes: "Jun", quantidade: 36 },
];

const kpasMaisPontuadas = [
  { nome: "Eficiência de Atendimento", pontuacao: 9.6 },
  { nome: "Resolução no Primeiro Contato", pontuacao: 9.3 },
  { nome: "Postura e Comunicação", pontuacao: 9.1 },
];

const agentesMaisPontuados = [
  { nome: "Ana Souza", pontuacao: 9.7, monitorias: 14 },
  { nome: "Carlos Lima", pontuacao: 9.5, monitorias: 16 },
  { nome: "Juliana Alves", pontuacao: 9.4, monitorias: 12 },
];

const metas = [
  {
    titulo: "Monitorias no mês",
    meta: 140,
    valorAtual: 112,
    detalhe: "Meta mensal de avaliações",
  },
  {
    titulo: "Monitorias no dia",
    meta: 8,
    valorAtual: 6,
    detalhe: "Meta diária para manter o ritmo",
  },
];

const cardsResumo = [
  {
    titulo: "Monitorias no mês",
    valor: "112",
    variacao: "+8% vs último mês",
    icone: "📊",
    cor: "bg-blue-100 text-blue-700",
  },
  {
    titulo: "KPA médio",
    valor: "9,3",
    variacao: "+0,2 ponto",
    icone: "📈",
    cor: "bg-purple-100 text-purple-700",
  },
  {
    titulo: "Meta diária",
    valor: "6 / 8",
    variacao: "2 restantes hoje",
    icone: "🎯",
    cor: "bg-amber-100 text-amber-700",
  },
  {
    titulo: "Agentes avaliados",
    valor: "24",
    variacao: "+5 nesta semana",
    icone: "🧑‍💻",
    cor: "bg-emerald-100 text-emerald-700",
  },
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
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
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
              <p className="text-xl font-semibold text-blue-600">{item.pontuacao.toFixed(1)}</p>
              <p className="text-xs text-gray-500">pontuação</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const maiorQuantidade = Math.max(...monitoriasPorMes.map((item) => item.quantidade));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-600">Visão geral</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
            Dashboard de Qualidade
          </h1>
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
            <span className="text-sm font-medium text-blue-600">+12% trimestre</span>
          </div>

          <div className="mt-2 grid grid-cols-6 gap-3 items-end">
            {monitoriasPorMes.map((item) => (
              <div key={item.mes} className="flex flex-col gap-2">
                <div className="h-32 bg-gray-100 rounded-xl flex items-end justify-center p-2">
                  <div
                    className="w-9 rounded-lg bg-gradient-to-t from-blue-600 to-blue-400 shadow-inner"
                    style={{ height: `${(item.quantidade / maiorQuantidade) * 100}%` }}
                    aria-label={`${item.quantidade} monitorias em ${item.mes}`}
                  />
                </div>
                <div className="text-center text-sm font-medium text-gray-700">{item.mes}</div>
                <div className="text-center text-xs text-gray-500">{item.quantidade} mon.</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Metas</h3>
            <span className="text-sm text-gray-500">Atualizado hoje</span>
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
    </div>
  );
}
