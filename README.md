# RAG Bot - Test Assignment

## Overview

This project is a **Retrieval-Augmented Generation (RAG) bot** created using **JavaScript** and **LangChain.js**. The bot is capable of answering questions related to **AI Hunters** while maintaining the context of the conversation

The implementation is based on the [LangChain.js tutorial on QA with chat history](https://js.langchain.com/docs/tutorials/qa_chat_history).

## Demo

A live demo of the application is available at:  
[http://54.236.95.73:8080/](http://54.236.95.73:8080/)

## Setup Instructions

   Create an `.env` file in `/apps/backend` with the following content:
   ```env
   OPENAI_API_KEY=***
   
   LANGCHAIN_TRACING_V2=true
   LANGCHAIN_ENDPOINT="https://api.smith.langchain.com"
   LANGCHAIN_API_KEY="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"
   LANGCHAIN_PROJECT="fathym"
   ```

Create an .env file in /apps/frontend with the following content:
   ```env
    VITE_API_URL=http://localhost:3000/api
   ```
Start apps

```code
pnpm backend:start
pnpm frontend:start

```

## Notes
This bot is a proof-of-concept created as part of a test assignment and can be further enhanced or customized based on requirements.
