require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { generateReply } = require('./gemini');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let documentStore = "";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: "ok" });
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const ext = req.file.originalname.split('.').pop().toLowerCase();
    let content = "";

    if (ext === "pdf") {
      const parsed = await pdfParse(req.file.buffer);
      content = parsed.text;
    } else {
      content = req.file.buffer.toString("utf-8");
    }

    documentStore = content;
    res.json({ message: "Document uploaded successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const reply = await generateReply(message, documentStore);
    res.json({ reply });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});