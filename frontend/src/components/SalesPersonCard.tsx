import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SalesPersonCardProps {
  metric: {
    salespersonId: number;
    name: string;
    totalSales: number;
    cashCollected: number;
    ltvSales: number;
    conversionRate: number;
    churnRate: number;
    averageTicket: number;
  };
  goal: number;
}

/**
 * Formata valor para moeda brasileira
 */
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Formata valor abreviado (ex: R$ 10k)
 */
const formatCurrencyAbbr = (value: number) => {
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)}k`;
  }
  return `R$ ${value.toFixed(0)}`;
};

export default function SalesPersonCard({ metric, goal }: SalesPersonCardProps) {
  const performancePercentage = goal > 0 ? Math.round((metric.totalSales / goal) * 100) : 0;
  const isAboveGoal = metric.totalSales >= goal && goal > 0;
  const statusColor = isAboveGoal ? "text-emerald-500" : "text-red-500";
  const statusBg = isAboveGoal ? "bg-emerald-500/10" : "bg-red-500/10";

  const chartData = [
    {
      name: "Meta",
      value: goal,
    },
    {
      name: "Realizado",
      value: metric.totalSales,
    },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-amber-500/30 transition-colors overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-white">{metric.name}</CardTitle>
            <p className="text-xs text-slate-500 mt-1">ID: {metric.salespersonId}</p>
          </div>
          <div className={`${statusBg} px-3 py-1 rounded-full`}>
            <span className={`text-sm font-bold ${statusColor}`}>{performancePercentage}%</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Chart */}
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
                formatter={(value: any) => formatCurrency(value as number)}
              />
              <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
          <div>
            <p className="text-xs text-slate-500">Cash Collect</p>
            <p className="text-sm font-bold text-amber-500">{formatCurrencyAbbr(metric.cashCollected)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Venda LTV</p>
            <p className="text-sm font-bold text-blue-500">{formatCurrencyAbbr(metric.ltvSales)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Taxa Conversão</p>
            <p className="text-sm font-bold text-emerald-500">{metric.conversionRate.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Ticket Médio</p>
            <p className="text-sm font-bold text-violet-500">{formatCurrencyAbbr(metric.averageTicket)}</p>
          </div>
        </div>

        {/* Status Bar */}
        <div className="pt-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-500">Progresso da Meta</span>
            <span className={`text-xs font-bold ${statusColor}`}>
              {formatCurrencyAbbr(metric.totalSales)} / {formatCurrencyAbbr(goal)}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isAboveGoal ? "bg-emerald-500" : "bg-red-500"}`}
              style={{ width: `${Math.min(performancePercentage, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
