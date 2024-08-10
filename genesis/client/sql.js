const sql = {
  sprites: {
    list: 'query:sprites.find()',
    create: 'mutation:sprites.create(:sprite)',
  },
  object2ds: {
    list: 'query:object2ds.find()',
    create: 'mutation:object2ds.create(:object2d)',

    anim: {
      enable: 'mutation:object2ds.find(:id).set(:anim)',
      disable: 'mutation:object2ds.find(:id).delete(:anim)',

      rate: 'mutation:object2ds.find(:id).anim.set(:rate)',
      
      frames: {
        add: 'mutation:object2ds.find(:id).anim.frames.add(:frame)',
        remove: 'mutation:object2ds.find(:id).anim.frames.delete(:index)'
      }
    },
  },
};

export { sql };