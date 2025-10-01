import api from "./axisoInstance";

export const sendChatMessage = async (question: string, namespace:string) => {
  const res = await api.post("/query", { question, namespace});
  return res.data;
};
