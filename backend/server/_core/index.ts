import "dotenv/config";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import dashboardRoutes from "../routes/dashboardRoutes";

async function startServer() {
  const app = express();
  const server = createServer(app);

  // CORS configuration for frontend
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:5173",
    "http://localhost:3000",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Em produção, se for Vercel ou Render, podemos ser mais flexíveis se necessário
        // Mas por segurança mantemos a lista
        const isAllowed = allowedOrigins.some(allowed => {
          if (allowed.includes('*')) {
            const pattern = new RegExp('^' + allowed.replace(/\*/g, '.*') + '$');
            return pattern.test(origin);
          }
          return allowed === origin;
        });

        if (isAllowed || process.env.NODE_ENV !== 'production') {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Dashboard routes (Google Sheets integration)
  app.use("/api", dashboardRoutes);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Health check endpoint - ESSENCIAL para o Render
  app.get("/health", (_req, res) => {
    res.status(200).send("OK");
  });

  // Raiz para evitar 404 no scan do Render
  app.get("/", (_req, res) => {
    res.send("Lure Digital API is running");
  });

  // No Render, a porta é passada pela variável de ambiente PORT
  // O host DEVE ser 0.0.0.0
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  const host = '0.0.0.0';

  server.listen(port, host, () => {
    console.log(`🚀 Backend server running on ${host}:${port}`);
  });
}

startServer().catch(console.error);
