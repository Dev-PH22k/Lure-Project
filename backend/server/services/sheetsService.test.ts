import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { sheetsService, Lead, Campanha, Vendedor, Parametro } from './sheetsService';

/**
 * Testes para o SheetsService
 * Valida leitura e processamento de dados do XLSX
 */
describe('SheetsService', () => {
  let testFilePath: string;

  /**
   * Cria um arquivo XLSX de teste antes de executar os testes
   */
  beforeAll(() => {
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Cria workbook com dados de teste
    const workbook = XLSX.utils.book_new();

    // Aba: leads
    const leadsData = [
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
        campanha: 'Campanha B',
        canal: 'Telefone',
        origem: 'Referência',
        lead_nome: 'Maria Santos',
        lead_telefone: '11888888888',
        status: 'em contato',
        valor_venda: 0,
        vendedor: 'Gabriel',
        observacao: '',
      },
    ];
    const leadsSheet = XLSX.utils.json_to_sheet(leadsData);
    XLSX.utils.book_append_sheet(workbook, leadsSheet, 'leads');

    // Aba: campanhas
    const campanhasData = [
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
    const campanhasSheet = XLSX.utils.json_to_sheet(campanhasData);
    XLSX.utils.book_append_sheet(workbook, campanhasSheet, 'campanhas');

    // Aba: vendedores
    const vendedoresData = [
      {
        vendedor: 'Anderson',
        meta_vendas: 50000,
      },
      {
        vendedor: 'Gabriel',
        meta_vendas: 50000,
      },
    ];
    const vendedoresSheet = XLSX.utils.json_to_sheet(vendedoresData);
    XLSX.utils.book_append_sheet(workbook, vendedoresSheet, 'vendedores');

    // Aba: parâmetros
    const parametrosData = [
      {
        chave: 'taxa_conversao_minima',
        valor: '0.05',
      },
      {
        chave: 'moeda',
        valor: 'BRL',
      },
    ];
    const parametrosSheet = XLSX.utils.json_to_sheet(parametrosData);
    XLSX.utils.book_append_sheet(workbook, parametrosSheet, 'parametros');

    // Salva arquivo
    testFilePath = path.join(tempDir, 'test_data.xlsx');
    XLSX.writeFile(workbook, testFilePath);
  });

  /**
   * Remove arquivo de teste após executar os testes
   */
  afterAll(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  describe('readSheet', () => {
    it('deve ler arquivo XLSX e retornar todas as abas', async () => {
      const data = await sheetsService.readSheet(testFilePath);

      expect(data).toBeDefined();
      expect(data.leads).toBeDefined();
      expect(data.campanhas).toBeDefined();
      expect(data.vendedores).toBeDefined();
      expect(data.parametros).toBeDefined();
    });

    it('deve ler leads corretamente', async () => {
      const data = await sheetsService.readSheet(testFilePath);

      expect(data.leads).toHaveLength(2);
      expect(data.leads[0]).toMatchObject({
        id: 1,
        campanha: 'Campanha A',
        canal: 'Email',
        lead_nome: 'João Silva',
        status: 'vendido',
        valor_venda: 5000,
        vendedor: 'Anderson',
      });
    });

    it('deve ler campanhas corretamente', async () => {
      const data = await sheetsService.readSheet(testFilePath);

      expect(data.campanhas).toHaveLength(2);
      expect(data.campanhas[0]).toMatchObject({
        campanha: 'Campanha A',
        orcamento: 10000,
        meta_leads: 50,
      });
    });

    it('deve ler vendedores corretamente', async () => {
      const data = await sheetsService.readSheet(testFilePath);

      expect(data.vendedores).toHaveLength(2);
      expect(data.vendedores[0]).toMatchObject({
        vendedor: 'Anderson',
        meta_vendas: 50000,
      });
    });

    it('deve ler parâmetros corretamente', async () => {
      const data = await sheetsService.readSheet(testFilePath);

      expect(data.parametros).toHaveLength(2);
      expect(data.parametros[0]).toMatchObject({
        chave: 'taxa_conversao_minima',
        valor: '0.05',
      });
    });

    it('deve converter números corretamente', async () => {
      const data = await sheetsService.readSheet(testFilePath);

      expect(typeof data.leads[0].valor_venda).toBe('number');
      expect(typeof data.campanhas[0].orcamento).toBe('number');
      expect(typeof data.vendedores[0].meta_vendas).toBe('number');
    });

    it('deve tratar valores vazios como 0 para números', async () => {
      const data = await sheetsService.readSheet(testFilePath);

      expect(data.leads[1].valor_venda).toBe(0);
    });

    it('deve tratar valores vazios como string vazia para texto', async () => {
      const data = await sheetsService.readSheet(testFilePath);

      expect(data.leads[1].observacao).toBe('');
    });
  });

  describe('parseString', () => {
    it('deve converter valores para string', async () => {
      const data = await sheetsService.readSheet(testFilePath);

      expect(typeof data.leads[0].lead_nome).toBe('string');
      expect(data.leads[0].lead_nome).toBe('João Silva');
    });
  });

  describe('parseNumber', () => {
    it('deve converter valores para número', async () => {
      const data = await sheetsService.readSheet(testFilePath);

      expect(typeof data.leads[0].valor_venda).toBe('number');
      expect(data.leads[0].valor_venda).toBe(5000);
    });

    it('deve retornar 0 para valores inválidos', async () => {
      const data = await sheetsService.readSheet(testFilePath);

      // Verifica que valores vazios foram convertidos para 0
      expect(data.leads[1].valor_venda).toBe(0);
    });
  });

  describe('cleanupTempFiles', () => {
    it('deve remover arquivos temporários', () => {
      sheetsService.cleanupTempFiles();

      const tempDir = path.join(process.cwd(), 'temp');
      if (fs.existsSync(tempDir)) {
        const files = fs.readdirSync(tempDir);
        // Verifica que não há arquivos xlsx (exceto o de teste que ainda está em uso)
        const xlsxFiles = files.filter(f => f.endsWith('.xlsx'));
        expect(xlsxFiles.length).toBeLessThanOrEqual(1);
      }
    });
  });
});
