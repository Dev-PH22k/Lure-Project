import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal } from "lucide-react";

interface TopThreeRankingProps {
  topThree: Array<{
    salespersonId: number;
    name: string;
    totalSales: number;
  }>;
}

export default function TopThreeRanking({ topThree }: TopThreeRankingProps) {
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Medal className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-white">Top 3 Vendedores</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topThree.map((person, index) => (
            <div key={person.salespersonId} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="text-3xl">{medals[index]}</div>
              <div className="flex-1">
                <p className="font-bold text-white">{person.name}</p>
                <p className="text-sm text-slate-400">Posição #{index + 1}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-amber-500">R$ {(person.totalSales / 1000).toFixed(1)}k</p>
                <p className="text-xs text-slate-400">Total de Vendas</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
