import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { JSONFilePreset } from 'lowdb/node';

const defaultData = { sprites: [], patterns: [] };
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

app.get('/api/patterns', (req, res) => {
  const { patterns } = db.data;
  res.send({ list: patterns });
});

app.post('/api/patterns', async (req, res) => {
  await db.update(({ patterns }) => {
    patterns.push({
      id: `pattern_${Date.now()}`,
      name: req.body.name,
      tiles: req.body.tiles,
    });
  });

  res.send({
    ok: true,
    message: 'Pattern uploaded successfully',
  });
});

app.post('/api/patterns/:id/anim/create', async (req, res) => {
  const { patterns } = db.data;
  const index = patterns.findIndex((pattern) => pattern.id === req.params.id);

  if (index === -1) {
    return res.status(400).send('No pattern founded.');
  }

  if (patterns[index].frames) {
    return res.status(400).send('Pattern Animation created already.');
  }

  // console.log(index)
  await db.update(({ patterns }) => {
    patterns[index].frames = [patterns[index].tiles];
    patterns[index].tiles = null;
  });

  res.send({
    ok: true,
    message: 'Pattern animation created successfully',
  });
});

// Route to handle file upload
app.post('/api/image/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  await db.update(({ sprites }) =>
    sprites.push({
      id: `sprites_${req.file.path.match(/\d+/g).join('')}`,
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
