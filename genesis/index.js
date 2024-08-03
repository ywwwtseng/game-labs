import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { JSONFilePreset } from 'lowdb/node';

const defaultData = { sprites: [] };
const db = await JSONFilePreset('db.json', defaultData);

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const app = express();
const port = 3000;

const unless = function (path, middleware) {
  return function (req, res, next) {
    if (path === req.baseUrl) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
};

app.use(express.static('dist'));
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  // Send the HTML file as the response
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Configure Multer to store uploaded files in the 'uploads' directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'public/sprites/';
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, Date.now() + '.' + ext);
  },
});

const upload = multer({ storage: storage });

app.get('/api/sprites', (req, res) => {
  const { sprites } = db.data;
  res.send({ list: sprites });
});

app.post('/api/sprites/:source/patterns', async (req, res) => {
  const { sprites } = db.data;
  const source = req.params.source;
  const index = sprites.findIndex((sprite) => sprite.id === req.params.source);

  if (index === -1) {
    return res.status(400).send('No match any sprites.');
  }

  await db.update(({ sprites }) => {
    sprites[index] = {
      ...sprites[index],
      patterns: [
        ...sprites[index].patterns,
        {
          id: `${source}.P${sprites[index].patterns.length}`,
          name: req.body.name,
          tiles: req.body.tiles,
        },
      ],
    };
  });

  res.send({
    ok: true,
    message: 'Pattern uploaded successfully',
  });
});

// Route to handle file upload
app.post('/api/image/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  await db.update(({ sprites }) =>
    sprites.push({
      id: req.file.path.match(/\d+/g).join(''),
      name: req.file.originalname.replace('.png', ''),
      path: req.file.path.replace('public', ''),
      transparent: req.body.transparent,
      patterns: [],
      animations: [],
    }),
  );

  res.send({
    ok: true,
    message: `File uploaded successfully: ${req.file.path}`,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
