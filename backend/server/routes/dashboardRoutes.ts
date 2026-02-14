import { Router, Request, Response } from 'express';
import { dashboardController } from '../controllers/dashboardController';

/**
 * Rotas Express para endpoints do dashboard
 * Integração com Google Sheets e processamento de dados
 */
const router = Router();

/**
 * GET /api/dashboard
 * Retorna dados agregados do dashboard
 * Query params: sheetUrl (obrigatório), skipCache (opcional)
 */
router.get('/dashboard', (req: Request, res: Response) => {
  dashboardController.getDashboard(req, res);
});

/**
 * GET /api/dashboard/vendedores
 * Retorna performance de cada vendedor
 * Query params: sheetUrl (obrigatório)
 */
router.get('/dashboard/vendedores', (req: Request, res: Response) => {
  dashboardController.getVendedorPerformance(req, res);
});

/**
 * GET /api/dashboard/campanhas
 * Retorna performance de cada campanha
 * Query params: sheetUrl (obrigatório)
 */
router.get('/dashboard/campanhas', (req: Request, res: Response) => {
  dashboardController.getCampanhaPerformance(req, res);
});

/**
 * GET /api/dashboard/leads
 * Retorna lista de leads com filtros opcionais
 * Query params: sheetUrl (obrigatório), vendedor, campanha, status (opcionais)
 */
router.get('/dashboard/leads', (req: Request, res: Response) => {
  dashboardController.getLeads(req, res);
});

/**
 * GET /api/dashboard/cache/status
 * Retorna status do cache
 */
router.get('/dashboard/cache/status', (req: Request, res: Response) => {
  dashboardController.getCacheStatus(req, res);
});

/**
 * POST /api/dashboard/cache/clear
 * Limpa o cache manualmente
 */
router.post('/dashboard/cache/clear', (req: Request, res: Response) => {
  dashboardController.clearCacheEndpoint(req, res);
});

export default router;
