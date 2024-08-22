export default class SceneManager {
  constructor(gameContext) {
    this.gameContext = gameContext;
    this.scenes = new Map();
  }

  getActiveScene() {
    return [...this.scenes.values()].find((scene) => scene.active);
  }

  async loadScene(name, Scene, params) {
    let scene;

    if (this.scenes.has(name)) {
      scene = this.scenes.get(name);
    } else {
      scene = new Scene(this.gameContext);
      scene.name = name;
      this.scenes.set(name, scene);

      if (scene.load) {
        await scene.load();
      }

      scene.loaded = true;
    }

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        scene[key] = value;
      });
    }

    return scene;
  }

  unloadScene(name) {
    this.scenes.delete(name);
  }

  runScene(name) {
    const activeScene = this.getActiveScene();

    if (activeScene) {
      activeScene.active = false;
      activeScene.pause();
    }

    const scene = this.scenes.get(name);

    if (scene) {
      scene.active = true;
    } else {
      console.warn(`missing ${name} scene.`);
    }
  }

  update(gameContext) {
    const activeScene = this.getActiveScene();

    if (activeScene && activeScene.loaded) {
      activeScene.update(gameContext);
      activeScene.draw(gameContext);
    }

    
  }
}
