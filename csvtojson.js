import XLSX from "xlsx";
import fs from "fs";
import prisma from "./src/config/database.js";
const inputFile = "data.xlsx";   // Your Excel file
const outputFile = "data.json";  // Output JSON file

// Read Excel file
const workbook = XLSX.readFile(inputFile);

// Get first sheet name
const sheetName = workbook.SheetNames[0];

// Convert sheet to JSON
const worksheet = workbook.Sheets[sheetName];
let data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

// Optional: Format fields (recommended for clean data)
data = data.slice(1, 160);

data = data.map(row => ({

  style_code: row["Style Code"]?.toString().trim(),
  jewel_code: row["Jewel Code"]?.toString().trim(),
  price: Number(row["Selling Price"]) * 100 || 0,
  gold_kt: row["Gold Kt."]?.toString().trim(),
  gold_weight: Number(row["Gold Wt."]) || 0,
  gold_colour: row["Gold Colour"]?.toString().trim(),
  diamond_pcs: Number(row["Diamond Pcs."]) || 0,
  diamond_weight: Number(row["Diamond Wt."]) || 0,
  diamond_colour: row["Diamond Colour"]?.toString().trim(),
  diamond_clarity: row["Diamond Clarity"]?.toString().trim(),
  lab_certificate: row["Lab Certificate"]?.toString().trim(),
  height: row["Height"]?.toString().trim(),
  broadness: row["Broadness"]?.toString().trim()
}));

// Save JSON
fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));

console.log(`Converted ${data.length} records to ${outputFile}`);
