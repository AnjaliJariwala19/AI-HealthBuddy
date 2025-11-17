import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Tesseract from "tesseract.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import reportRoutes from "./reportRoutes.js"; 


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// File upload setup
const upload = multer({ dest: "uploads/" });

// Gemini init
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use the correct model your key supports
const analyzeModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const chatModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash"
});

//const reportModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });



app.post("/api/analyze", upload.single("report"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const { path } = req.file;
    console.log("OCR started...");
    const ocr = await Tesseract.recognize(path, "eng");
    const extractedText = ocr.data.text;
    console.log("OCR completed.");
    console.log("Gemini summarizing...");
    // Correct request format for new Gemini API
    const result = await analyzeModel.generateContent({
      contents: [
        {
          parts: [
            {
              text: "Summarize this medical report:\n\n" + extractedText,
            },
          ],
        },
      ],
    });

    const summary = result.response.text();
    console.log("Summary ready.");

    res.json({ summary });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const userMsg = req.body.message || "";
    console.log("💬 Chat message received:", userMsg);

    // ---- MEDICAL SAFETY GUARD ----
    const medicalKeywords = [
      "health","blood","pressure","sugar","diabetes","bp","fever","cold",
      "symptom","pain","heart","cholesterol","medicine","treatment",
      "medical","doctor","diet","fitness","exercise","injury","vitamins","vitamin","calcium","bone"
    ];

    const isMedical = medicalKeywords.some(k =>
      userMsg.toLowerCase().includes(k)
    );

    if (!isMedical) {
      return res.json({
        answer: "⚠️ I can answer only *health and medical* related questions. Please ask something regarding symptoms, health, diet, diseases, or well-being."
      });
    }

    // ---- CALL GEMINI MODEL ----
    const result = await chatModel.generateContent([
      { text: `You are a medical assistant. Give only health-related info and avoid unrelated topics.` },
      { text: userMsg }
    ]);

    const botReply = result.response.text();
    console.log("🤖 Reply:", botReply);

    // ---- SEND REPLY TO FRONTEND ----
    return res.json({ answer: botReply });

  } catch (err) {
    console.error("❌ Chat API Error:", err);
    return res.status(500).json({
      answer: "⚠️ The health assistant is currently unavailable. Try again shortly."
    });
  }
});

// app.post("/api/reports/upload", upload.single("report"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//     const { path: filePath, originalname } = req.file;

//     // OCR for images
//     console.log("🟢 OCR started...");
//     const ocr = await Tesseract.recognize(filePath, "eng");
//     const extractedText = ocr.data.text;
//     console.log("🔵 OCR completed.");

//     // Summarize with Gemini
//     console.log("🟢 Generating summary...");
//     const response = await reportModel.generateContent(
//       "Please summarize this medical report:\n\n" + extractedText
//     );
//     const summary = response.response.text();
//     console.log("🔵 Summary ready.");

//     // Optionally, save summary to disk
//     const summariesDir = path.join(process.cwd(), "summaries");
//     if (!fs.existsSync(summariesDir)) fs.mkdirSync(summariesDir);
//     fs.writeFileSync(path.join(summariesDir, originalname + ".txt"), summary);

//     res.json({ summary });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to process report" });
//   }
// });


// app.get("/api/reports", (req, res) => {
//   try {
//     const uploadsDir = path.join(process.cwd(), "uploads");
//     const files = fs.existsSync(uploadsDir)
//       ? fs.readdirSync(uploadsDir)
//       : [];
//     res.json({ reports: files });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch reports" });
//   }
// });

app.use("/api/reports", reportRoutes);


const PORT = process.env.PORT || 3002; // changed from 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

