import { Card } from "@/components/ui/card";
import PersonAvatar from "@/components/PersonAvatar";
import { Trophy } from "lucide-react";
import { useMemo } from "react";

interface SalesMetricData {
  salespersonId: number;
  name: string;
  totalSales: number;
  cashCollected: number;
  ltvSales: number;
  conversionRate: number;
  churnRate: number;
  averageTicket: number;
  role: "closer" | "sdr";
  individualGoal?: number;
}

interface TopRankingCardsProps {
  topClosers: SalesMetricData[];
  topSdrs: SalesMetricData[];
}

const medalEmojis = ["🥇", "🥈", "🥉"];

const quips = {
  top1: [
    "Esse tá voando!!",
    "Fora da estratosfera! 🚀",
    "Deixou a concorrência no pó!",
    "Tá quebrando tudo!",
    "Esse é o GOAT! 🐐",
    "Voando alto demais!",
    "Ninguém chega perto!",
    "Tá em outro nível!",
    "Esse é imparável!",
    "Campeão demais!",
    "Tá queimando a pista!",
    "Esse é o rei!",
    "Fora do comum!",
    "Tá na zona!",
    "Esse é lendário!",
  ],
  top2: [
    "Nem fede e nem cheira",
    "Tá na cola do primeiro!",
    "Bem pertinho do topo!",
    "Tá firme e forte!",
    "Bora subir mais um degrau!",
    "Tá no caminho certo!",
    "Quase lá no topo!",
    "Tá mandando bem!",
    "Segura essa posição!",
    "Tá crescendo!",
    "Tá na reta final!",
    "Tá pegando ritmo!",
    "Bora alcançar o topo!",
    "Tá no meio do caminho!",
    "Tá evoluindo bem!",
  ],
  top3: [
    "Como é a visão dai debaixo?",
    "Tá chegando lá!",
    "Pódio garantido!",
    "Tá no jogo!",
    "Bora subir mais!",
    "Tá na luta!",
    "Tá crescendo!",
    "Tá no caminho!",
    "Tá pegando velocidade!",
    "Bora bombar!",
    "Tá evoluindo!",
    "Tá na disputa!",
    "Tá firme!",
    "Tá no ritmo!",
    "Tá ganhando espaço!",
  ],
};

function getDayIndex(): number {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (24 * 60 * 60 * 1000)
  );
  return dayOfYear % 15;
}

/**
 * Formata valor abreviado (ex: R$ 10k)
 */
const formatCurrencyAbbr = (value: number) => {
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)}k`;
  }
  return `R$ ${value.toFixed(0)}`;
};

export default function TopRankingCards({ topClosers, topSdrs }: TopRankingCardsProps) {
  const dayIndex = useMemo(() => getDayIndex(), []);
  const todayQuips = useMemo(
    () => ({
      top1: quips.top1[dayIndex],
      top2: quips.top2[dayIndex],
      top3: quips.top3[dayIndex],
    }),
    [dayIndex]
  );

  const RankingSection = ({ title, data, icon }: { title: string; data: SalesMetricData[]; icon: React.ReactNode }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-amber-500/30">
        {icon}
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>

      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-slate-500 text-sm py-4 text-center">Nenhum dado disponível</p>
        ) : (
          data.map((person, index) => {
            const quip = index === 0 ? todayQuips.top1 : index === 1 ? todayQuips.top2 : todayQuips.top3;
            // Para SDR o totalSales é o volume de leads, para Closer é o faturamento
            const isSdr = person.role === "sdr";
            const displayValue = isSdr ? person.totalSales : formatCurrencyAbbr(person.totalSales);
            const valueLabel = isSdr ? "Leads Gerados" : "Total de Vendas";
            
            // Meta para barra de progresso
            const goal = person.individualGoal || (isSdr ? 50 : 75000); // Fallback se não houver meta
            const progress = Math.min((person.totalSales / goal) * 100, 100);

            return (
              <div
                key={`${person.role}-${person.salespersonId}-${person.name}`}
                className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-4 border border-slate-700 hover:border-amber-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{medalEmojis[index] || "🏅"}</div>
                    <PersonAvatar name={person.name} size="md" />
                    <div>
                      <p className="font-bold text-white">{person.name}</p>
                      <p className="text-xs text-amber-400 italic">{quip}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-amber-500">{displayValue}</p>
                    <p className="text-xs text-slate-400">{valueLabel}</p>
                  </div>
                </div>

                {/* Barra de progresso */}
                <div className="mt-3 bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                {/* Métricas adicionais */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-700">
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Cash Collect</p>
                    <p className="text-sm font-bold text-green-400">{formatCurrencyAbbr(person.cashCollected)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Conversão</p>
                    <p className="text-sm font-bold text-blue-400">{person.conversionRate.toFixed(1)}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Ticket Médio</p>
                    <p className="text-sm font-bold text-purple-400">{formatCurrencyAbbr(person.averageTicket)}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <Card className="bg-slate-900 border-slate-800 p-8">
      <div className="flex items-center gap-3 mb-2 pb-3 border-b-2 border-amber-500/30">
        <Trophy className="h-8 w-8 text-amber-500" />
        <h2 className="text-3xl font-bold text-white">Rankings de Performance</h2>
      </div>
      <p className="text-xs text-slate-400 mb-8 ml-11">Trocadilho do dia muda a cada 24h ✨</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RankingSection
          title="Top Closers"
          data={topClosers}
          icon={<div className="text-2xl">🎯</div>}
        />
        <RankingSection
          title="Top SDRs"
          data={topSdrs}
          icon={<div className="text-2xl">📞</div>}
        />
      </div>
    </Card>
  );
}
