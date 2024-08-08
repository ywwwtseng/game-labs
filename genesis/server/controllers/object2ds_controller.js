const Object2DController = {
  async create(req, res) {
    await req.db.update(({ object2ds }) => {
      object2ds.push({
        id: `object2d_${Date.now()}`,
        name: req.body.name,
        tiles: req.body.tiles,
        frames: null,
      });
    });
  
    res.send({
      ok: true,
      message: 'Object2D uploaded successfully',
    });
  },

  async list(req, res) {
    const { object2ds } = req.db.data;
    res.send({ list: object2ds });
  },

  async enableAnim(req, res) {
    const { object2ds } = req.db.data;
    const index = object2ds.findIndex((object2d) => object2d.id === req.params.id);

    if (index === -1) {
      return res.status(400).send('No Object2D founded.');
    }

    if (object2ds[index].frames) {
      return res.status(400).send('Object2D Animation created already.');
    }

    await req.db.update(({ object2ds }) => {
      object2ds[index].frames = [object2ds[index].tiles];
      object2ds[index].tiles = null;
    });

    res.send({
      ok: true,
      message: 'Object2D animation enabled successfully',
    });
  },

  async disableAnim(req, res) {
    const { object2ds } = req.db.data;
    const index = object2ds.findIndex((object2d) => object2d.id === req.params.id);

    if (index === -1) {
      return res.status(400).send('No Object2D founded.');
    }

    await req.db.update(({ object2ds }) => {
      object2ds[index].tiles = object2ds[index].frames[0];
      object2ds[index].frames = null;
    });

    res.send({
      ok: true,
      message: 'Object2D animation disabled successfully',
    });
  },

  async addAnimFrame(req, res) {
    const { object2ds } = req.db.data;
    const index = object2ds.findIndex((object2d) => object2d.id === req.params.id);

    if (index === -1) {
      return res.status(400).send('No Object2D founded.');
    }

    if (!object2ds[index].frames) {
      return res.status(400).send('No Object2D animation attribute founded.');
    }

    await req.db.update(({ object2ds }) => {
      object2ds[index].frames.push(req.body.tiles);
    });

    res.send({
      ok: true,
      message: 'Object2D animation frame added successfully',
    });
  },
}

export default Object2DController;