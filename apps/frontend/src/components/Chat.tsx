import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./Chat.module.css";

const API_URL = import.meta.env.VITE_API_URL;
const SESSION_ID = uuidv4();
const INITIAL_MESSAGE = `Hello! How can I assist you with any AI Hunters related questions today? (id=${SESSION_ID})`;

interface ChatMessage {
  id: number;
  type: "question" | "answer";
  text: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: Math.random(),
      type: "answer",
      text: INITIAL_MESSAGE,
    },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");

  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!currentQuestion.trim()) return;

    const questionMessage: ChatMessage = {
      id: Date.now(),
      type: "question",
      text: currentQuestion,
    };

    setCurrentQuestion("");

    try {
      const eventSource = new EventSource(
        `${API_URL}/chat?sessionId=${SESSION_ID}&question=${encodeURIComponent(
          currentQuestion,
        )}`,
      );

      const answerMessage: ChatMessage = {
        id: Date.now() + 1,
        type: "answer",
        text: "",
      };

      setMessages([...messages, questionMessage, answerMessage]);

      let answer = "";

      eventSource.onmessage = (event) => {
        const chunk = JSON.parse(event.data);
        if (chunk && chunk.text) {
          answer += chunk.text;
        }
        setMessages((messages) => {
          if (chunk && chunk.text) {
            messages[messages.length - 1] = {
              ...messages[messages.length - 1],
              text: answer,
            };
          }
          return [...messages];
        });
      };

      eventSource.onopen = () => {};
      eventSource.onerror = (err) => {
        console.error("EventSource error:", err);
        eventSource.close();
      };

      eventSource.addEventListener("end", () => {
        eventSource.close();
      });
    } catch (error) {
      console.error("Error fetching chat response:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div ref={chatHistoryRef} className={styles.chatHistory}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${
              message.type === "question" ? styles.question : styles.answer
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className={styles.chatInput}>
        <input
          type="text"
          placeholder="Question..."
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />
        <button onClick={handleSend} className={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
