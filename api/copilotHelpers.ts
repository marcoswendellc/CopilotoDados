export function buildSheetContext(campaignData: Array<Record<string, unknown>>) {
  if (!campaignData || campaignData.length === 0) {
    return `Dados da planilha Dados_copiloto não encontrados ou a planilha está vazia.`;
  }

  const previewRows = campaignData.slice(0, 20);
  const previewJson = JSON.stringify(previewRows, null, 2);
  const truncatedNotice =
    campaignData.length > previewRows.length
      ? `\n... exibindo somente os primeiros ${previewRows.length} registros de ${campaignData.length} totais.`
      : "";

  return `Dados da planilha Dados_copiloto (${campaignData.length} registros totais):\n${previewJson}${truncatedNotice}`;
}
