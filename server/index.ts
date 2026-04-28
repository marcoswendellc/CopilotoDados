import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Forçar carregamento do .env do diretório correto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

import express from "express";
import cors from "cors";
import copilotRoute from "./copilot";
import sheetsRoute from "./sheets";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", copilotRoute);
app.use("/api", sheetsRoute);

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});