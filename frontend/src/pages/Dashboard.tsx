import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import MetricsOverview from "@/components/MetricsOverview";
import SalesPersonCard from "@/components/SalesPersonCard";
import TopRankingCards from "@/components/TopRankingCards";
import PerformanceIndicators from "@/components/PerformanceIndicators";
import PeriodSelector, { PeriodRange } from "@/components/PeriodSelector";
import { startOfMonth, endOfMonth } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { useDashboardData, DashboardData, Vendedor, Lead } from "@/hooks/useDashboardData";
import { useAutoSync } from "@/hooks/useAutoSync";
import SyncIndicator from "@/components/SyncIndicator";
import { AlertCircle } from "lucide-react";
import { GOOGLE_SHEETS_URL, SYNC_INTERVAL, IS_DEV } from "@/config/sheets";

/**
 * Interface para métrica de vendedor
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
}

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation() as any;
  const [sheetUrl, setSheetUrl] = useState<string | null>(GOOGLE_SHEETS_URL);
  const [showUrlInput, setShowUrlInput] = useState(!GOOGLE_SHEETS_URL || IS_DEV);
  const [urlInput, setUrlInput] = useState(GOOGLE_SHEETS_URL || "");
  const [period, setPeriod] = useState<PeriodRange>({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    type: "month",
    label: "Janeiro 2026",
  });

  // Busca dados do dashboard
  const { data: dashboardData, loading: dataLoading, error: dataError, refetch } = useDashboardData(sheetUrl);

  // Sincronização automática
  const syncStatus = useAutoSync(
    async () => {
      if (sheetUrl) {
        await refetch?.();
      }
    },
    SYNC_INTERVAL,
    !!sheetUrl
  );

  // Redireciona se não autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, loading]);

  // Processa dados para compatibilidade com componentes existentes
  const processedData = dashboardData ? {
    ...dashboardData,
    metrics: processVendedorMetrics(dashboardData.vendedores, dashboardData.leads),
    sdrMetrics: processSdrMetrics(dashboardData.vendedores, dashboardData.leads),
    topClosers: getTopClosers(dashboardData.vendedores, dashboardData.leads),
    topSdrs: getTopSdrs(dashboardData.vendedores, dashboardData.leads),
    totalCashCollected: dashboardData.cards.faturamentoTotal,
    totalLtvSales: dashboardData.cards.faturamentoTotal,
    totalGoal: dashboardData.vendedores.reduce((sum, v) => sum + v.meta_vendas, 0),
    avgConversionRate: dashboardData.cards.taxaConversao,
    avgChurnRate: 0,
    avgTicket: dashboardData.cards.faturamentoTotal / Math.max(dashboardData.cards.totalLeadsVendidos, 1),
    totalSales: dashboardData.cards.totalLeadsVendidos,
    periodType: period.type,
    startDate: period.startDate,
    endDate: period.endDate,
  } : null;

  const handleSetUrl = () => {
    if (urlInput.trim()) {
      setSheetUrl(urlInput.trim());
      setShowUrlInput(false);
      if (refetch) {
        refetch();
      }
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-white">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!sheetUrl) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Gráfico Geral</h1>
            <p className="text-slate-400">Monitoramento em tempo real de performance de vendas</p>
            <Separator className="mt-4 bg-amber-500/30" />
          </div>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
            <div className="flex gap-4 items-start">
              <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Configure a URL do Google Sheets</h3>
                <p className="text-slate-300 mb-4">Forneça a URL de exportação XLSX do seu Google Sheets.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="URL da Planilha"
                    className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded text-white"
                  />
                  <button onClick={handleSetUrl} className="px-6 py-2 bg-amber-500 text-black font-semibold rounded">Carregar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (dataError) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Gráfico Geral</h1>
            <p className="text-slate-400">Monitoramento em tempo real de performance de vendas</p>
            <Separator className="mt-4 bg-amber-500/30" />
          </div>
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <div className="flex gap-4 items-start">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Erro ao carregar dados</h3>
                <p className="text-slate-300 mb-4">{dataError}</p>
                <button onClick={() => setSheetUrl(null)} className="px-6 py-2 bg-amber-500 text-black font-semibold rounded">Tentar outra URL</button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!processedData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Erro ao processar dados</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Gráfico Geral</h1>
          <p className="text-slate-400">Monitoramento em tempo real de performance de vendas</p>
          <Separator className="mt-4 bg-amber-500/30" />
        </div>

        <div className="flex justify-between items-center">
          <div>{sheetUrl && <SyncIndicator status={syncStatus} />}</div>
          <button onClick={() => setShowUrlInput(!showUrlInput)} className="px-4 py-2 text-sm bg-slate-800 text-white rounded">Alterar URL</button>
        </div>

        {showUrlInput && (
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="URL da Planilha"
              className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded text-white"
            />
            <button onClick={handleSetUrl} className="px-6 py-2 bg-amber-500 text-black font-semibold rounded">Carregar</button>
          </div>
        )}

        <PeriodSelector currentPeriod={period} onPeriodChange={setPeriod} />

        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-amber-500">📊</span> Métricas Gerais do Período
          </h2>
          <Separator className="mb-6 bg-amber-500/30" />
          <MetricsOverview data={processedData} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-amber-500">🏆</span> Rankings de Performance
          </h2>
          <Separator className="mb-6 bg-amber-500/30" />
          <TopRankingCards topClosers={processedData.topClosers} topSdrs={processedData.topSdrs} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-amber-500">📈</span> Indicadores de Performance
          </h2>
          <Separator className="mb-6 bg-amber-500/30" />
          <PerformanceIndicators data={processedData} />
        </div>

        {/* Vendedores */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-amber-500">👥</span> Performance Individual - Closers
          </h2>
          <Separator className="mb-6 bg-amber-500/30" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedData.metrics.map((metric) => (
              <SalesPersonCard key={`closer-${metric.salespersonId}`} metric={metric} goal={metric.individualGoal} />
            ))}
          </div>
        </div>

        {/* SDRs */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-amber-500">📞</span> Performance Individual - SDRs
          </h2>
          <Separator className="mb-6 bg-amber-500/30" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedData.sdrMetrics.map((metric) => (
              <SalesPersonCard key={`sdr-${metric.salespersonId}`} metric={metric} goal={metric.individualGoal} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/**
 * Processa dados de vendedores para formato de métrica
 */
function processVendedorMetrics(vendedores: Vendedor[], leads: Lead[]): VendedorMetrica[] {
  return vendedores
    .filter(v => v.vendedor && v.vendedor.trim() !== "")
    .map((vendedor, index) => {
      const vendedorLeads = leads.filter(l => l.vendedor === vendedor.vendedor);
      const vendedorLeadsVendidos = vendedorLeads.filter(l => l.status === 'Implementado');
      const totalSales = vendedorLeadsVendidos.reduce((sum, l) => sum + l.valor_venda, 0);

      return {
        salespersonId: index + 1,
        name: vendedor.vendedor,
        email: `${vendedor.vendedor.toLowerCase().replace(/\s+/g, '.')}@lure.com`,
        individualGoal: vendedor.meta_vendas,
        totalSales,
        cashCollected: totalSales,
        ltvSales: totalSales,
        conversionRate: vendedorLeads.length > 0 ? (vendedorLeadsVendidos.length / vendedorLeads.length) * 100 : 0,
        churnRate: 0,
        averageTicket: vendedorLeadsVendidos.length > 0 ? totalSales / vendedorLeadsVendidos.length : 0,
        role: 'closer' as const,
      };
    });
}

/**
 * Processa dados de SDRs para formato de métrica
 */
function processSdrMetrics(vendedores: Vendedor[], leads: Lead[]): VendedorMetrica[] {
  const sdrMap = new Map<string, { totalLeads: number; leadsVendidos: number; faturamento: number; goal: number }>();
  
  // Coleta metas de SDR da aba vendedores
  vendedores.forEach(v => {
    if (v.sdr && v.sdr.trim() !== "") {
      const current = sdrMap.get(v.sdr) || { totalLeads: 0, leadsVendidos: 0, faturamento: 0, goal: 0 };
      current.goal = v.meta_vendas_sdr; // Assume que a meta está associada ao nome do SDR
      sdrMap.set(v.sdr, current);
    }
  });

  // Agrega dados de leads por SDR
  leads.forEach(lead => {
    if (lead.sdr && lead.sdr.trim() !== "") {
      const current = sdrMap.get(lead.sdr) || { totalLeads: 0, leadsVendidos: 0, faturamento: 0, goal: 0 };
      current.totalLeads++;
      if (lead.status === 'Implementado') {
        current.leadsVendidos++;
        current.faturamento += lead.valor_venda;
      }
      sdrMap.set(lead.sdr, current);
    }
  });

  return Array.from(sdrMap.entries()).map(([name, data], index) => ({
    salespersonId: index + 100,
    name: name,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@lure.com`,
    individualGoal: data.goal,
    totalSales: data.faturamento, // Para o gráfico individual, usamos faturamento
    cashCollected: data.faturamento,
    ltvSales: data.faturamento,
    conversionRate: data.totalLeads > 0 ? (data.leadsVendidos / data.totalLeads) * 100 : 0,
    churnRate: 0,
    averageTicket: data.leadsVendidos > 0 ? data.faturamento / data.leadsVendidos : 0,
    role: 'sdr' as const,
  }));
}

/**
 * Obtém top 3 closers
 */
function getTopClosers(vendedores: Vendedor[], leads: Lead[]) {
  const metrics = processVendedorMetrics(vendedores, leads);
  return metrics
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 3);
}

/**
 * Obtém top 3 SDRs (baseado em volume de leads gerados)
 */
function getTopSdrs(vendedores: Vendedor[], leads: Lead[]) {
  const sdrMetrics = processSdrMetrics(vendedores, leads);
  
  // Para o ranking de SDR, o critério costuma ser volume de leads (totalLeads)
  // Mas processSdrMetrics retorna faturamento em totalSales para o gráfico.
  // Vamos recalcular ou ajustar para o ranking.
  
  const rankingData = Array.from(sdrMetrics).map(m => {
    // Busca o total de leads original
    const sdrLeads = leads.filter(l => l.sdr === m.name).length;
    return {
      ...m,
      totalSales: sdrLeads // Sobrescreve para volume de leads no ranking
    };
  });

  return rankingData
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 3);
}
