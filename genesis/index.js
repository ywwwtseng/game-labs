import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { JSONFilePreset } from "lowdb/node";

const defaultData = { sprites: [] };
const db = await JSONFilePreset("db.json", defaultData);

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const app = express();
const port = 3000;

app.use(express.static("dist"));
app.use(express.static("public"));

app.get("/", (req, res) => {
  // Send the HTML file as the response
  res.sendFile(path.join(__dirname, "index.html"));
});

// Configure Multer to store uploaded files in the 'uploads' directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "public/sprites/";
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, Date.now() + "." + ext);
  },
});

const upload = multer({ storage: storage });

app.get("/api/sprites", (req, res) => {
  const { sprites } = db.data;
  const filenames = fs.readdirSync(path.join(__dirname, "public", "sprites"));
  res.send({ filenames, list: sprites });
});

app.post("/api/sprites/:source/patterns", (req, res) => {

});

// Route to handle file upload
app.post("/api/image/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  await db.update(({ sprites }) =>
    sprites.push({
      name: req.file.originalname.replace(".png", ""),
      source: req.file.path.replace("public", ""),
      transparent: req.body.transparent,
      patterns: [],
      animations: [],
    })
  );

  res.send({
    ok: true,
    message: `File uploaded successfully: ${req.file.path}`,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
