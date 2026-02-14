import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getHistoricalMetrics, calculateTotals, getWeeklyData, getDailyData, getTopClosers, getTopSdrs } from "./historicalData";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  dashboard: router({
    getSalesData: publicProcedure
      .input(
        z.object({
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          periodType: z.enum(["month", "week", "custom"]).optional(),
        })
      )
      .query(async ({ input }) => {
        const startDate = input.startDate || new Date();
        const endDate = input.endDate || new Date();
        const periodType = input.periodType || "month";

        const salespeople = [
          { id: 1, name: "Anderson", email: "anderson@lure.com", individualGoal: 50000 },
          { id: 2, name: "Gabriel", email: "gabriel@lure.com", individualGoal: 50000 },
          { id: 3, name: "Joao Vitor", email: "joao@lure.com", individualGoal: 50000 },
          { id: 4, name: "Felipe", email: "felipe@lure.com", individualGoal: 50000 },
          { id: 5, name: "Amanda", email: "amanda@lure.com", individualGoal: 50000 },
          { id: 6, name: "Gustavo", email: "gustavo@lure.com", individualGoal: 50000 },
        ];

        let metrics;
        if (periodType === "week") {
          metrics = getWeeklyData(startDate, endDate);
        } else if (periodType === "custom") {
          metrics = getDailyData(startDate);
        } else {
          metrics = getHistoricalMetrics(startDate, endDate);
        }

        const totals = calculateTotals(metrics);
        const { totalCashCollected, totalLtvSales, totalGoal, avgConversionRate, avgChurnRate, avgTicket, totalSales } = totals;

        const topClosers = getTopClosers(metrics, 3);
        const topSdrs = getTopSdrs(metrics, 3);

        return {
          salespeople,
          metrics,
          totalCashCollected,
          totalLtvSales,
          totalGoal,
          avgConversionRate,
          avgChurnRate,
          avgTicket,
          totalSales,
          topClosers,
          topSdrs,
          periodType,
          startDate,
          endDate,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
