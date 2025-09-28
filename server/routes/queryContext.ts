import { openai, index, embedChunks } from "../utils/commonUtils.js";
import express from "express";

const router = express.Router();

router.post("/query", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question required" });

    // Step 1: Embed the question
    const [queryEmbedding] = await embedChunks([question]);

    // Step 2: Query Pinecone
    const results = await index.query({
      topK: 3,
      vector: queryEmbedding as number[],
      includeMetadata: true,
    });

    // Step 3: Build context string
    const context = results.matches
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((match: any) => match.metadata.text)
      .join("\n\n");

    // Step 4: Ask OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Use the provided context.",
        },
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion: ${question}`,
        },
      ],
    });

    const answer = completion.choices[0]
      ? completion.choices[0].message?.content
      : "No answer found.";
    res.json({ answer, sources: results.matches });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process query" });
  }
});

export default router;
