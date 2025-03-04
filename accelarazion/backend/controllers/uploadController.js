//This file will:
//Process the CSV file.
//Call the upload model to insert data into NeonDB.

const uploadModel = require("../models/uploadModels");
const fs = require("fs");
const csv = require("csv-parser");

exports.upload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = req.file.path;
  const results = [];

  // Read CSV file and parse data
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => results.push(row))
    .on("end", async () => {
      try {
        await uploadModel.insertJobAds(results);
        res.status(200).json({ message: "CSV uploaded and processed successfully!" });
      } catch (error) {
        console.error("Upload failed:", error);
        res.status(500).json({ error: "Error processing file" });
      } finally {
        // Delete temporary file
        fs.unlinkSync(filePath);
      }
    });
};
