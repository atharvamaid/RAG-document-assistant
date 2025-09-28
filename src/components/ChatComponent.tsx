// src/components/ChatComponent.tsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  LinearProgress,
  Typography,
  Paper,
} from "@mui/material";
import { sendChatMessage } from "../services/chat-service";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  sender: "user" | "bot";
  text: string;
  sources?: [{ metadata: { source: string } }];
}

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChatMessage(newMessage.text);
      setMessages((prev) => [...prev, { sender: "bot", text: res.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error fetching response" },
      ]);
      console.error("Error fetching response:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3} border="1px solid #ddd" borderRadius={2}>
      <Typography variant="h6" gutterBottom>
        Chat
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          height: 400,
          overflowY: "auto",
          p: 2,
          mb: 2,
          backgroundColor: "#fafafa",
        }}
      >
        {messages.map((msg, i) => (
          <Box
            key={i}
            sx={{
              mb: 2,
              p: 1.5,
              borderRadius: 2,
              bgcolor: msg.sender === "user" ? "#e3f2fd" : "#f1f8e9",
            }}
          >
            {msg.sender === "bot" ? (
              <ReactMarkdown
                children={msg.text}
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ ...props }) => <Typography variant="h5" {...props} />,
                  h2: ({ ...props }) => <Typography variant="h6" {...props} />,
                  li: ({ ...props }) => (
                    <li style={{ marginBottom: "4px" }} {...props} />
                  ),
                  strong: ({ ...props }) => (
                    <strong style={{ color: "#1976d2" }} {...props} />
                  ),
                }}
              />
            ) : (
              <Typography>{msg.text}</Typography>
            )}

            {msg.sources && (
              <Box mt={1}>
                <Typography variant="caption" color="textSecondary">
                  Sources:
                </Typography>
                <ul>
                  {msg.sources.map((s, idx) => (
                    <li key={idx}>
                      <Typography variant="caption">
                        {s.metadata?.source}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Box>
        ))}
        {loading && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        )}
      </Paper>

      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button variant="contained" onClick={handleSend} disabled={loading}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatComponent;
