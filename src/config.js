import dotenv from "dotenv";

dotenv.config();

export function loadConfig() {
  return {
    port: Number(process.env.PORT || 4001),
    nodeEnv: process.env.NODE_ENV || "development",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
    fastapiBaseUrl:
      process.env.FASTAPI_BASE_URL || "https://toolancer-back-end.vercel.app/api/v1",
  };
}
