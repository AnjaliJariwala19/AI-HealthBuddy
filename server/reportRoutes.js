// reportRoutes.js
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// Upload folder
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// --------------------
// Routes
// --------------------

// Upload a report
router.post("/upload", upload.single("report"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    res.json({
        success: true,
        fileName: req.file.originalname,
    });
});

// List all reports
router.get("/", (req, res) => {
    const files = fs.existsSync(UPLOAD_DIR) ? fs.readdirSync(UPLOAD_DIR) : [];
    res.json({ reports: files });
});

// Delete a report
router.delete("/:reportName", (req, res) => {
    const reportName = path.basename(req.params.reportName); // prevents ../ attacks
    const filePath = path.join(UPLOAD_DIR, reportName);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
    }

    fs.unlinkSync(filePath);
    res.json({ success: true });
});

// Download a report
// Download a report
router.get("/download/:reportName", (req, res) => {
    const reportName = req.params.reportName;
    const filePath = path.join(UPLOAD_DIR, reportName);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
    }

    res.download(filePath, reportName, (err) => {
        if (err) {
            console.error("Download error:", err);
            res.status(500).send("Could not download file");
        }
    });
});


export default router;
