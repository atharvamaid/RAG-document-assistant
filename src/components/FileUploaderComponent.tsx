// src/components/FileUploadComponent.tsx
import React, { useState } from "react";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { processFile } from "../services/file-service";

const FileUploadComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
      setStatus("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setStatus("");
    try {
      const res = await processFile(file);
      setStatus(`Processed successfully: ${res.chunks} chunks stored`);
    } catch (err) {
      setStatus("Upload failed. Please try again.");
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3} border="1px solid #ddd" borderRadius={2} textAlign="center">
      <Typography variant="h6" gutterBottom>
        Upload Document
      </Typography>

      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ mb: 2 }}
      >
        <span>Upload File</span>
        <input type="file" hidden onChange={handleFileChange} />
      </Button>

      {file && <Typography variant="body2">{file.name}</Typography>}

      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? "Processing..." : "Upload & Process"}
        </Button>
      </Box>

      {loading && <LinearProgress sx={{ mt: 2 }} />}

      {status && (
        <Typography
          variant="body2"
          color={status.startsWith("Processed") ? "green" : "red"}
          mt={2}
        >
          {status}
        </Typography>
      )}
    </Box>
  );
};

export default FileUploadComponent;
