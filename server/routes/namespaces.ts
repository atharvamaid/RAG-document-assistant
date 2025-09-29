import express from "express";
import { index } from "../utils/pineconeClient.js";

const router = express.Router();

/**
 * List namespaces available in this index.
 */
router.get("/", async (req, res) => {
  try {
    // Some Pinecone SDKs expose listNamespaces()
    const resp = await index.listNamespaces?.();

    // Normalize
    const namespaces =
      resp?.namespaces ? Object.keys(resp.namespaces) : resp ?? [];

    return res.json({ namespaces });
  } catch (err) {
    console.error("list namespaces error:", err);
    return res.status(500).json({ error: "Failed to list namespaces" });
  }
});

/**
 * Delete a namespace (clear all vectors in it).
 */
router.delete("/:namespace", async (req, res) => {
  const namespace = req.params.namespace;
  if (!namespace) return res.status(400).json({ error: "Namespace required" });

  try {
    // Prefer deleteNamespace if available
    const deletedNamespace = await index.deleteNamespace(namespace);

    return res.json({ success: true, deletedNamespace });
  } catch (err) {
    console.error("delete namespace error:", err);
    return res.status(500).json({ error: "Failed to delete namespace" });
  }
});

export default router;
