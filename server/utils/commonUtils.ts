import fs from "fs/promises";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";
import { index } from "./pineconeClient.js";
import { openai } from "./openAIClient.js";

export async function extractText(path: string, mimetype?: string): Promise<string> {
  const buffer = await fs.readFile(path);

  // --- PDF ---
  if (mimetype?.includes("pdf")) {
    // Convert Buffer → Uint8Array
    const pdfData = new Uint8Array(buffer);

    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const strings = content.items.map((item: any) => item.str);
      text += strings.join(" ") + "\n";
    }
    return text;
  }

  // --- DOCX ---
  if (mimetype?.includes("wordprocessingml")) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  // --- TXT / Fallback ---
  return buffer.toString("utf8");
}

export function chunkText(
  text: string,
  chunkSize = 1000,
  overlap = 200
): string[] {
  const chunks: string[] = [];
  let idx = 0;
  while (idx < text.length) {
    const end = Math.min(idx + chunkSize, text.length);
    chunks.push(text.slice(idx, end).trim());
    idx += chunkSize - overlap;
  }
  return chunks;
}

export async function embedChunks(chunks: string[]): Promise<number[][]> {
  const resp = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: chunks,
  });
  return resp.data.map((d) => d.embedding);
}

export async function upsertEmbeddings(
  chunks: string[],
  embeddings: number[][],
  filename: string
) {
  const vectors = embeddings.map((values, i) => ({
    id: `${filename}-${i}`,
    values,
    metadata: { text: chunks[i] ?? "", source: filename },
  }));
  await index.upsert(vectors);
}
