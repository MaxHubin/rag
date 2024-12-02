import { ChatMessageHistory } from "langchain/stores/message/in_memory";

const sessionStore: Record<string, ChatMessageHistory> = {};

export const getSessionHistory = (sessionId: string): ChatMessageHistory => {
  if (!sessionStore[sessionId]) {
    sessionStore[sessionId] = new ChatMessageHistory();
  }
  return sessionStore[sessionId];
};
