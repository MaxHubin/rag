import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

import type { Document } from "@langchain/core/documents";

export const indexData = async (
  data: Document[],
): Promise<MemoryVectorStore> => {
  return MemoryVectorStore.fromDocuments(data, new OpenAIEmbeddings());
};
