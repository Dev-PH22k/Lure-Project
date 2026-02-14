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

function createAuthenticatedContext(userId: number = 1): TrpcContext {
  const clearedCookies: Array<{ name: string; options: Record<string, unknown> }> = [];

  const ctx: TrpcContext = {
    user: {
      id: userId,
      openId: `user-${userId}`,
      email: `user${userId}@example.com`,
      name: `Test User ${userId}`,
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("auth.me", () => {
  it("returns null for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeNull();
  });

  it("returns user data for authenticated users", async () => {
    const ctx = createAuthenticatedContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeDefined();
    expect(result?.id).toBe(1);
    expect(result?.openId).toBe("user-1");
    expect(result?.email).toBe("user1@example.com");
    expect(result?.name).toBe("Test User 1");
    expect(result?.role).toBe("user");
  });

  it("returns correct user data for different users", async () => {
    const ctx = createAuthenticatedContext(5);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result?.id).toBe(5);
    expect(result?.openId).toBe("user-5");
    expect(result?.email).toBe("user5@example.com");
  });

  it("includes all required user fields", async () => {
    const ctx = createAuthenticatedContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("openId");
    expect(result).toHaveProperty("email");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("loginMethod");
    expect(result).toHaveProperty("role");
    expect(result).toHaveProperty("createdAt");
    expect(result).toHaveProperty("updatedAt");
    expect(result).toHaveProperty("lastSignedIn");
  });
});

describe("auth.logout", () => {
  it("clears session for authenticated users", async () => {
    const ctx = createAuthenticatedContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
  });

  it("handles logout for different users", async () => {
    const ctx = createAuthenticatedContext(10);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result.success).toBe(true);
  });
});

describe("Login Flow Integration", () => {
  it("unauthenticated user sees null on auth.me", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeNull();
  });

  it("authenticated user can access dashboard data", async () => {
    const ctx = createAuthenticatedContext(1);
    const caller = appRouter.createCaller(ctx);

    const user = await caller.auth.me();
    expect(user).toBeDefined();

    const dashboardData = await caller.dashboard.getSalesData({});
    expect(dashboardData).toBeDefined();
    expect(dashboardData.metrics).toHaveLength(9);
  });

  it("user info is preserved across requests", async () => {
    const ctx = createAuthenticatedContext(3);
    const caller = appRouter.createCaller(ctx);

    const firstCall = await caller.auth.me();
    const secondCall = await caller.auth.me();

    expect(firstCall?.id).toBe(secondCall?.id);
    expect(firstCall?.openId).toBe(secondCall?.openId);
    expect(firstCall?.email).toBe(secondCall?.email);
  });
});
