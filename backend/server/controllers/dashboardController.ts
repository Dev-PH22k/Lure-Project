import { Request, Response } from 'express';
import { dashboardDataService, DashboardData } from '../services/dashboardDataService';

/**
 * Controller responsável pelos endpoints do dashboard
 * Gerencia requisições e respostas relacionadas aos dados do dashboard
 */
class DashboardController {
  /**
   * Cache de dados para evitar múltiplos downloads
   * Em produção, considere usar Redis ou similar
   */
  private cache: {
    data: DashboardData | null;
    timestamp: number;
    ttl: number; // Time to live em ms (padrão: 5 minutos)
  } = {
    data: null,
    timestamp: 0,
    ttl: 5 * 60 * 1000, // 5 minutos
  };

  /**
   * GET /api/dashboard
   * Retorna dados agregados do dashboard
   * 
   * Query params:
   * - sheetUrl: URL do Google Sheets exportado como XLSX (obrigatório)
   * - skipCache: boolean para ignorar cache (padrão: false)
   * 
   * Response:
   * {
   *   cards: { totalLeads, totalLeadsVendidos, taxaConversao, faturamentoTotal },
   *   leads: [],
   *   campanhas: [],
   *   vendedores: [],
   *   parametros: [],
   *   timestamp: ISO string
   * }
   */
  async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const { sheetUrl, skipCache } = req.query;

      // Valida URL obrigatória
      if (!sheetUrl || typeof sheetUrl !== 'string') {
        res.status(400).json({
          error: 'Parâmetro "sheetUrl" é obrigatório e deve ser uma string',
          example: '/api/dashboard?sheetUrl=https://docs.google.com/spreadsheets/export?id=...&format=xlsx',
        });
        return;
      }

      console.log(`[DashboardController] GET /api/dashboard - URL: ${sheetUrl.substring(0, 50)}...`);

      // Verifica se deve usar cache
      const shouldUseCache = !skipCache && this.isCacheValid();

      if (shouldUseCache && this.cache.data) {
        console.log('[DashboardController] Retornando dados do cache');
        res.json({
          ...this.cache.data,
          fromCache: true,
        });
        return;
      }

      // Processa dados do Google Sheets
      console.log('[DashboardController] Processando dados do Google Sheets');
      const dashboardData = await dashboardDataService.processDashboardData(sheetUrl);

      // Atualiza cache
      this.cache.data = dashboardData;
      this.cache.timestamp = Date.now();

      res.json({
        ...dashboardData,
        fromCache: false,
      });
    } catch (error) {
      console.error('[DashboardController] Erro ao buscar dados do dashboard:', error);
      res.status(500).json({
        error: 'Erro ao processar dados do dashboard',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * GET /api/dashboard/vendedores
   * Retorna performance de cada vendedor
   */
  async getVendedorPerformance(req: Request, res: Response): Promise<void> {
    try {
      const { sheetUrl } = req.query;

      if (!sheetUrl || typeof sheetUrl !== 'string') {
        res.status(400).json({
          error: 'Parâmetro "sheetUrl" é obrigatório',
        });
        return;
      }

      console.log('[DashboardController] GET /api/dashboard/vendedores');

      const dashboardData = await dashboardDataService.processDashboardData(sheetUrl);
      const performance = dashboardDataService.getVendedorPerformance(
        dashboardData.leads,
        dashboardData.vendedores
      );

      res.json({
        vendedores: performance,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[DashboardController] Erro ao buscar performance de vendedores:', error);
      res.status(500).json({
        error: 'Erro ao processar dados de vendedores',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * GET /api/dashboard/campanhas
   * Retorna performance de cada campanha
   */
  async getCampanhaPerformance(req: Request, res: Response): Promise<void> {
    try {
      const { sheetUrl } = req.query;

      if (!sheetUrl || typeof sheetUrl !== 'string') {
        res.status(400).json({
          error: 'Parâmetro "sheetUrl" é obrigatório',
        });
        return;
      }

      console.log('[DashboardController] GET /api/dashboard/campanhas');

      const dashboardData = await dashboardDataService.processDashboardData(sheetUrl);
      const performance = dashboardDataService.getCampanhaPerformance(
        dashboardData.leads,
        dashboardData.campanhas
      );

      res.json({
        campanhas: performance,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[DashboardController] Erro ao buscar performance de campanhas:', error);
      res.status(500).json({
        error: 'Erro ao processar dados de campanhas',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * GET /api/dashboard/leads
   * Retorna lista de leads com filtros opcionais
   */
  async getLeads(req: Request, res: Response): Promise<void> {
    try {
      const { sheetUrl, vendedor, campanha, status } = req.query;

      if (!sheetUrl || typeof sheetUrl !== 'string') {
        res.status(400).json({
          error: 'Parâmetro "sheetUrl" é obrigatório',
        });
        return;
      }

      console.log('[DashboardController] GET /api/dashboard/leads');

      const dashboardData = await dashboardDataService.processDashboardData(sheetUrl);
      let leads = dashboardData.leads;

      // Aplica filtros se fornecidos
      if (vendedor && typeof vendedor === 'string') {
        leads = leads.filter(l => l.vendedor === vendedor);
      }
      if (campanha && typeof campanha === 'string') {
        leads = leads.filter(l => l.campanha === campanha);
      }
      if (status && typeof status === 'string') {
        leads = leads.filter(l => l.status === status);
      }

      res.json({
        total: leads.length,
        leads,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[DashboardController] Erro ao buscar leads:', error);
      res.status(500).json({
        error: 'Erro ao processar leads',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Verifica se o cache ainda é válido
   */
  private isCacheValid(): boolean {
    if (!this.cache.data) return false;
    const age = Date.now() - this.cache.timestamp;
    return age < this.cache.ttl;
  }

  /**
   * Limpa o cache manualmente
   */
  clearCache(): void {
    this.cache.data = null;
    this.cache.timestamp = 0;
    console.log('[DashboardController] Cache limpo');
  }

  /**
   * GET /api/dashboard/cache/status
   * Retorna status do cache
   */
  getCacheStatus(req: Request, res: Response): void {
    const isValid = this.isCacheValid();
    const age = Date.now() - this.cache.timestamp;

    res.json({
      isCached: isValid,
      age: age,
      ttl: this.cache.ttl,
      hasData: this.cache.data !== null,
    });
  }

  /**
   * POST /api/dashboard/cache/clear
   * Limpa o cache
   */
  clearCacheEndpoint(req: Request, res: Response): void {
    this.clearCache();
    res.json({ message: 'Cache limpo com sucesso' });
  }
}

// Exporta uma instância única do controller (singleton)
export const dashboardController = new DashboardController();
