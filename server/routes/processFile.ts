// server/routes/processFile.ts
import express from "express";
import multer from "multer";
import {
  extractText,
  chunkText,
  embedChunks,
  upsertEmbeddings,
} from "../utils/commonUtils.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/process-file", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const text = await extractText(req.file.path, req.file.mimetype);
    const chunks = chunkText(text);
    const embeddings = await embedChunks(chunks);
    await upsertEmbeddings(chunks, embeddings, req.file.originalname);
    res.json({ success: true, chunks: chunks.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Processing failed" });
  }
});

export default router;
