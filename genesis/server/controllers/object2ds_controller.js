const Object2DController = {
  async create(req, res) {
    const object = {
      id: `object2d_${Date.now()}`,
      name: req.body.name,
      tiles: req.body.tiles,
      frames: null,
    }

    await req.db.update(({ object2ds }) => {
      
      object2ds.push(object);
    });
  
    res.send({
      ok: true,
      data: object,
      message: 'Object2D uploaded successfully',
    });
  },

  async list(req, res) {
    const { object2ds } = req.db.data;
    res.send({ data: object2ds });
  },

  async enableAnim(req, res) {
    const { object2ds } = req.db.data;
    const index = object2ds.findIndex((object2d) => object2d.id === req.params.id);

    if (index === -1) {
      return res.status(400).send('No Object2D founded.');
    }

    if (object2ds[index].anim) {
      return res.status(400).send('Object2D Animation created already.');
    }

    await req.db.update(({ object2ds }) => {
      object2ds[index].anim = {
        rate: 2,
        frames: [object2ds[index].tiles],
      };
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

    if (!object2ds[index].anim) {
      return res.status(400).send('No Object2D animation attribute founded.');
    }

    await req.db.update(({ object2ds }) => {
      object2ds[index].tiles = object2ds[index].anim.frames[0];
      object2ds[index].anim = null;
    });

    res.send({
      ok: true,
      message: 'Object2D animation disabled successfully',
    });
  },

  async updateAnimRate(req, res) {
    const { object2ds } = req.db.data;
      const index = object2ds.findIndex((object2d) => object2d.id === req.params.id);
  
      if (index === -1) {
        return res.status(400).send('No Object2D founded.');
      }
  
      if (!object2ds[index].anim) {
        return res.status(400).send('No Object2D animation attribute founded.');
      }
  
      await req.db.update(({ object2ds }) => {
        object2ds[index].anim.rate = req.body.rate;
      });
  
      res.send({
        ok: true,
        message: 'Object2D animation rate updated successfully',
      });
  },

  async addAnimFrame(req, res) {
    const { object2ds } = req.db.data;
    const index = object2ds.findIndex((object2d) => object2d.id === req.params.id);

    if (index === -1) {
      return res.status(400).send('No Object2D founded.');
    }

    if (!object2ds[index].anim) {
      return res.status(400).send('No Object2D animation attribute founded.');
    }

    await req.db.update(({ object2ds }) => {
      object2ds[index].anim.frames.push(req.body.tiles);
    });

    res.send({
      ok: true,
      message: 'Object2D animation frame added successfully',
    });
  },

  async removeAnimFrame(req, res) {
    console.log('removeAnimFrame')
    const { object2ds } = req.db.data;
    const index = object2ds.findIndex((object2d) => object2d.id === req.params.id);

    if (index === -1) {
      return res.status(400).send('No Object2D founded.');
    }

    if (!object2ds[index].frames) {
      return res.status(400).send('No Object2D animation attribute founded.');
    }

    if (object2ds[index].frames.length === 1) {
      return Object2DController.disableAnim(req, res);
    }

    await req.db.update(({ object2ds }) => {
      object2ds[index].frames = object2ds[index].anim.frames.filter((_, index) => index !== Number(req.params.index));
    });

    res.send({
      ok: true,
      message: 'Object2D animation frame removed successfully',
    });
  },
}

export default Object2DController;