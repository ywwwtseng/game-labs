import Scene from '@/engine/Scene';
import Camera from '@/engine/Camera';
import Compositor from '@/engine/Compositor';
import EventEmitter from '@/engine/EventEmitter';
import MusicController from '@/engine/MusicController';
import TileCollider from '@/engine/TileCollider';
import EntityCollider from '@/engine/EntityCollider';

import { createDashboardLayer } from '@/js/layers/dashboard';
import { createPlayerProgressLayer } from '@/js/layers/player-progress';
import { createWorldSceneLoader } from '@/js/loaders/worldScene';
import { createPlayerEnv, findPlayers } from '@/js/helpers/player';
import { debugMode } from '@/js/env';
import * as tileHandlers from '@/js/tiles';

function focusPlyer(scene) {
  for (const player of findPlayers(scene.entities)) {
    scene.camera.pos.x = Math.max(
      0,
      Math.floor(
        player.pos.x - scene.camera.size.x / 2 + player.size.x / 2,
      )
    );
    scene.camera.pos.y = Math.max(
      0,
      Math.floor(
        player.pos.y - scene.camera.size.y / 2 + player.size.y / 2,
      )
    );
  }
}

export default class WorldScene extends Scene {
  static EVENT_TRIGGER = Symbol('scene trigger');

  constructor(gameContext) {
    super();

    this.totalTime = 0;
    this.gameContext = gameContext;
    this.camera = new Camera();
    this.music = new MusicController();
    this.entities = [];
    this.entityCollider = new EntityCollider(this.entities);
    this.tileCollider = new TileCollider({ handlers: tileHandlers });
  }

  async load() {
    const loadWorldScene = createWorldSceneLoader(
      this.gameContext.entityFactory,
    );

    const setupWorldScene = await loadWorldScene();
    const { setupLand, setupEntities } = setupWorldScene(this);
    await setupLand();
    await setupEntities();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.events.listen(WorldScene.EVENT_TRIGGER, (spec, trigger, touches) => {
      if (spec.type === 'goto') {
        for (const _ of findPlayers(touches)) {
          runScene(spec.name);
          return;
        }
      }
    });

    const playerProgressLayer = createPlayerProgressLayer(
      this.gameContext.font,
      this,
    );
    // const dashboardLayer = createDashboardLayer(this.gameContext.font, this);

    const playerEnv = createPlayerEnv(this.gameContext.player);
    this.entities.unshift(playerEnv);

    // wait scene need player trait data, so we need add player into scene.
    this.entities.unshift(this.gameContext.player);

    if (debugMode) {
      // this.comp.layers.push(
      //   createCollisionLayer(this),
      //   createCameraLayer(this.camera),
      // );
      // setupMouseControl(
      //   this.gameContext.canvas,
      //   this.gameContext.player,
      //   this.camera,
      // );
    }

    // this.comp.layers.push(dashboardLayer);
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
