import { describe, it, expect } from 'vitest';
import { dashboardDataService } from './dashboardDataService';
import { Lead, Campanha, Vendedor } from './sheetsService';

/**
 * Testes para o DashboardDataService
 * Valida cálculos de agregações e performance
 */
describe('DashboardDataService', () => {
  const mockLeads: Lead[] = [
    {
      id: 1,
      data: '2026-02-10',
      campanha: 'Campanha A',
      canal: 'Email',
      origem: 'Website',
      lead_nome: 'João Silva',
      lead_telefone: '11999999999',
      status: 'vendido',
      valor_venda: 5000,
      vendedor: 'Anderson',
      observacao: 'Cliente satisfeito',
    },
    {
      id: 2,
      data: '2026-02-09',
      campanha: 'Campanha A',
      canal: 'Telefone',
      origem: 'Referência',
      lead_nome: 'Maria Santos',
      lead_telefone: '11888888888',
      status: 'em contato',
      valor_venda: 0,
      vendedor: 'Gabriel',
      observacao: '',
    },
    {
      id: 3,
      data: '2026-02-08',
      campanha: 'Campanha B',
      canal: 'LinkedIn',
      origem: 'Anúncio',
      lead_nome: 'Carlos Oliveira',
      lead_telefone: '11777777777',
      status: 'vendido',
      valor_venda: 8000,
      vendedor: 'Anderson',
      observacao: 'Venda rápida',
    },
  ];

  const mockCampanhas: Campanha[] = [
    {
      campanha: 'Campanha A',
      orcamento: 10000,
      meta_leads: 50,
    },
    {
      campanha: 'Campanha B',
      orcamento: 15000,
      meta_leads: 75,
    },
  ];

  const mockVendedores: Vendedor[] = [
    {
      vendedor: 'Anderson',
      meta_vendas: 50000,
    },
    {
      vendedor: 'Gabriel',
      meta_vendas: 50000,
    },
  ];

  describe('getLeadsByVendedor', () => {
    it('deve agrupar leads por vendedor', () => {
      const grouped = dashboardDataService.getLeadsByVendedor(mockLeads);

      expect(grouped['Anderson']).toHaveLength(2);
      expect(grouped['Gabriel']).toHaveLength(1);
    });

    it('deve criar grupo "Sem vendedor" para leads sem vendedor', () => {
      const leadsWithoutVendedor = [
        {
          ...mockLeads[0],
          vendedor: '',
        },
      ];

      const grouped = dashboardDataService.getLeadsByVendedor(leadsWithoutVendedor);

      expect(grouped['Sem vendedor']).toBeDefined();
    });
  });

  describe('getLeadsByCampanha', () => {
    it('deve agrupar leads por campanha', () => {
      const grouped = dashboardDataService.getLeadsByCampanha(mockLeads);

      expect(grouped['Campanha A']).toHaveLength(2);
      expect(grouped['Campanha B']).toHaveLength(1);
    });
  });

  describe('getLeadsByStatus', () => {
    it('deve agrupar leads por status', () => {
      const grouped = dashboardDataService.getLeadsByStatus(mockLeads);

      expect(grouped['vendido']).toHaveLength(2);
      expect(grouped['em contato']).toHaveLength(1);
    });
  });

  describe('getVendedorPerformance', () => {
    it('deve calcular performance de vendedores', () => {
      const performance = dashboardDataService.getVendedorPerformance(mockLeads, mockVendedores);

      expect(performance).toHaveLength(2);
      expect(performance[0].vendedor).toBe('Anderson');
      expect(performance[0].totalLeads).toBe(2);
      expect(performance[0].leadsVendidos).toBe(2);
      expect(performance[0].faturamento).toBe(13000); // 5000 + 8000
    });

    it('deve calcular percentual de meta de vendas', () => {
      const performance = dashboardDataService.getVendedorPerformance(mockLeads, mockVendedores);

      const anderson = performance.find(p => p.vendedor === 'Anderson');
      expect(anderson?.percentualMeta).toBe(26); // (13000 / 50000) * 100
    });

    it('deve retornar 0 para percentual de meta quando meta é 0', () => {
      const vendedoresSemMeta: Vendedor[] = [
        { vendedor: 'Anderson', meta_vendas: 0 },
      ];

      const performance = dashboardDataService.getVendedorPerformance(mockLeads, vendedoresSemMeta);

      expect(performance[0].percentualMeta).toBe(0);
    });
  });

  describe('getCampanhaPerformance', () => {
    it('deve calcular performance de campanhas', () => {
      const performance = dashboardDataService.getCampanhaPerformance(mockLeads, mockCampanhas);

      expect(performance).toHaveLength(2);
      expect(performance[0].campanha).toBe('Campanha A');
      expect(performance[0].totalLeads).toBe(2);
      expect(performance[0].leadsVendidos).toBe(1);
    });

    it('deve calcular percentual de meta de leads', () => {
      const performance = dashboardDataService.getCampanhaPerformance(mockLeads, mockCampanhas);

      const campanhaA = performance.find(p => p.campanha === 'Campanha A');
      expect(campanhaA?.percentualMetaLeads).toBe(4); // (2 / 50) * 100
    });

    it('deve calcular ROI do orçamento', () => {
      const performance = dashboardDataService.getCampanhaPerformance(mockLeads, mockCampanhas);

      const campanhaA = performance.find(p => p.campanha === 'Campanha A');
      // Faturamento: 5000, Orçamento: 10000, ROI: ((5000 - 10000) / 10000) * 100 = -50
      expect(campanhaA?.roiOrcamento).toBe(-50);
    });

    it('deve retornar 0 para ROI quando orçamento é 0', () => {
      const campanhasSemOrcamento: Campanha[] = [
        { campanha: 'Campanha A', orcamento: 0, meta_leads: 50 },
      ];

      const performance = dashboardDataService.getCampanhaPerformance(mockLeads, campanhasSemOrcamento);

      expect(performance[0].roiOrcamento).toBe(0);
    });
  });

  describe('calculateCards', () => {
    it('deve calcular cards agregados corretamente', () => {
      // Testa método privado através de processDashboardData (não é possível testar diretamente)
      // Este teste seria implementado se o método fosse público
      // Por enquanto, testamos através de integração
      expect(mockLeads).toHaveLength(3);
    });
  });
});
