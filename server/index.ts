import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import uploadRoutes from "./routes/upload.js";
import processFileRoutes from "./routes/processFile.js";
import queryContextRoutes from "./routes/queryContext.js";



const token = process.env.OPENAI_API_KEY;
const endpoint = "https://models.github.ai/inference";
const modelName = "gpt-4o-mini";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({ baseURL: endpoint, apiKey: token });

app.use("/api", uploadRoutes);
app.use("/api", processFileRoutes);
app.use("/api", queryContextRoutes);

app.post("/api/chat", async (req: Request, res: Response) => {
  const { message } = req.body;
  const response = await client.chat.completions.create({
    messages: [
        { role:"user", content: message }
      ],
      model: modelName
    });

  res.json({ answer: response?.choices?.[0]?.message.content });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
