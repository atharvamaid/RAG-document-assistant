// src/api/fileApi.ts
import api from "./axisoInstance";

export const processFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/process-file", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
