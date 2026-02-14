import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Target, BarChart3 } from "lucide-react";

interface MetricsOverviewProps {
  data: {
    totalCashCollected: number;
    totalLtvSales: number;
    totalGoal: number;
    totalSales: number;
  };
}

export default function MetricsOverview({ data }: MetricsOverviewProps) {
  const metrics = [
    {
      title: "Total de Cash Collect",
      value: `R$ ${(data.totalCashCollected / 1000).toFixed(1)}k`,
      icon: DollarSign,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Total de Venda LTV",
      value: `R$ ${(data.totalLtvSales / 1000).toFixed(1)}k`,
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Meta Geral",
      value: `R$ ${(data.totalGoal / 1000).toFixed(1)}k`,
      icon: Target,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Total de Vendas",
      value: `R$ ${(data.totalSales / 1000).toFixed(1)}k`,
      icon: BarChart3,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="bg-slate-900 border-slate-800 hover:border-amber-500/30 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">{metric.title}</CardTitle>
              <div className={`${metric.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
              <p className="text-xs text-slate-500 mt-1">Período atual</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
