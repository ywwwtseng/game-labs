import upload from './middlewares/upload.js';
import SpritesController from './controllers/sprites_controller.js';
import Object2DController from './controllers/object2ds_controller.js';

const routes = (app) => {
  // sprites
  app.post('/api/sprites/create', upload.single('image'), SpritesController.create);
  app.get('/api/sprites', SpritesController.get);
  // object2d
  app.get('/api/object2ds', Object2DController.list);
  app.post('/api/object2ds', Object2DController.create);
  app.post('/api/object2ds/:id/anim/enable', Object2DController.enableAnim);
  app.post('/api/object2ds/:id/anim/disable', Object2DController.disableAnim);
  app.post('/api/object2ds/:id/anim/frame', Object2DController.addAnimFrame);
};

export default routes;