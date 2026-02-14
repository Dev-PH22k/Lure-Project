import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("dashboard.getSalesData", () => {
  it("returns 9 metrics for the current month", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dashboard.getSalesData({});

    expect(result).toBeDefined();
    expect(result.metrics).toHaveLength(9);
    expect(result.metrics).toBeDefined();
    expect(result.totalCashCollected).toBeGreaterThan(0);
    expect(result.totalLtvSales).toBeGreaterThan(0);
    expect(result.totalGoal).toBeGreaterThan(0);
    expect(result.avgConversionRate).toBeGreaterThan(0);
    expect(result.avgChurnRate).toBeGreaterThan(0);
    expect(result.avgTicket).toBeGreaterThan(0);
    expect(result.totalSales).toBeGreaterThan(0);
    expect(result.topClosers).toBeDefined();
    expect(result.topSdrs).toBeDefined();
  });

  it("returns 10 metrics for all salespeople (7 closers + 3 SDRs)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dashboard.getSalesData({});

    expect(result.metrics).toHaveLength(9);
    result.metrics.forEach((metric) => {
      expect(metric.totalSales).toBeGreaterThan(0);
      expect(metric.cashCollected).toBeGreaterThan(0);
      expect(metric.ltvSales).toBeGreaterThan(0);
      expect(metric.conversionRate).toBeGreaterThan(0);
      expect(metric.churnRate).toBeGreaterThan(0);
      expect(metric.averageTicket).toBeGreaterThan(0);
      expect(["closer", "sdr"]).toContain(metric.role);
    });
  });

  it("returns top 3 closers sorted by total sales", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dashboard.getSalesData({});

    expect(result.topClosers).toHaveLength(3);
    expect(result.topClosers[0].totalSales).toBeGreaterThanOrEqual(result.topClosers[1].totalSales);
    expect(result.topClosers[1].totalSales).toBeGreaterThanOrEqual(result.topClosers[2].totalSales);
    result.topClosers.forEach((closer) => {
      expect(closer.role).toBe("closer");
    });
  });

  it("returns top 3 SDRs sorted by total sales", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dashboard.getSalesData({});

    expect(result.topSdrs).toHaveLength(3);
    expect(result.topSdrs[0].totalSales).toBeGreaterThanOrEqual(result.topSdrs[1].totalSales);
    expect(result.topSdrs[1].totalSales).toBeGreaterThanOrEqual(result.topSdrs[2].totalSales);
    result.topSdrs.forEach((sdr) => {
      expect(sdr.role).toBe("sdr");
    });
  });

  it("calculates totals correctly", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dashboard.getSalesData({});

    const expectedCashCollected = result.metrics.reduce((sum, m) => sum + m.cashCollected, 0);
    const expectedLtvSales = result.metrics.reduce((sum, m) => sum + m.ltvSales, 0);
    const expectedTotalSales = result.metrics.reduce((sum, m) => sum + m.totalSales, 0);

    expect(result.totalCashCollected).toBe(expectedCashCollected);
    expect(result.totalLtvSales).toBe(expectedLtvSales);
    expect(result.totalSales).toBe(expectedTotalSales);
  });

  it("calculates average metrics correctly", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dashboard.getSalesData({});

    const expectedAvgConversionRate = Math.round(
      result.metrics.reduce((sum, m) => sum + m.conversionRate, 0) / result.metrics.length
    );
    const expectedAvgChurnRate = Math.round(
      result.metrics.reduce((sum, m) => sum + m.churnRate, 0) / result.metrics.length
    );
    const expectedAvgTicket = Math.round(
      result.metrics.reduce((sum, m) => sum + m.averageTicket, 0) / result.metrics.length
    );

    expect(result.avgConversionRate).toBe(expectedAvgConversionRate);
    expect(result.avgChurnRate).toBe(expectedAvgChurnRate);
    expect(result.avgTicket).toBe(expectedAvgTicket);
  });

  it("includes all 9 salespeople names (Amanda removed)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dashboard.getSalesData({});

    const names = result.metrics.map((m) => m.name);
    expect(names).toContain("Anderson");
    expect(names).toContain("Gabriel");
    expect(names).toContain("Joao Vitor");
    expect(names).toContain("Felipe");
    expect(names).not.toContain("Amanda");
    expect(names).toContain("Gustavo");
    expect(names).toContain("Bruno");
    expect(names).toContain("Gladisson");
    expect(names).toContain("Jony");
    expect(names).toContain("Victor");
  });
});
