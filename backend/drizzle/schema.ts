import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const salespeople = mysqlTable("salespeople", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  individualGoal: int("individual_goal").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Salesperson = typeof salespeople.$inferSelect;
export type InsertSalesperson = typeof salespeople.$inferInsert;

export const salesMetrics = mysqlTable("sales_metrics", {
  id: int("id").autoincrement().primaryKey(),
  salespersonId: int("salesperson_id").notNull(),
  totalSales: int("total_sales").notNull().default(0),
  cashCollected: int("cash_collected").notNull().default(0),
  ltvSales: int("ltv_sales").notNull().default(0),
  conversionRate: int("conversion_rate").notNull().default(0),
  churnRate: int("churn_rate").notNull().default(0),
  averageTicket: int("average_ticket").notNull().default(0),
  month: varchar("month", { length: 7 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SalesMetric = typeof salesMetrics.$inferSelect;
export type InsertSalesMetric = typeof salesMetrics.$inferInsert;