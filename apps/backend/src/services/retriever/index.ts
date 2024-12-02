import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { getSessionHistory } from "../../utils/history.js";
import { Runnable } from "@langchain/core/dist/runnables/base";

let chain: Runnable | null = null;

export const setupChain = async (vectorStore: MemoryVectorStore) => {
  if (!vectorStore) throw new Error("Vector store is required");

  const retriever = vectorStore.asRetriever();
  const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });

  const contextualizePrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Reformulate user questions based on chat history to make them standalone.",
    ],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);

  const historyAwareRetriever = await createHistoryAwareRetriever({
    llm,
    retriever,
    rephrasePrompt: contextualizePrompt,
  });

  const qaPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer questions concisely using the provided context. If unsure, say 'I don't know'.\n\n{context}",
    ],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);

  const questionAnswerChain = await createStuffDocumentsChain({
    llm,
    prompt: qaPrompt,
  });

  const retrievalChain = await createRetrievalChain({
    retriever: historyAwareRetriever,
    combineDocsChain: questionAnswerChain,
  });

  chain = new RunnableWithMessageHistory({
    runnable: retrievalChain,
    getMessageHistory: getSessionHistory,
    inputMessagesKey: "input",
    historyMessagesKey: "chat_history",
    outputMessagesKey: "answer",
  });
};

export const getChain = () => {
  if (!chain) {
    throw new Error("chain is not initialized");
  }
  return chain;
};
