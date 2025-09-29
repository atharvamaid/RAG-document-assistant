// server/routes/processFile.ts
import express from "express";
import multer from "multer";
import crypto from "crypto";
import fs from "fs/promises";
import { extractText, chunkText, embedChunks } from "../utils/commonUtils.js";
import { index } from "../utils/pineconeClient.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/process-file", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const fileBuffer = await fs.readFile(req.file.path);
    const hash = crypto
      .createHash("md5")
      .update(fileBuffer)
      .digest("hex")
      .slice(0, 10);
    const namespace = `file-${hash}`;
    const text = await extractText(req.file.path, req.file.mimetype);
    const chunks = chunkText(text, 1000, 200);
    const embeddings = await embedChunks(chunks);
    const vectors = embeddings.map((values, i) => ({
      id: `${namespace}-chunk-${i}`,
      values,
      metadata: {
        text: chunks[i] ? chunks[i].slice(0, 300) : "",
        filename: req.file ? req.file.originalname : "",
        chunkIndex: i,
      },
    }));

    await index.namespace(namespace).upsert(vectors);

    res.json({ success: true, chunks: chunks.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Processing failed" });
  }
});

export default router;
