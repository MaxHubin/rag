import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getChain } from "./services/retriever";
import { boot } from "./boot";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Cache-Control"],
  }),
);

app.get("/api/chat", async (req: Request, res: Response) => {
  const { sessionId, question } = req.query;

  if (!sessionId || !question) {
    return res
      .status(400)
      .json({ error: "Missing required fields: sessionId and question" });
  }

  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await getChain().stream(
      { input: question },
      { configurable: { sessionId } },
    );

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ text: chunk.answer })}\n\n`);
    }

    res.write(`event: end\ndata: {}\n\n`);
    res.end();
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).write("Internal server error\n");
  }
});

const PORT = process.env.PORT || 3000;

boot().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
