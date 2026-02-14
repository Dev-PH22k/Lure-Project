import axios from 'axios';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface para tipagem dos dados de leads
 */
export interface Lead {
  id: number;
  data: string | Date;
  campanha: string;
  canal: string;
  origem: string;
  lead_nome: string;
  lead_telefone: string;
  status: string;
  valor_venda: number;
  vendedor: string;
  sdr: string;
  observacao: string;
}

/**
 * Interface para tipagem dos dados de campanhas
 */
export interface Campanha {
  campanha: string;
  orcamento: number;
  meta_leads: number;
}

/**
 * Interface para tipagem dos dados de vendedores
 */
export interface Vendedor {
  vendedor: string;
  meta_vendas: number;
  sdr: string;
  meta_vendas_sdr: number;
}

/**
 * Interface para tipagem dos parâmetros
 */
export interface Parametro {
  chave: string;
  valor: string;
}

/**
 * Interface para o retorno completo dos dados da planilha
 */
export interface SheetData {
  leads: Lead[];
  campanhas: Campanha[];
  vendedores: Vendedor[];
  parametros: Parametro[];
}

/**
 * Serviço responsável pelo download e leitura de dados do Google Sheets
 * Suporta múltiplas abas e conversão para JSON mantendo nomes de colunas originais
 */
class SheetsService {
  private tempDir = path.join(process.cwd(), 'temp');

