import "dotenv/config";
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