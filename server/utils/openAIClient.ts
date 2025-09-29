import OpenAI from "openai";
import "dotenv/config";

const token = process.env.OPENAI_API_KEY;
const endpoint = "https://models.github.ai/inference";
export const modelName = "gpt-4o-mini";

export const openai = new OpenAI({ baseURL: endpoint, apiKey: token });