  /**
   * Garante que o diretório temporário existe
   */
  private ensureTempDir(): void {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  /**
   * Faz o download do arquivo XLSX do Google Sheets via URL
   * @param sheetUrl - URL do Google Sheets exportado como XLSX
   * @returns Caminho do arquivo baixado
   */
  async downloadSheet(sheetUrl: string): Promise<string> {
    this.ensureTempDir();

    const fileName = `lure_dashboard_${Date.now()}.xlsx`;
    const filePath = path.join(this.tempDir, fileName);

    try {
      console.log(`[SheetsService] Iniciando download de: ${sheetUrl}`);
      
      const response = await axios.get(sheetUrl, {
        responseType: 'arraybuffer',
        timeout: 30000, // 30 segundos de timeout
      });

      fs.writeFileSync(filePath, response.data);
      console.log(`[SheetsService] Arquivo baixado com sucesso: ${filePath}`);

      return filePath;
    } catch (error) {
      console.error('[SheetsService] Erro ao fazer download:', error);
      throw new Error(`Falha ao fazer download do arquivo: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Lê um arquivo XLSX e extrai dados de todas as abas
   * @param filePath - Caminho do arquivo XLSX
   * @returns Objeto contendo dados de todas as abas
   */
  async readSheet(filePath: string): Promise<SheetData> {
    try {
      console.log(`[SheetsService] Lendo arquivo: ${filePath}`);

      const fileBuffer = fs.readFileSync(filePath);
      const workbook = XLSX.read(fileBuffer, { cellDates: true });

      console.log(`[SheetsService] Abas encontradas: ${workbook.SheetNames.join(', ')}`);

      const sheetData: SheetData = {
        leads: this.readSheet_Leads(workbook),
        campanhas: this.readSheet_Campanhas(workbook),
        vendedores: this.readSheet_Vendedores(workbook),
        parametros: this.readSheet_Parametros(workbook),
      };

      console.log(`[SheetsService] Dados lidos com sucesso`);
      console.log(`  - Leads: ${sheetData.leads.length}`);
      console.log(`  - Campanhas: ${sheetData.campanhas.length}`);
      console.log(`  - Vendedores: ${sheetData.vendedores.length}`);
      console.log(`  - Parâmetros: ${sheetData.parametros.length}`);

      return sheetData;
    } catch (error) {
      console.error('[SheetsService] Erro ao ler arquivo:', error);
      throw new Error(`Falha ao ler arquivo XLSX: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Lê a aba "leads" e converte para array de objetos
   */
  private readSheet_Leads(workbook: XLSX.WorkBook): Lead[] {
    const sheetName = 'leads';
    if (!workbook.Sheets[sheetName]) {
      console.warn(`[SheetsService] Aba "${sheetName}" não encontrada`);
      return [];
    }

    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    return rawData.map((row: any, index: number) => ({
      id: this.parseNumber(row.id) || index + 1,
      data: this.parseDate(row.data),
      campanha: this.parseString(row.campanha),
      canal: this.parseString(row.canal),
      origem: this.parseString(row.origem),
      lead_nome: this.parseString(row.lead_nome),
      lead_telefone: this.parseString(row.lead_telefone),
      status: this.parseString(row.status),
      valor_venda: this.parseNumber(row.valor_venda),
      vendedor: this.parseString(row.vendedor),
      sdr: this.parseString(row.sdr || row.SDR),
      observacao: this.parseString(row.observacao),
    }));
  }

  /**
   * Lê a aba "campanhas" e converte para array de objetos
   */
  private readSheet_Campanhas(workbook: XLSX.WorkBook): Campanha[] {
    const sheetName = 'campanhas';
    if (!workbook.Sheets[sheetName]) {
      console.warn(`[SheetsService] Aba "${sheetName}" não encontrada`);
      return [];
    }

    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    return rawData.map((row: any) => ({
      campanha: this.parseString(row.campanha),
      orcamento: this.parseNumber(row.orcamento),
      meta_leads: this.parseNumber(row.meta_leads),
    }));
  }

  /**
   * Lê a aba "vendedores" e converte para array de objetos
   */
  private readSheet_Vendedores(workbook: XLSX.WorkBook): Vendedor[] {
    const sheetName = 'vendedores';
    if (!workbook.Sheets[sheetName]) {
      console.warn(`[SheetsService] Aba "${sheetName}" não encontrada`);
      return [];
    }

    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    return rawData.map((row: any) => ({
      vendedor: this.parseString(row.vendedor),
      meta_vendas: this.parseNumber(row.meta_vendas),
      sdr: this.parseString(row.sdr || row.SDR),
      meta_vendas_sdr: this.parseNumber(row.meta_vendas_sdr || row.meta_vendas_sd),
    }));
  }

  /**
   * Lê a aba "parâmetros" e converte para array de objetos
   */
  private readSheet_Parametros(workbook: XLSX.WorkBook): Parametro[] {
    const sheetName = 'parametros';
    if (!workbook.Sheets[sheetName]) {
      console.warn(`[SheetsService] Aba "${sheetName}" não encontrada`);
      return [];
    }

    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    return rawData.map((row: any) => ({
      chave: this.parseString(row.chave),
      valor: this.parseString(row.valor),
    }));
  }

  /**
   * Utilitário para converter valores para string, tratando vazios como ""
   */
  private parseString(value: any): string {
    if (value === null || value === undefined || value === '') return '';
    return String(value).trim();
  }

  /**
   * Utilitário para converter valores para número, tratando vazios como 0
   */
  private parseNumber(value: any): number {
    if (value === null || value === undefined || value === '') return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }

  /**
   * Utilitário para converter valores para data
   */
  private parseDate(value: any): string | Date {
    if (value === null || value === undefined || value === '') return new Date();
    
    // Se já é uma data, retorna como string ISO
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }

    // Tenta converter string para data
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }

    return new Date().toISOString().split('T')[0];
  }

  /**
   * Limpa arquivos temporários
   */
  cleanupTempFiles(): void {
    try {
      if (fs.existsSync(this.tempDir)) {
        const files = fs.readdirSync(this.tempDir);
        files.forEach(file => {
          const filePath = path.join(this.tempDir, file);
          fs.unlinkSync(filePath);
        });
        console.log('[SheetsService] Arquivos temporários removidos');
      }
    } catch (error) {
      console.error('[SheetsService] Erro ao limpar arquivos temporários:', error);
    }
  }

  /**
   * Faz download e lê o arquivo em uma única operação
   */
  async downloadAndRead(sheetUrl: string): Promise<SheetData> {
    const filePath = await this.downloadSheet(sheetUrl);
    const data = await this.readSheet(filePath);
    this.cleanupTempFiles();
    return data;
  }
}

// Exporta uma instância única do serviço (singleton)
export const sheetsService = new SheetsService();
