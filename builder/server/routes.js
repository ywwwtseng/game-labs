import upload from './middlewares/upload.js';
import Controller from './controllers/controller.js';

const routes = (app) => {
  app.post('/api/sql', Controller.sql);
  app.post('/api/sql-formdata', upload.single('image'), Controller.sql);
};

export default routes;