import api from "./axisoInstance";

export const sendChatMessage = async (question: string) => {
  const res = await api.post("/query", { question });
  return res.data;
};
