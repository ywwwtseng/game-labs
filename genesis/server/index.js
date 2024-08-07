import express from 'express';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { JSONFilePreset } from 'lowdb/node';
import lowdb from './middlewares/lowdb.js';
import routes from './routes.js';

const defaultData = { sprites: [], object2ds: [] };
const db = await JSONFilePreset('db.json', defaultData);

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const app = express();
const port = 3000;

app.use(lowdb(db));
app.use(express.static('dist'));
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  // Send the HTML file as the response
  res.sendFile(path.join(__dirname, 'index.html'));
});

routes(app);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
