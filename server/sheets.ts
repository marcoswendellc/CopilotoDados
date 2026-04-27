import { Router, Request, Response } from "express";
import { getCampaignData } from "./googleSheets";

const router = Router();

router.get("/campaigns", async (req: Request, res: Response) => {
  const spreadsheetId = String(
    req.query.spreadsheetId ?? process.env.GOOGLE_SHEETS_SPREADSHEET_ID ?? ""
  );
  const range = String(req.query.range ?? process.env.GOOGLE_SHEETS_RANGE ?? "Campanhas!A1:Z1000");

  if (!spreadsheetId) {
    return res.status(400).json({
      error:
        "Parâmetro spreadsheetId não informado. Use query ?spreadsheetId=... ou defina GOOGLE_SHEETS_SPREADSHEET_ID.",
    });
  }

  try {
    const campaigns = await getCampaignData({ spreadsheetId, range });
    return res.json({ campaigns });
  } catch (error: unknown) {
    console.error("Erro ao ler Google Sheets:", error);

    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Erro interno ao buscar dados do Google Sheets.",
    });
  }
});

export default router;
