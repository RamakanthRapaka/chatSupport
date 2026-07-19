import cors from "cors";
import express from "express";

export function createApp(config) {
  const app = express();

  app.use(
    cors({
      origin: config.frontendUrl,
      credentials: true,
    }),
  );

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({
      success: true,
      service: "chatSupport",
      status: "ok",
    });
  });

  return app;
}
