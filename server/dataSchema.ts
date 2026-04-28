export type FieldType = "int" | "decimal" | "string" | "date";

export type FieldSchema = {
  name: string;
  type: FieldType;
  description: string;
};

export type TableSchema = {
  name: string;
  description: string;
  fields: FieldSchema[];
};

export const campaignSchema: TableSchema = {
  name: "Dados_copiloto",
  description:
    "Dados de campanhas promocionais, compras, clientes e lojas." ,
  fields: [
    { name: "cd_compra", type: "int", description: "Código da compra" },
    { name: "sk_cliente", type: "int", description: "ID do cliente" },
    { name: "sk_loja", type: "int", description: "ID da loja" },
    { name: "nm_fantasa", type: "string", description: "Nome fantasia da loja" },
    { name: "nm_segmento", type: "string", description: "Segmento da loja" },
    { name: "dt_registro_mos", type: "string", description: "Data do registro (string)" },
    { name: "vl_compra", type: "decimal", description: "Valor da compra" },
    { name: "cd_empreendimento", type: "int", description: "Código do empreendimento" },
    { name: "nm_empreendimento", type: "string", description: "Nome do empreendimento" },
    { name: "cd_promocao", type: "int", description: "Código da promoção" },
    { name: "nm_promocao", type: "string", description: "Nome da promoção" },
    { name: "sk_dtinicio", type: "string", description: "Data de início (string)" },
    { name: "sk_dtfim", type: "string", description: "Data de fim (string)" },
    { name: "tx_cep", type: "int", description: "CEP do cliente ou loja" },
    { name: "uf", type: "string", description: "Unidade da federação" },
    { name: "bairro", type: "string", description: "Bairro" },
  ],
};

export const supportedTableNames = [campaignSchema.name];

export function getFieldNames(schema: TableSchema) {
  return schema.fields.map((field) => field.name);
}

export function getFieldType(schema: TableSchema, fieldName: string): FieldType | null {
  const field = schema.fields.find((item) => item.name === fieldName);
  return field?.type ?? null;
}

export function buildSchemaDescription(schema: TableSchema) {
  const lines = schema.fields.map((field) => `- ${field.name} (${field.type}): ${field.description}`);

  return `Tabela: ${schema.name}\nDescrição: ${schema.description}\nCampos:\n${lines.join("\n")}`;
}
