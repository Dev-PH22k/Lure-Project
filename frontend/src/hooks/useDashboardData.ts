import { useState, useEffect, useCallback } from 'react';

/**
 * Interface para dados de um lead
 */
export interface Lead {
  id: number;
  data: string;
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
 * Interface para dados de uma campanha
 */
export interface Campanha {
  campanha: string;
  orcamento: number;
  meta_leads: number;
}

/**
 * Interface para dados de um vendedor
 */
export interface Vendedor {
  vendedor: string;
  meta_vendas: number;
  sdr: string;
  meta_vendas_sdr: number;
}

/**
 * Interface para parâmetros
 */
export interface Parametro {
  chave: string;
  valor: string;
}

/**
 * Interface para cards agregados
 */
export interface DashboardCards {
  totalLeads: number;
  totalLeadsVendidos: number;
  taxaConversao: number;
  faturamentoTotal: number;
}

/**
 * Interface para dados completos do dashboard
 */
export interface DashboardData {
  cards: DashboardCards;
  leads: Lead[];
  campanhas: Campanha[];
  vendedores: Vendedor[];
  parametros: Parametro[];
  timestamp: string;
  fromCache?: boolean;
}

/**
 * Define a URL base da API.
 */
const getApiBaseUrl = () => {
  if (typeof window !== "undefined" && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return "https://lure-project.onrender.com";
};


/**
 * Hook customizado para buscar dados do dashboard
 */
export const useDashboardData = (sheetUrl: string | null) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!sheetUrl) {
      setError('URL da planilha não fornecida');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/dashboard?sheetUrl=${encodeURIComponent(sheetUrl)}`);

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Se não for JSON, usa o status
        }
        throw new Error(errorMessage);
      }

      const dashboardData: DashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [sheetUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook para buscar performance de vendedores
 */
export const useVendedorPerformance = (sheetUrl: string | null) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sheetUrl) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl = getApiBaseUrl();
        const response = await fetch(`${baseUrl}/api/dashboard/vendedores?sheetUrl=${encodeURIComponent(sheetUrl)}`);

        if (!response.ok) {
          throw new Error(`Erro ${response.status}`);
        }

        const vendedorData = await response.json();
        setData(vendedorData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sheetUrl]);

  return { data, loading, error };
};

/**
 * Hook para buscar performance de campanhas
 */
export const useCampanhaPerformance = (sheetUrl: string | null) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sheetUrl) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl = getApiBaseUrl();
        const response = await fetch(`${baseUrl}/api/dashboard/campanhas?sheetUrl=${encodeURIComponent(sheetUrl)}`);

        if (!response.ok) {
          throw new Error(`Erro ${response.status}`);
        }

        const campanhaData = await response.json();
        setData(campanhaData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sheetUrl]);

  return { data, loading, error };
};
