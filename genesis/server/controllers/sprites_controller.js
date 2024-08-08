const SpritesController = {
  async create(req, res) {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
  
    await req.db.update(({ sprites }) =>
      sprites.push({
        id: `sprites_${req.file.path.match(/\d+/g).join('')}`,
        name: req.file.originalname.replace('.png', ''),
        path: req.file.path.replace('public', ''),
        transparent: req.body.transparent,
      }),
    );
  
    res.send({
      ok: true,
      message: `File uploaded successfully: ${req.file.path}`,
    });
  },

  async list(req, res) {
    const { sprites } = req.db.data;
    res.send({ data: sprites });
  }
};

export default SpritesController;