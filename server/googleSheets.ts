import { google } from "googleapis";
import type { sheets_v4 } from "googleapis";

const rawCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
const defaultSpreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const defaultRange = process.env.GOOGLE_SHEETS_RANGE || "Dados_copiloto!A1:P20000";

function parseServiceAccountCredentials(raw: string): Record<string, any> {
  try {
    return JSON.parse(raw);
  } catch (firstError) {
    try {
      return JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
    } catch (secondError) {
      throw new Error(
        "Não foi possível interpretar GOOGLE_SERVICE_ACCOUNT_CREDENTIALS. Use JSON puro ou Base64."
      );
    }
  }
}

function getSheetsClient() {
  if (!rawCredentials) {
    throw new Error(
      "A variável de ambiente GOOGLE_SERVICE_ACCOUNT_CREDENTIALS não foi encontrada."
    );
  }

  const credentials = parseServiceAccountCredentials(rawCredentials);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  return google.sheets({ version: "v4", auth });
}

function normalizeHeader(header: string) {
  return header
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/__+/g, "_")
    .replace(/^_|_$/g, "_");
}

function parseCellValue(value: string | undefined) {
  if (value == null || value.trim() === "") {
    return null;
  }

  const cleaned = value.trim();
  const numberCandidate = Number(cleaned.replace(/\./g, "").replace(/,/g, "."));

  if (!Number.isNaN(numberCandidate) && /^-?\d+[\d.,]*$/.test(cleaned)) {
    return numberCandidate;
  }

  return cleaned;
}

export async function readSheetValues(spreadsheetId: string, range: string) {
  console.log("Google Sheets: autenticando e lendo dados", { spreadsheetId, range });
  const sheets = getSheetsClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = response.data.values || [];
  console.log("Google Sheets: linhas lidas", rows.length);

  return rows as string[][];
}

export function rowsToJson(rows: string[][]) {
  if (!rows.length) {
    return [];
  }

  const headers = rows[0].map((header) => normalizeHeader(header ?? ""));

  return rows.slice(1).map((row) => {
    const rowObject: Record<string, unknown> = {};

    headers.forEach((header, index) => {
      if (!header) {
        return;
      }

      rowObject[header] = parseCellValue(row[index]);
    });

    return rowObject;
  });
}

export async function getCampaignData(options: {
  spreadsheetId?: string;
  range?: string;
} = {}) {
  const spreadsheetId = options.spreadsheetId || defaultSpreadsheetId;
  const range = options.range || defaultRange;

  if (!spreadsheetId) {
    throw new Error(
      "Spreadsheet ID não informado. Configure GOOGLE_SHEETS_SPREADSHEET_ID ou passe spreadsheetId na chamada."
    );
  }

  const rows = await readSheetValues(spreadsheetId, range);
  const campaignData = rowsToJson(rows);

  console.log("Google Sheets: dados convertidos para JSON", {
    campaignCount: campaignData.length,
  });

  return campaignData;
}
