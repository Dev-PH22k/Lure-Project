import { describe, expect, it } from "vitest";
import { getTopClosers, getTopSdrs, getDefaultMetrics } from "./historicalData";

describe("Sales Enhancement Features", () => {
  describe("getTopClosers", () => {
    it("should return top 3 closers sorted by total sales", () => {
      const metrics = getDefaultMetrics();
      const topClosers = getTopClosers(metrics, 3);

      expect(topClosers).toHaveLength(3);
      expect(topClosers[0]?.role).toBe("closer");
      expect(topClosers[0]?.name).toBe("Joao Vitor");
      expect(topClosers[0]?.totalSales).toBe(72000);
    });

    it("should filter only closers", () => {
      const metrics = getDefaultMetrics();
      const topClosers = getTopClosers(metrics, 10);

      topClosers.forEach((closer) => {
        expect(closer.role).toBe("closer");
      });
    });

    it("should return correct number of closers", () => {
      const metrics = getDefaultMetrics();
      const topClosers = getTopClosers(metrics, 5);

      expect(topClosers.length).toBeLessThanOrEqual(5);
      expect(topClosers.length).toBeLessThanOrEqual(6); // Total closers (Amanda removed)
    });
  });

  describe("getTopSdrs", () => {
    it("should return top 3 SDRs sorted by total sales", () => {
      const metrics = getDefaultMetrics();
      const topSdrs = getTopSdrs(metrics, 3);

      expect(topSdrs).toHaveLength(3);
      expect(topSdrs[0]?.role).toBe("sdr");
      expect(topSdrs[0]?.name).toBe("Victor");
      expect(topSdrs[0]?.totalSales).toBe(42000);
    });

    it("should filter only SDRs", () => {
      const metrics = getDefaultMetrics();
      const topSdrs = getTopSdrs(metrics, 10);

      topSdrs.forEach((sdr) => {
        expect(sdr.role).toBe("sdr");
      });
    });

    it("should return correct number of SDRs", () => {
      const metrics = getDefaultMetrics();
      const topSdrs = getTopSdrs(metrics, 5);

      expect(topSdrs.length).toBeLessThanOrEqual(5);
      expect(topSdrs.length).toBeLessThanOrEqual(3); // Total SDRs
    });
  });

  describe("Default Metrics", () => {
    it("should have all 9 salespeople with role defined", () => {
      const metrics = getDefaultMetrics();

      expect(metrics).toHaveLength(9);
      metrics.forEach((metric) => {
        expect(metric.role).toBeDefined();
        expect(["closer", "sdr"]).toContain(metric.role);
      });
    });

    it("should have 6 closers and 3 SDRs (Amanda removed)", () => {
      const metrics = getDefaultMetrics();
      const closers = metrics.filter((m) => m.role === "closer");
      const sdrs = metrics.filter((m) => m.role === "sdr");

      expect(closers).toHaveLength(6);
      expect(sdrs).toHaveLength(3);
      expect(closers.length + sdrs.length).toBe(9);
    });

    it("should include Anderson, Gabriel, Joao Vitor, Felipe, Gustavo, Bruno and not Amanda", () => {
      const metrics = getDefaultMetrics();
      const names = metrics.map((m) => m.name);

      expect(names).toContain("Anderson");
      expect(names).toContain("Gabriel");
      expect(names).toContain("Joao Vitor");
      expect(names).toContain("Felipe");
      expect(names).toContain("Gustavo");
      expect(names).toContain("Bruno");
      expect(names).not.toContain("Amanda");
    });

    it("should include Gladisson, Jony, and Victor", () => {
      const metrics = getDefaultMetrics();
      const names = metrics.map((m) => m.name);

      expect(names).toContain("Gladisson");
      expect(names).toContain("Jony");
      expect(names).toContain("Victor");
    });

    it("should have correct roles for all salespeople", () => {
      const metrics = getDefaultMetrics();
      const roleMap = new Map(metrics.map((m) => [m.name, m.role]));

      // Closers (Amanda removed)
      expect(roleMap.get("Anderson")).toBe("closer");
      expect(roleMap.get("Gabriel")).toBe("closer");
      expect(roleMap.get("Joao Vitor")).toBe("closer");
      expect(roleMap.get("Felipe")).toBe("closer");
      expect(roleMap.get("Gustavo")).toBe("closer");
      expect(roleMap.get("Bruno")).toBe("closer");
      expect(roleMap.get("Amanda")).toBeUndefined(); // Amanda removed

      // SDRs
      expect(roleMap.get("Gladisson")).toBe("sdr");
      expect(roleMap.get("Jony")).toBe("sdr");
      expect(roleMap.get("Victor")).toBe("sdr");
    });
  });

  describe("Sales Data Integrity", () => {
    it("should have valid sales metrics for all salespeople", () => {
      const metrics = getDefaultMetrics();

      metrics.forEach((metric) => {
        expect(metric.totalSales).toBeGreaterThan(0);
        expect(metric.cashCollected).toBeGreaterThan(0);
        expect(metric.ltvSales).toBeGreaterThan(0);
        expect(metric.conversionRate).toBeGreaterThan(0);
        expect(metric.averageTicket).toBeGreaterThan(0);
        expect(metric.churnRate).toBeGreaterThanOrEqual(0);
      });
    });

    it("should have cashCollected <= totalSales", () => {
      const metrics = getDefaultMetrics();

      metrics.forEach((metric) => {
        expect(metric.cashCollected).toBeLessThanOrEqual(metric.totalSales);
      });
    });

    it("should have ltvSales >= totalSales", () => {
      const metrics = getDefaultMetrics();

      metrics.forEach((metric) => {
        expect(metric.ltvSales).toBeGreaterThanOrEqual(metric.totalSales);
      });
    });
  });
});
