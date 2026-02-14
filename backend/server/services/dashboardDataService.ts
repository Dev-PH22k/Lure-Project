import { sheetsService, SheetData, Lead, Campanha, Vendedor, Parametro } from './sheetsService';

/**
 * Interface para cards agregados do dashboard
 */
export interface DashboardCards {
  totalLeads: number;
  totalLeadsVendidos: number;
  taxaConversao: number; // percentual
  faturamentoTotal: number;
}

/**
 * Interface para o retorno completo do dashboard
 */
export interface DashboardData {
  cards: DashboardCards;
  leads: Lead[];
  campanhas: Campanha[];
  vendedores: Vendedor[];
  parametros: Parametro[];
  timestamp: string;
}

/**
 * Serviço responsável pelo processamento e agregação de dados do dashboard
 * Utiliza o SheetsService para ler dados e aplica lógica de negócio
 */
class DashboardDataService {
  /**
   * Calcula os cards agregados baseado nos dados de leads
   */
  private calculateCards(leads: Lead[]): DashboardCards {
    const totalLeads = leads.length;
    
    // Leads com status "vendido" ou similar
    const leadsVendidos = leads.filter(lead => 
      lead.status && lead.status.toLowerCase().includes('implementado')
    ).length;

    // Taxa de conversão em percentual
    const taxaConversao = totalLeads > 0 
      ? Math.round((leadsVendidos / totalLeads) * 100 * 100) / 100 
      : 0;

    // Faturamento total (soma de valor_venda dos leads vendidos)
    const faturamentoTotal = leads
      .filter(lead => lead.status && lead.status.toLowerCase().includes('implementado'))
      .reduce((sum, lead) => sum + (lead.valor_venda || 0), 0);

    return {
      totalLeads,
      totalLeadsVendidos: leadsVendidos,
      taxaConversao,
      faturamentoTotal,
    };
  }

  /**
   * Processa dados do Google Sheets e retorna dados agregados do dashboard
   */
  async processDashboardData(sheetUrl: string): Promise<DashboardData> {
    try {
      console.log('[DashboardDataService] Iniciando processamento de dados');

      // Faz download e leitura do arquivo
      const sheetData: SheetData = await sheetsService.downloadAndRead(sheetUrl);

      // Calcula cards agregados
      const cards = this.calculateCards(sheetData.leads);

      // Monta resposta completa
      const dashboardData: DashboardData = {
        cards,
        leads: sheetData.leads,
        campanhas: sheetData.campanhas,
        vendedores: sheetData.vendedores,
        parametros: sheetData.parametros,
        timestamp: new Date().toISOString(),
      };

      console.log('[DashboardDataService] Processamento concluído com sucesso');
      console.log(`  - Total de leads: ${cards.totalLeads}`);
      console.log(`  - Leads vendidos: ${cards.totalLeadsVendidos}`);
      console.log(`  - Taxa de conversão: ${cards.taxaConversao}%`);
      console.log(`  - Faturamento total: R$ ${cards.faturamentoTotal.toFixed(2)}`);

      return dashboardData;
    } catch (error) {
      console.error('[DashboardDataService] Erro ao processar dados:', error);
      throw error;
    }
  }

  /**
   * Retorna dados agregados por vendedor
   */
  getLeadsByVendedor(leads: Lead[]): Record<string, Lead[]> {
    return leads.reduce((acc, lead) => {
      const vendedor = lead.vendedor || 'Sem vendedor';
      if (!acc[vendedor]) {
        acc[vendedor] = [];
      }
      acc[vendedor].push(lead);
      return acc;
    }, {} as Record<string, Lead[]>);
  }

  /**
   * Retorna dados agregados por campanha
   */
  getLeadsByCampanha(leads: Lead[]): Record<string, Lead[]> {
    return leads.reduce((acc, lead) => {
      const campanha = lead.campanha || 'Sem campanha';
      if (!acc[campanha]) {
        acc[campanha] = [];
      }
      acc[campanha].push(lead);
      return acc;
    }, {} as Record<string, Lead[]>);
  }

  /**
   * Retorna dados agregados por status
   */
  getLeadsByStatus(leads: Lead[]): Record<string, Lead[]> {
    return leads.reduce((acc, lead) => {
      const status = lead.status || 'Sem status';
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(lead);
      return acc;
    }, {} as Record<string, Lead[]>);
  }

  /**
   * Calcula performance por vendedor
   */
  getVendedorPerformance(leads: Lead[], vendedores: Vendedor[]): Array<{
    vendedor: string;
    totalLeads: number;
    leadsVendidos: number;
    faturamento: number;
    metaVendas: number;
    percentualMeta: number;
  }> {
    const vendedorMap = new Map(vendedores.map(v => [v.vendedor, v.meta_vendas]));
    const leadsByVendedor = this.getLeadsByVendedor(leads);

    return Object.entries(leadsByVendedor).map(([vendedor, vendedorLeads]) => {
      const leadsVendidos = vendedorLeads.filter(l => 
        l.status && l.status.toLowerCase().includes('implementado')
      ).length;

      const faturamento = vendedorLeads
        .filter(l => l.status && l.status.toLowerCase().includes('implementado'))
        .reduce((sum, l) => sum + (l.valor_venda || 0), 0);

      const metaVendas = vendedorMap.get(vendedor) || 0;
      const percentualMeta = metaVendas > 0 
        ? Math.round((faturamento / metaVendas) * 100 * 100) / 100 
        : 0;

      return {
        vendedor,
        totalLeads: vendedorLeads.length,
        leadsVendidos,
        faturamento,
        metaVendas,
        percentualMeta,
      };
    });
  }

  /**
   * Calcula performance por campanha
   */
  getCampanhaPerformance(leads: Lead[], campanhas: Campanha[]): Array<{
    campanha: string;
    totalLeads: number;
    leadsVendidos: number;
    faturamento: number;
    orcamento: number;
    metaLeads: number;
    percentualMetaLeads: number;
    roiOrcamento: number;
  }> {
    const campanhaMap = new Map(campanhas.map(c => [c.campanha, { orcamento: c.orcamento, metaLeads: c.meta_leads }]));
    const leadsByCampanha = this.getLeadsByCampanha(leads);

    return Object.entries(leadsByCampanha).map(([campanha, campanhaLeads]) => {
      const leadsVendidos = campanhaLeads.filter(l => 
        l.status && l.status.toLowerCase().includes('implementado')
      ).length;

      const faturamento = campanhaLeads
        .filter(l => l.status && l.status.toLowerCase().includes('implementado'))
        .reduce((sum, l) => sum + (l.valor_venda || 0), 0);

      const campanhaData = campanhaMap.get(campanha) || { orcamento: 0, metaLeads: 0 };
      const percentualMetaLeads = campanhaData.metaLeads > 0 
        ? Math.round((campanhaLeads.length / campanhaData.metaLeads) * 100 * 100) / 100 
        : 0;

      const roiOrcamento = campanhaData.orcamento > 0 
        ? Math.round(((faturamento - campanhaData.orcamento) / campanhaData.orcamento) * 100 * 100) / 100 
        : 0;

      return {
        campanha,
        totalLeads: campanhaLeads.length,
        leadsVendidos,
        faturamento,
        orcamento: campanhaData.orcamento,
        metaLeads: campanhaData.metaLeads,
        percentualMetaLeads,
        roiOrcamento,
      };
    });
  }
}

// Exporta uma instância única do serviço (singleton)
export const dashboardDataService = new DashboardDataService();
