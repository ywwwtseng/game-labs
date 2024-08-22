import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { JSONFilePreset } from 'lowdb/node';
import { fileURLToPath } from 'url';
import cors from 'cors';
import lowdb from './middlewares/lowdb.js';
import routes from './routes.js';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const defaultData = { lands: [], sprites: [], object2ds: [] };
const db = await JSONFilePreset('world.json', defaultData);

const app = express();
const port = 3000;

app.use(cors());
app.use(lowdb(db));
app.use(express.static('dist'));
app.use(express.static('public'));
app.use('/world.json', express.static('world.json'));
app.use(bodyParser.json({limit: '50mb'}));

app.get('/', (req, res) => {
  // Send the HTML file as the response
  res.sendFile(path.join(__dirname, 'index.html'));
});

routes(app);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
