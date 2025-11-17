AI Health Buddy - Minimal example
=================================

What you get:
- React + Vite frontend (client)
- Express backend (server) handling uploads and simple endpoints:
  - POST /api/analyze  -> accepts file, placeholder summarization
  - POST /api/upload   -> stores report metadata and file
  - GET  /api/reports  -> list stored reports
  - POST /api/chat     -> health-only chatbot (placeholder)
  - GET  /api/trend    -> simple trend counts

IMPORTANT: This repo contains placeholders where you must add:
- OCR pipeline (e.g., Tesseract or cloud OCR) to extract text from uploaded images/PDFs
- Integration with Gemini (Google GenAI) or other LLM (set API keys and call the models)

Quick start (Linux / macOS / WSL):
1. Clone or unzip the project.
2. Install server dependencies:
   cd server
   npm install
   export GOOGLE_API_KEY="YOUR_KEY"
   node index.js
3. Install client dependencies:
   cd ../client
   npm install
   npm run dev
4. Open http://localhost:5173 (Vite default dev port) and make sure the backend is on :3001
