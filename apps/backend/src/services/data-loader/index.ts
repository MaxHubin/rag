import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import type { Document } from "@langchain/core/documents";

export const loadAndSplitData = async (
  urls: string[],
  chunkSize = 1000,
  chunkOverlap = 200,
): Promise<Document[]> => {
  if (!urls || urls.length === 0)
    throw new Error("At least one URL is required");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });

  const allDocuments = await Promise.all(
    urls.map(async (url) => {
      const loader = new CheerioWebBaseLoader(url);
      const documents = await loader.load();
      return splitter.splitDocuments(documents);
    }),
  );

  return allDocuments.flat();
};
