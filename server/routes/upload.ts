// server/routes/upload.ts
import express from "express";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ filename: req.file.filename, path: req.file.path, original: req.file.originalname });
});

export default router;
