import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PersonAvatar from "@/components/PersonAvatar";
import PeriodSelector, { PeriodRange } from "@/components/PeriodSelector";
import { startOfMonth, endOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useDashboardData, Vendedor, Lead } from "@/hooks/useDashboardData";
import { GOOGLE_SHEETS_URL } from "@/config/sheets";

/**
 * Interface de métrica
 */
interface VendedorMetrica {
  salespersonId: number;
  name: string;
  email: string;
  individualGoal: number;
  totalSales: number;
  cashCollected: number;
  ltvSales: number;
  conversionRate: number;
  churnRate: number;
  averageTicket: number;
  role: 'closer' | 'sdr';
  leads: Lead[];
}

const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#ec4899", "#06b6d4"];

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

export default function IndividualMetrics() {
  const { loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [period, setPeriod] = useState<PeriodRange>({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    type: "month",
    label: "Janeiro 2026",
  });

  const { data: dashboardData, loading: dataLoading } = useDashboardData(GOOGLE_SHEETS_URL);

  // Redireciona se não autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/");
    }
  }, [loading, isAuthenticated, setLocation]);

  // Processa todas as métricas (Closers e SDRs)
  const allMetrics = useMemo(() => {
    if (!dashboardData) return [];
    const closers = processVendedorMetrics(dashboardData.vendedores, dashboardData.leads);
    const sdrs = processSdrMetrics(dashboardData.vendedores, dashboardData.leads);
    return [...closers, ...sdrs];
  }, [dashboardData]);

  // Define automaticamente um ID válido no início
  useEffect(() => {
    if (allMetrics.length && selectedPersonId === null) {
      setSelectedPersonId(allMetrics[0].salespersonId);
    }
  }, [allMetrics, selectedPersonId]);

  const selectedMetric = useMemo(() => 
    allMetrics.find((m) => m.salespersonId === selectedPersonId),
    [allMetrics, selectedPersonId]
  );

  if (loading || dataLoading || !dashboardData || selectedPersonId === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-white">Carregando métricas...</p>
        </div>
      </div>
    );
  }

  if (!selectedMetric) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Dados do colaborador não encontrados</p>
      </div>
    );
  }

  /* =======================
     📊 DADOS PARA GRÁFICOS
     ======================= */

  const monthlyGoal = selectedMetric.individualGoal;
  const isSdr = selectedMetric.role === 'sdr';

  // 1. Gráfico de Progresso
  const progressData = [
    {
      name: "Mensal",
      Realizado: selectedMetric.totalSales,
      Meta: monthlyGoal,
    }
  ];

  // 2. Composição por Canal
  const canalData = Object.entries(
    selectedMetric.leads.reduce((acc, lead) => {
      const canal = lead.canal || "Não Informado";
      acc[canal] = (acc[canal] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // 3. Composição por Status
  const statusData = Object.entries(
    selectedMetric.leads.reduce((acc, lead) => {
      const status = lead.status || "Sem Status";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // 4. Composição por Origem
  const origemData = Object.entries(
    selectedMetric.leads.reduce((acc, lead) => {
      const origem = lead.origem || "Direto";
      acc[origem] = (acc[origem] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Gráfico Individual</h1>
          <p className="text-slate-400">Análise detalhada por colaborador</p>
          <Separator className="mt-4 bg-amber-500/30" />
        </div>

        <PeriodSelector currentPeriod={period} onPeriodChange={setPeriod} />

        {/* Seletor de Colaborador */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Selecione um Colaborador</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {allMetrics.map((person) => (
              <button
                key={person.salespersonId}
                onClick={() => setSelectedPersonId(person.salespersonId)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedPersonId === person.salespersonId
                    ? "bg-amber-500 border-amber-500 text-black"
                    : "bg-slate-800 border-slate-700 text-white hover:border-amber-500/50"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <PersonAvatar name={person.name} size="sm" />
                  <span className="text-xs font-bold truncate w-full text-center">{person.name}</span>
                  <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${
                    selectedPersonId === person.salespersonId ? "bg-black/20" : "bg-slate-700 text-slate-400"
                  }`}>
                    {person.role}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Header do Colaborador Selecionado */}
        <Card className="bg-slate-900 border-slate-800 p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <PersonAvatar name={selectedMetric.name} size="xl" />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white">{selectedMetric.name}</h2>
              <p className="text-slate-400 mt-1">Meta Individual: {formatCurrency(selectedMetric.individualGoal)}</p>
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                {selectedMetric.totalSales >= selectedMetric.individualGoal ? (
                  <span className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                    ✓ Meta Atingida
                  </span>
                ) : (
                  <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                    ⚠ Em progresso
                  </span>
                )}
                <span className="bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full text-sm font-bold">
                  {selectedMetric.role.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-500 uppercase font-bold">Total de Vendas</p>
                <p className="text-xl font-bold text-amber-500">{formatCurrencyAbbr(selectedMetric.totalSales)}</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-500 uppercase font-bold">Cash Collect</p>
                <p className="text-xl font-bold text-emerald-500">{formatCurrencyAbbr(selectedMetric.cashCollected)}</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-500 uppercase font-bold">LTV Sales</p>
                <p className="text-xl font-bold text-blue-500">{formatCurrencyAbbr(selectedMetric.ltvSales)}</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-500 uppercase font-bold">Ticket Médio</p>
                <p className="text-xl font-bold text-purple-500">{formatCurrencyAbbr(selectedMetric.averageTicket)}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Grid de Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de Progresso */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Progresso por Período</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => formatCurrencyAbbr(v)} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                    formatter={(v: any) => formatCurrency(v)}
                  />
                  <Legend />
                  <Bar dataKey="Realizado" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Meta" fill="#475569" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Composição de Vendas (Status) */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Composição por Status</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Composição por Canal */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Vendas por Canal</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={canalData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {canalData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Composição por Origem */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Vendas por Origem</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={origemData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                  <Bar dataKey="value" fill="#3b82f6" name="Leads" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

/**
 * Funções de Processamento (Igual ao Dashboard para consistência)
 */
function processVendedorMetrics(vendedores: Vendedor[], leads: Lead[]): VendedorMetrica[] {
  return vendedores
    .filter(v => v.vendedor && v.vendedor.trim() !== "")
    .map((vendedor, index) => {
      const vendedorLeads = leads.filter(l => l.vendedor === vendedor.vendedor);
      const vendidos = vendedorLeads.filter(l => l.status === 'Implementado');
      const totalSales = vendidos.reduce((sum, l) => sum + l.valor_venda, 0);

      return {
        salespersonId: index + 1,
        name: vendedor.vendedor,
        email: `${vendedor.vendedor.toLowerCase().replace(/\s+/g, '.')}@lure.com`,
        individualGoal: vendedor.meta_vendas,
        totalSales,
        cashCollected: totalSales,
        ltvSales: totalSales,
        conversionRate: vendedorLeads.length > 0 ? (vendidos.length / vendedorLeads.length) * 100 : 0,
        churnRate: 0,
        averageTicket: vendidos.length > 0 ? totalSales / vendidos.length : 0,
        role: 'closer' as const,
        leads: vendedorLeads
      };
    });
}

function processSdrMetrics(vendedores: Vendedor[], leads: Lead[]): VendedorMetrica[] {
  const sdrMap = new Map<string, { leads: Lead[]; goal: number }>();
  
  vendedores.forEach(v => {
    if (v.sdr && v.sdr.trim() !== "") {
      const current = sdrMap.get(v.sdr) || { leads: [], goal: 0 };
      current.goal = v.meta_vendas_sdr;
      sdrMap.set(v.sdr, current);
    }
  });

  leads.forEach(lead => {
    if (lead.sdr && lead.sdr.trim() !== "") {
      const current = sdrMap.get(lead.sdr) || { leads: [], goal: 0 };
      current.leads.push(lead);
      sdrMap.set(lead.sdr, current);
    }
  });

  return Array.from(sdrMap.entries()).map(([name, data], index) => {
    const vendidos = data.leads.filter(l => l.status === 'Implementado');
    const totalSales = vendidos.reduce((sum, l) => sum + l.valor_venda, 0);

    return {
      salespersonId: index + 100,
      name: name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@lure.com`,
      individualGoal: data.goal,
      totalSales: totalSales,
      cashCollected: totalSales,
      ltvSales: totalSales,
      conversionRate: data.leads.length > 0 ? (vendidos.length / data.leads.length) * 100 : 0,
      churnRate: 0,
      averageTicket: vendidos.length > 0 ? totalSales / vendidos.length : 0,
      role: 'sdr' as const,
      leads: data.leads
    };
  });
}
