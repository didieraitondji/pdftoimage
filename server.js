const express = require("express");
const multer = require("multer");
const { fromPath } = require("pdf2pic");
const path = require("path");
const fs = require("fs");
const gm = require("gm").subClass({ imageMagick: true });

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Serve static files
app.use(express.static("public"));

// Convert PDF to images
app.post("/convert", upload.single("pdf-file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const pdfPath = req.file.path;
    const originalName = path.parse(req.file.originalname).name;
    const imageFormat = req.body["image-format"] || "png";
    const pageRange = req.body["page-range"];
    const outputDir = path.join(__dirname, "converted");

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Parse page range
    let pagesToConvert = [];
    if (pageRange) {
      const parts = pageRange.split(",");
      for (const part of parts) {
        if (part.includes("-")) {
          const [start, end] = part.split("-").map(Number);
          for (let i = start; i <= end; i++) {
            pagesToConvert.push(i);
          }
        } else {
          pagesToConvert.push(Number(part));
        }
      }
      // Remove duplicates and sort
      pagesToConvert = [...new Set(pagesToConvert)].sort((a, b) => a - b);
    }

    // Configure conversion
    const baseOptions = {
      density: 150,
      saveFilename: originalName + "_page",
      savePath: outputDir,
      format: imageFormat,
      width: 1200,
      height: 1600,
    };

    const convert = fromPath(pdfPath, baseOptions);

    // Convert pages
    let result;
    if (pagesToConvert.length > 0) {
      // Convert specific pages
      result = await Promise.all(pagesToConvert.map((page) => convert(page)));
    } else {
      // Convert all pages
      result = await convert.bulk(-1);
    }

    // Process images if needed (e.g., for JPEG quality)
    if (imageFormat === "jpeg") {
      await Promise.all(
        result.map(async (item) => {
          await new Promise((resolve, reject) => {
            gm(item.path)
              .quality(85)
              .write(item.path, (err) => {
                if (err) reject(err);
                else resolve();
              });
          });
        })
      );
    }

    // Prepare response
    const images = result.map((item, index) => ({
      url: `/converted/${path.basename(item.path)}`,
      name: `${path.basename(item.path)}`,
      page: pagesToConvert.length > 0 ? pagesToConvert[index] : index + 1,
    }));

    // Clean up - remove uploaded PDF
    fs.unlinkSync(pdfPath);

    res.json({
      success: true,
      images,
      format: imageFormat,
    });
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).json({ error: "Failed to convert PDF: " + error.message });
  }
});

// Serve converted images
app.use("/converted", express.static("converted"));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
