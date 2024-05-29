import Scene from '@/engine/Scene';
import Camera from '@/engine/Camera';
import Compositor from '@/engine/Compositor';
import EventEmitter from '@/engine/EventEmitter';
import MusicController from '@/engine/MusicController';
import TileCollider from '@/engine/TileCollider';
import EntityCollider from '@/engine/EntityCollider';

import { findPlayers } from '@/js/helpers/player';
import * as tileHandlers from '@/js/tiles';

function focusPlyer(scene) {
  for (const player of findPlayers(scene.entities)) {
    scene.camera.pos.x = Math.floor(player.pos.x - scene.camera.size.x / 2 + player.size.x / 2);
    scene.camera.pos.y = Math.floor(player.pos.y - scene.camera.size.y / 2 + player.size.y / 2);
  }
}

export default class WorldScene extends Scene {
  static EVENT_TRIGGER = Symbol('scene trigger');

  constructor() {
    super();

    this.name = '';
    this.totalTime = 0;

    this.camera = new Camera();
    this.music = new MusicController();
    this.entities = [];
    this.entityCollider = new EntityCollider(this.entities);
    this.tileCollider = new TileCollider({ handlers: tileHandlers });
  }

  draw(gameContext) {
    this.comp.draw(gameContext.videoContext, this.camera);
  }

  update(gameContext) {
    this.entities.forEach((entity) => {
      entity.update(gameContext, this);
    });

    this.entities.forEach((entity) => {
      this.entityCollider.check(entity);
    });

    this.entities.forEach((entity) => {
      entity.finalize();
    });

    focusPlyer(this);

    this.totalTime += gameContext.deltaTime;
  }

  pause() {
    this.music.pause();
  }
}