import { Container, Stack, Box, Paper, Typography } from "@mui/material";
import ChatComponent from "./components/ChatComponent";
import FileUploadComponent from "./components/FileUploaderComponent";

export default function App() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        AI Doc Bot
      </Typography>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        alignItems="stretch"
      >
        {/* Left column */}
        <Box sx={{ flex: 1 }}>
          <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
            <FileUploadComponent />
          </Paper>
        </Box>

        {/* Right column */}
        <Box sx={{ flex: 3 }}>
          <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
            <ChatComponent />
          </Paper>
        </Box>
      </Stack>
    </Container>
  );
}
