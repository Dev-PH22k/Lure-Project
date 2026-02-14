import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";

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

describe("dashboard.getSalesData with filters", () => {
  it("returns data for month period", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const today = new Date();
    const startDate = startOfMonth(today);
    const endDate = endOfMonth(today);

    const result = await caller.dashboard.getSalesData({
      startDate,
      endDate,
      periodType: "month",
    });

    expect(result).toBeDefined();
    expect(result.periodType).toBe("month");
    expect(result.metrics).toHaveLength(9);
    expect(result.totalSales).toBeGreaterThan(0);
  });

  it("returns data for week period", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const today = new Date();
    const startDate = startOfWeek(today, { weekStartsOn: 1 });
    const endDate = endOfWeek(today, { weekStartsOn: 1 });

    const result = await caller.dashboard.getSalesData({
      startDate,
      endDate,
      periodType: "week",
    });

    expect(result).toBeDefined();
    expect(result.periodType).toBe("week");
    expect(result.metrics).toHaveLength(9);
    expect(result.totalSales).toBeGreaterThan(0);
  });

  it("returns data for custom (daily) period", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const today = new Date();

    const result = await caller.dashboard.getSalesData({
      startDate: today,
      endDate: today,
      periodType: "custom",
    });

    expect(result).toBeDefined();
    expect(result.periodType).toBe("custom");
    expect(result.metrics).toHaveLength(9);
    expect(result.totalSales).toBeGreaterThan(0);
  });

  it("returns default values when no period is provided", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dashboard.getSalesData({});

    expect(result).toBeDefined();
    expect(result.metrics).toHaveLength(9);
    expect(result.totalSales).toBeGreaterThan(0);
  });

  it("calculates correct totals for filtered period", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const today = new Date();
    const startDate = startOfMonth(today);
    const endDate = endOfMonth(today);

    const result = await caller.dashboard.getSalesData({
      startDate,
      endDate,
      periodType: "month",
    });

    const expectedTotal = result.metrics.reduce((sum, m) => sum + m.totalSales, 0);
    expect(result.totalSales).toBe(expectedTotal);
  });

  it("different period types return valid data", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const today = new Date();

    const monthResult = await caller.dashboard.getSalesData({
      startDate: startOfMonth(today),
      endDate: endOfMonth(today),
      periodType: "month",
    });

    const weekResult = await caller.dashboard.getSalesData({
      startDate: startOfWeek(today, { weekStartsOn: 1 }),
      endDate: endOfWeek(today, { weekStartsOn: 1 }),
      periodType: "week",
    });

    expect(monthResult.totalSales).toBeGreaterThan(0);
    expect(weekResult.totalSales).toBeGreaterThan(0);
    expect(monthResult.periodType).toBe("month");
    expect(weekResult.periodType).toBe("week");
  });

  it("returns metrics with all required fields for filtered period", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const today = new Date();

    const result = await caller.dashboard.getSalesData({
      startDate: startOfMonth(today),
      endDate: endOfMonth(today),
      periodType: "month",
    });

    result.metrics.forEach((metric) => {
      expect(metric.salespersonId).toBeDefined();
      expect(metric.name).toBeDefined();
      expect(metric.totalSales).toBeGreaterThan(0);
      expect(metric.cashCollected).toBeGreaterThan(0);
      expect(metric.ltvSales).toBeGreaterThan(0);
      expect(metric.conversionRate).toBeGreaterThan(0);
      expect(metric.churnRate).toBeGreaterThan(0);
      expect(metric.averageTicket).toBeGreaterThan(0);
      expect(["closer", "sdr"]).toContain(metric.role);
    });
  });

  it("period information is returned correctly", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const today = new Date();
    const startDate = startOfMonth(today);
    const endDate = endOfMonth(today);

    const result = await caller.dashboard.getSalesData({
      startDate,
      endDate,
      periodType: "month",
    });

    expect(result.startDate).toBeDefined();
    expect(result.endDate).toBeDefined();
    expect(result.periodType).toBe("month");
  });

  it("returns top closers and SDRs", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dashboard.getSalesData({});

    expect(result.topClosers).toBeDefined();
    expect(result.topClosers).toHaveLength(3);
    expect(result.topSdrs).toBeDefined();
    expect(result.topSdrs).toHaveLength(3);

    result.topClosers.forEach((closer) => {
      expect(closer.role).toBe("closer");
    });

    result.topSdrs.forEach((sdr) => {
      expect(sdr.role).toBe("sdr");
    });
  });
});
