function formatSheetValue(value: unknown) {
  const text = value == null ? "" : String(value).replace(/\s+/g, " ").trim();
  return text.length > 60 ? `${text.slice(0, 60)}...` : text;
}

function getNumericValues(values: unknown[]) {
  return values.filter((value): value is number => typeof value === "number");
}

function getSampleValues(values: unknown[]) {
  const unique = Array.from(new Set(values.map((value) => String(value).trim()).filter(Boolean)));
  return unique.slice(0, 2);
}

export function buildSheetContext(campaignData: Array<Record<string, unknown>>) {
  if (!campaignData || campaignData.length === 0) {
    return `Dados da planilha Dados_copiloto não encontrados ou a planilha está vazia.`;
  }

  const totalRows = campaignData.length;
  const allColumns = Object.keys(campaignData[0]);
  const columns = allColumns.slice(0, 6);
  const summaryRows = campaignData.slice(0, 10);
  const sampleRows = campaignData.slice(0, 2);

  const columnSummaries = columns.map((column) => {
    const values = summaryRows.map((row) => row[column]).filter((value) => value != null);
    const numericValues = getNumericValues(values);

    if (numericValues.length >= 3) {
      const sum = numericValues.reduce((acc, value) => acc + value, 0);
      const avg = sum / numericValues.length;
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      return `- ${column}: numeric, linhas válidas ${numericValues.length}, soma=${sum}, média=${avg.toFixed(2)}, min=${min}, max=${max}`;
    }

    const sampleValues = getSampleValues(values);
    return `- ${column}: text, linhas válidas ${values.length}, exemplos: ${sampleValues.join(", ")}`;
  });

  const sampleText = sampleRows
    .map((row, index) => {
      const values = columns
        .map((column) => `${column}: ${formatSheetValue(row[column])}`)
        .join(" | ");
      return `Linha ${index + 1}: ${values}`;
    })
    .join("\n");

  const truncatedNotice =
    totalRows > sampleRows.length
      ? `\n... exibindo somente os primeiros ${sampleRows.length} registros de ${totalRows} totais.`
      : "";

  return `Dados da planilha Dados_copiloto (${totalRows} registros totais):\n- Colunas (mostrando até ${columns.length} primeiras): ${columns.join(", ")}\n- Sumário baseado em até ${summaryRows.length} linhas iniciais:\n${columnSummaries.join("\n")}\n- Exemplos das primeiras ${sampleRows.length} linhas:\n${sampleText}${truncatedNotice}\nUse apenas esses dados para responder e não invente informações.`;
}
