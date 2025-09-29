# 📚 RAG Document Assistant

An **AI-powered document assistant** that lets users upload files, converts them into embeddings, stores them in **Pinecone**, and answers questions using **Retrieval-Augmented Generation (RAG)** powered by **OpenAI GPT**.  

🚀 Built with **React (frontend)**, **Express (backend)**, **OpenAI API**, and **Pinecone Vector DB**.

---
## 📖 About

The **RAG Document Assistant** is a full-stack project that demonstrates how to combine **Large Language Models (LLMs)** with external knowledge bases using **Retrieval-Augmented Generation (RAG)**.  

The goal of this project is to let users **chat with their own documents**:  
- Upload files (PDF, DOCX, TXT)  
- Convert them into **embeddings** using OpenAI  
- Store them in **Pinecone** for efficient semantic search  
- Ask questions and get **context-aware answers** with source references 

## ✨ Features
- 📂 Upload PDF, DOCX, or TXT documents
- 🔍 Automatic text extraction + smart chunking
- 🧠 Embedding generation with OpenAI API
- 📦 Vector storage in Pinecone
- 💬 Ask questions and get contextual answers
- 📑 Source references for transparency
- 🎨 Clean Material-UI interface

---

## 📸 Screenshots

### Home Page

### Chat Interface
<img width="1478" height="755" alt="Screenshot 2025-09-28 at 5 04 46 PM" src="https://github.com/user-attachments/assets/14b9d9cc-c9af-464e-a39c-636f7bf491a8" />

---

## 🛠️ Tech Stack
- **Frontend:** React, Material-UI, Axios
- **Backend:** Express, Node.js, Multer
- **AI:** OpenAI GPT, OpenAI Embeddings
- **Vector DB:** Pinecone
- **Utilities:** pdfjs-dist, mammoth (for text extraction)
- **Deployment:** Docker / Vercel / Render (future)

---

## ⚙️ Setup Instructions

### Clone the Repo
```bash
- git clone https://github.com/<your-username>/RAG-document-assistant.git
- cd RAG-document-assistant
- npm install
- npm run dev
- cd server
- npm install
- npm run dev
```

server running on localhost:5000

## Usage
 - Upload a document (PDF/DOCX/TXT).
 - Wait for embeddings to be processed and stored in Pinecone.
 - Ask questions in the chat interface.
 - Get contextual answers with source references.
 
