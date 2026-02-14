import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Zap, Users, Activity } from "lucide-react";

interface PerformanceIndicatorsProps {
  data: {
    avgConversionRate: number;
    avgChurnRate: number;
    avgTicket: number;
    totalSales: number;
  };
}

export default function PerformanceIndicators({ data }: PerformanceIndicatorsProps) {
  const indicators = [
    {
      title: "Taxa de Conversão Média",
      value: `${data.avgConversionRate}%`,
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      trend: "↑",
    },
    {
      title: "Taxa de Churn Média",
      value: `${data.avgChurnRate}%`,
      icon: Activity,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      trend: "↓",
    },
    {
      title: "Ticket Médio",
      value: `R$ ${(data.avgTicket / 1000).toFixed(1)}k`,
      icon: Zap,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
      trend: "→",
    },
    {
      title: "Total de Vendas",
      value: `R$ ${(data.totalSales / 1000).toFixed(1)}k`,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      trend: "↑",
    },
  ];

  const chartData = [
    { name: "Jan", value: 45000 },
    { name: "Fev", value: 52000 },
    { name: "Mar", value: 48000 },
    { name: "Abr", value: 61000 },
    { name: "Mai", value: 55000 },
    { name: "Jun", value: data.totalSales },
  ];

  return (
    <div className="space-y-6">
      {/* Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {indicators.map((indicator, index) => {
          const Icon = indicator.icon;
          return (
            <Card key={index} className="bg-slate-900 border-slate-800 hover:border-amber-500/30 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">{indicator.title}</CardTitle>
                <div className={`${indicator.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${indicator.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${indicator.color}`}>{indicator.value}</div>
                <p className="text-xs text-slate-500 mt-1">Tendência: {indicator.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráfico de Tendência */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Tendência de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  formatter={(value: any) => `R$ ${((value as number) / 1000).toFixed(1)}k`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: "#f59e0b", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
