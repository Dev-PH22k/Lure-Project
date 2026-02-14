import { format, subMonths, subWeeks, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

export interface SalesMetricData {
  salespersonId: number;
  name: string;
  totalSales: number;
  cashCollected: number;
  ltvSales: number;
  conversionRate: number;
  churnRate: number;
  averageTicket: number;
  role: "closer" | "sdr";
}

// Dados históricos para cada colaborador por mês
const historicalMetrics: Record<string, Record<string, SalesMetricData>> = {
  "2025-12": {
    "1": { salespersonId: 1, name: "Anderson", totalSales: 58000, cashCollected: 55000, ltvSales: 78000, conversionRate: 30, churnRate: 6, averageTicket: 2400, role: "closer" },
    "2": { salespersonId: 2, name: "Gabriel", totalSales: 42000, cashCollected: 40000, ltvSales: 65000, conversionRate: 25, churnRate: 9, averageTicket: 2000, role: "closer" },
    "3": { salespersonId: 3, name: "Joao Vitor", totalSales: 68000, cashCollected: 65000, ltvSales: 90000, conversionRate: 36, churnRate: 4, averageTicket: 2700, role: "closer" },
    "4": { salespersonId: 4, name: "Felipe", totalSales: 40000, cashCollected: 38000, ltvSales: 62000, conversionRate: 24, churnRate: 11, averageTicket: 1900, role: "closer" },
    "5": { salespersonId: 5, name: "Gustavo", totalSales: 48000, cashCollected: 46000, ltvSales: 70000, conversionRate: 27, churnRate: 8, averageTicket: 2300, role: "closer" },
    "6": { salespersonId: 6, name: "Bruno", totalSales: 45000, cashCollected: 43000, ltvSales: 68000, conversionRate: 26, churnRate: 9, averageTicket: 2150, role: "closer" },
    "7": { salespersonId: 7, name: "Gladisson", totalSales: 35000, cashCollected: 33000, ltvSales: 48000, conversionRate: 18, churnRate: 12, averageTicket: 1800, role: "sdr" },
    "8": { salespersonId: 8, name: "Jony", totalSales: 32000, cashCollected: 30000, ltvSales: 45000, conversionRate: 16, churnRate: 14, averageTicket: 1700, role: "sdr" },
    "9": { salespersonId: 9, name: "Victor", totalSales: 38000, cashCollected: 36000, ltvSales: 52000, conversionRate: 20, churnRate: 11, averageTicket: 1900, role: "sdr" },
  },
  "2026-01": {
    "1": { salespersonId: 1, name: "Anderson", totalSales: 65000, cashCollected: 62000, ltvSales: 85000, conversionRate: 32, churnRate: 5, averageTicket: 2500, role: "closer" },
    "2": { salespersonId: 2, name: "Gabriel", totalSales: 48000, cashCollected: 45000, ltvSales: 72000, conversionRate: 28, churnRate: 8, averageTicket: 2200, role: "closer" },
    "3": { salespersonId: 3, name: "Joao Vitor", totalSales: 72000, cashCollected: 70000, ltvSales: 95000, conversionRate: 38, churnRate: 3, averageTicket: 2800, role: "closer" },
    "4": { salespersonId: 4, name: "Felipe", totalSales: 45000, cashCollected: 42000, ltvSales: 68000, conversionRate: 26, churnRate: 10, averageTicket: 2000, role: "closer" },
    "5": { salespersonId: 5, name: "Gustavo", totalSales: 52000, cashCollected: 50000, ltvSales: 75000, conversionRate: 29, churnRate: 7, averageTicket: 2400, role: "closer" },
    "6": { salespersonId: 6, name: "Bruno", totalSales: 50000, cashCollected: 48000, ltvSales: 72000, conversionRate: 28, churnRate: 8, averageTicket: 2250, role: "closer" },
    "7": { salespersonId: 7, name: "Gladisson", totalSales: 40000, cashCollected: 38000, ltvSales: 55000, conversionRate: 21, churnRate: 10, averageTicket: 1900, role: "sdr" },
    "8": { salespersonId: 8, name: "Jony", totalSales: 36000, cashCollected: 34000, ltvSales: 50000, conversionRate: 19, churnRate: 12, averageTicket: 1800, role: "sdr" },
    "9": { salespersonId: 9, name: "Victor", totalSales: 42000, cashCollected: 40000, ltvSales: 58000, conversionRate: 22, churnRate: 10, averageTicket: 2000, role: "sdr" },
  },
  "2026-02": {
    "1": { salespersonId: 1, name: "Anderson", totalSales: 62000, cashCollected: 60000, ltvSales: 82000, conversionRate: 31, churnRate: 5, averageTicket: 2450, role: "closer" },
    "2": { salespersonId: 2, name: "Gabriel", totalSales: 50000, cashCollected: 48000, ltvSales: 75000, conversionRate: 29, churnRate: 7, averageTicket: 2150, role: "closer" },
    "3": { salespersonId: 3, name: "Joao Vitor", totalSales: 70000, cashCollected: 68000, ltvSales: 92000, conversionRate: 37, churnRate: 3, averageTicket: 2750, role: "closer" },
    "4": { salespersonId: 4, name: "Felipe", totalSales: 47000, cashCollected: 45000, ltvSales: 70000, conversionRate: 27, churnRate: 9, averageTicket: 2050, role: "closer" },
    "5": { salespersonId: 5, name: "Gustavo", totalSales: 55000, cashCollected: 53000, ltvSales: 78000, conversionRate: 30, churnRate: 6, averageTicket: 2450, role: "closer" },
    "6": { salespersonId: 6, name: "Bruno", totalSales: 52000, cashCollected: 50000, ltvSales: 75000, conversionRate: 29, churnRate: 7, averageTicket: 2300, role: "closer" },
    "7": { salespersonId: 7, name: "Gladisson", totalSales: 38000, cashCollected: 36000, ltvSales: 52000, conversionRate: 20, churnRate: 11, averageTicket: 1850, role: "sdr" },
    "8": { salespersonId: 8, name: "Jony", totalSales: 34000, cashCollected: 32000, ltvSales: 48000, conversionRate: 18, churnRate: 13, averageTicket: 1750, role: "sdr" },
    "9": { salespersonId: 9, name: "Victor", totalSales: 40000, cashCollected: 38000, ltvSales: 56000, conversionRate: 21, churnRate: 10, averageTicket: 1950, role: "sdr" },
  },
};

export function getHistoricalMetrics(startDate: Date, endDate: Date): SalesMetricData[] {
  const monthKey = format(startDate, "yyyy-MM");
  const metrics = historicalMetrics[monthKey];

  if (!metrics) {
    return getDefaultMetrics();
  }

  return Object.values(metrics);
}

export function getDefaultMetrics(): SalesMetricData[] {
  return [
    { salespersonId: 1, name: "Anderson", totalSales: 65000, cashCollected: 62000, ltvSales: 85000, conversionRate: 32, churnRate: 5, averageTicket: 2500, role: "closer" },
    { salespersonId: 2, name: "Gabriel", totalSales: 48000, cashCollected: 45000, ltvSales: 72000, conversionRate: 28, churnRate: 8, averageTicket: 2200, role: "closer" },
    { salespersonId: 3, name: "Joao Vitor", totalSales: 72000, cashCollected: 70000, ltvSales: 95000, conversionRate: 38, churnRate: 3, averageTicket: 2800, role: "closer" },
    { salespersonId: 4, name: "Felipe", totalSales: 45000, cashCollected: 42000, ltvSales: 68000, conversionRate: 26, churnRate: 10, averageTicket: 2000, role: "closer" },
    { salespersonId: 5, name: "Gustavo", totalSales: 52000, cashCollected: 50000, ltvSales: 75000, conversionRate: 29, churnRate: 7, averageTicket: 2400, role: "closer" },
    { salespersonId: 6, name: "Bruno", totalSales: 50000, cashCollected: 48000, ltvSales: 72000, conversionRate: 28, churnRate: 8, averageTicket: 2250, role: "closer" },
    { salespersonId: 7, name: "Gladisson", totalSales: 40000, cashCollected: 38000, ltvSales: 55000, conversionRate: 21, churnRate: 10, averageTicket: 1900, role: "sdr" },
    { salespersonId: 8, name: "Jony", totalSales: 36000, cashCollected: 34000, ltvSales: 50000, conversionRate: 19, churnRate: 12, averageTicket: 1800, role: "sdr" },
    { salespersonId: 9, name: "Victor", totalSales: 42000, cashCollected: 40000, ltvSales: 58000, conversionRate: 22, churnRate: 10, averageTicket: 2000, role: "sdr" },
  ];
}

export function calculateTotals(metrics: SalesMetricData[]) {
  const totalCashCollected = metrics.reduce((sum, m) => sum + m.cashCollected, 0);
  const totalLtvSales = metrics.reduce((sum, m) => sum + m.ltvSales, 0);
  const totalGoal = metrics.length * 50000;
  const avgConversionRate = Math.round(metrics.reduce((sum, m) => sum + m.conversionRate, 0) / metrics.length);
  const avgChurnRate = Math.round(metrics.reduce((sum, m) => sum + m.churnRate, 0) / metrics.length);
  const avgTicket = Math.round(metrics.reduce((sum, m) => sum + m.averageTicket, 0) / metrics.length);
  const totalSales = metrics.reduce((sum, m) => sum + m.totalSales, 0);

  return {
    totalCashCollected,
    totalLtvSales,
    totalGoal,
    avgConversionRate,
    avgChurnRate,
    avgTicket,
    totalSales,
  };
}

export function getWeeklyData(startDate: Date, endDate: Date): SalesMetricData[] {
  const monthKey = format(startDate, "yyyy-MM");
  const metrics = historicalMetrics[monthKey];

  if (!metrics) {
    return getDefaultMetrics();
  }

  return Object.values(metrics).map(metric => ({
    ...metric,
    totalSales: Math.round(metric.totalSales * 0.25),
    cashCollected: Math.round(metric.cashCollected * 0.25),
    ltvSales: Math.round(metric.ltvSales * 0.25),
  }));
}

export function getDailyData(date: Date): SalesMetricData[] {
  const monthKey = format(date, "yyyy-MM");
  const metrics = historicalMetrics[monthKey];

  if (!metrics) {
    return getDefaultMetrics();
  }

  const dayOfMonth = date.getDate();
  const variationFactor = 0.5 + (dayOfMonth % 5) * 0.1;

  return Object.values(metrics).map(metric => ({
    ...metric,
    totalSales: Math.round(metric.totalSales * variationFactor),
    cashCollected: Math.round(metric.cashCollected * variationFactor),
    ltvSales: Math.round(metric.ltvSales * variationFactor),
  }));
}

export function getTopClosers(metrics: SalesMetricData[], limit: number = 3): SalesMetricData[] {
  return metrics
    .filter(m => m.role === "closer")
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, limit);
}

export function getTopSdrs(metrics: SalesMetricData[], limit: number = 3): SalesMetricData[] {
  return metrics
    .filter(m => m.role === "sdr")
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, limit);
}
