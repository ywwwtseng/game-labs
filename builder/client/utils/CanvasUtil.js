import { MatrixUtil } from '@/utils/MatrixUtil';
import { DomUtil } from '@/utils/DomUtil';
import { Vec2Util } from '@/utils/Vec2Util';
import { overlaps, contain, completely_contain, getBoundingBox } from '@/helpers/BoundingBox';
import { Object2DUtil } from '@/utils/Object2DUtil';

class CanvasUtil {
  static get transparent() {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAB9JREFUOE9jZKAQMFKon2HUAIbRMGAYDQNQPhr4vAAAJpgAEX/anFwAAAAASUVORK5CYII=';
  }

  static getPosition(event, box) {
    const bounds = getBoundingBox(box);
    const originX = event.pageX - bounds.pos.x;
    const originY = event.pageY - bounds.pos.y;

    return {
      x: Math.min(Math.max(1, originX), bounds.size.x - 1),
      y: Math.min(Math.max(1, originY), bounds.size.y - 1),
      within:
        originX >= 0 &&
        originX <= bounds.size.x &&
        originY >= 0 &&
        originY <= bounds.size.y,
    };
  }

  static getDraggedIconPosition(event, rect, offset = { x: 0, y: 0 }) {
    const size = MatrixUtil.size(rect);

    const pos = Vec2Util.calc(CanvasUtil.getPosition(event, event.target), {
      add: { x: -(size.x / 2) + offset.x, y: -(size.y / 2) + offset.y },
    });

    return pos;
  }

  static getDraggedIconRect(event, T) {
    const rect = Object2DUtil.isObject2D(T) ? Object2DUtil.getRect(T) : T;
    const pos = CanvasUtil.getDraggedIconPosition(event, rect, { x: 8, y: 8 });
    const index = CanvasUtil.positionToIndex(pos);

    return [...index, rect[2], rect[3]];
  }

  static getRectPosIndex(rect) {
    const { pos } = getBoundingBox(rect);
    const index = CanvasUtil.positionToIndex(pos);
    return index;
  }

  static positionToIndex(pos) {
    const indexX = pos.x === 0 ? 0 : Math.ceil(pos.x / 16) - 1;
    const indexY = pos.y === 0 ? 0 : Math.ceil(pos.y / 16) - 1;
    return [indexX, indexY];
  }

  static cameraToRect(camera) {
    return [
      ...CanvasUtil.positionToIndex(camera.pos),
      Math.ceil(camera.size.x / 16) + 1,
      Math.ceil(camera.size.y / 16) + 1,
    ];
  }

  static indexToPosition(index) {
    return {
      x: index[0] * 16,
      y: index[1] * 16,
    };
  }

  static clear(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  static grid(ctx, { width, height, color = '#424242' }) {
    for (var x = 0; x <= width; x += 16) {
      ctx.moveTo(0.5 + x, 0);
      ctx.lineTo(0.5 + x, height);
    }

    for (var x = 0; x <= height; x += 16) {
      ctx.moveTo(0, 0.5 + x);
      ctx.lineTo(width, 0.5 + x);
    }

    ctx.strokeStyle = color;
    ctx.stroke();
  }

  static selected(ctx, selected, color = 'white') {
    if (!selected) {
      return;
    }
    ctx.beginPath();
    ctx.rect(
      (selected[0] + (selected[2] > 0 ? 0 : +1)) * 16 + 0.5,
      (selected[1] + (selected[3] > 0 ? 0 : +1)) * 16 + 0.5,
      selected[2] * 16,
      selected[3] * 16
    );
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  static drawSelected(selectedRect, spriteSheet, displayId) {
    const canvas = document.createElement('canvas');
    canvas.id = displayId;
    canvas.width = selectedRect[2] * 16;
    canvas.height = selectedRect[3] * 16;
    const ctx = canvas.getContext('2d');

    MatrixUtil.traverse(selectedRect, ({ x, y }, index) => {
      ctx.drawImage(
        spriteSheet.tiles[index.x][index.y].buffer,
        0,
        0,
        16,
        16,
        x * 16,
        y * 16,
        16,
        16
      );
    });

    return canvas;
  }

  static normalizeRect(rect) {
    if (!rect) {
      return rect;
    }

    const [x, y, dx, dy] = rect;

    return [
      dx > 0 ? x : x + dx + 1,
      dy > 0 ? y : y + dy + 1,
      Math.abs(dx),
      Math.abs(dy),
    ];
  }

  static calc(rect, { limit }) {
    if (limit) {
      const [x, y, dx, dy] = CanvasUtil.normalizeRect(rect);
      const bounds = getBoundingBox(limit);
      const maxIndex = CanvasUtil.positionToIndex({
        x: bounds.size.x,
        y: bounds.size.y,
      });

      return [
        x + dx >= maxIndex[0] ? maxIndex[0] - dx : Math.max(0, x),
        y + dy >= maxIndex[1] ? maxIndex[1] - dy : Math.max(0, y),
        dx,
        dy,
      ];
    }

    return false;
  }

  static createBuffer(width, height, render) {
    const buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    if (render) {
      render(buffer.getContext('2d'));
    }
    return buffer;
  }

  static createBufferBySource(source, x, y, width, height) {
    const buffer = CanvasUtil.createBuffer(width, height);
    buffer
      .getContext('2d')
      .drawImage(source, x, y, width, height, 0, 0, width, height);

    return buffer;
  }

  static traverseTilesWithRect(tiles, rect, callback) {
    if (!rect) {
      MatrixUtil.traverse(tiles, callback);
    } else {
      MatrixUtil.traverse(rect, (_, { x, y }) => {
        const value = tiles?.[x]?.[y];

        if (value) {
          callback({ value, x, y });
        }

      });
    }
  }

  static drawBufferOnCanvas(ctx, buffer, x, y, camera, globalAlpha = 1) {
    ctx.globalAlpha = globalAlpha;
    ctx.drawImage(buffer, 0, 0, 16, 16, x * 16 - (camera?.pos?.x || 0), y * 16 - (camera?.pos?.y || 0), 16, 16);
    ctx.globalAlpha = 1;
  }

  static drawTilesOnCanvas({ ctx, tiles, rect, camera, offset = { x: 0, y: 0 }, globalAlpha = 1 }) {
    CanvasUtil.traverseTilesWithRect(tiles, rect, ({ value, x, y }) => {
      if (value?.buffer) {
        CanvasUtil.drawBufferOnCanvas(
          ctx,
          value.buffer,
          offset.x + x,
          offset.y + y,
          camera,
          globalAlpha
        );
      } else if (Array.isArray(value)) {
        value.forEach((tile) => {
          CanvasUtil.drawBufferOnCanvas(
            ctx,
            tile.buffer,
            offset.x + x,
            offset.y + y,
            camera,
            globalAlpha,
          );
        });
      }
    });
  }

  static transferTilesToBuffer({ tiles, spriteSheets }) {
    return MatrixUtil.create(tiles, ({ value: tileItems }) => {
      return tileItems?.map((tile) => ({
        buffer: spriteSheets[tile.source].tiles[tile.index[0]][tile.index[1]].buffer,
      }));
    });
  }

  static createSpriteLayers({ land, spriteSheets }) {
    if (Object.keys(spriteSheets).length === 0) {
      return [];
    }

    return land.layers.map((layer) => {
      return {
        tiles: MatrixUtil.map(layer.tiles, ({ value: tileItems }) => {
          return tileItems.map((tile) => {
            if (tile.source && tile.index) {
              const { source, index } = tile;
              return {
                buffer: spriteSheets[source].tiles[index[0]][index[1]].buffer,
              };
            }
          });
        }),
      };
    });
  }

  static createSpriteLayersBuffer(
    layers,
    camera,
    width = camera.size.x + 1,
    height = camera.size.y + 1
  ) {
    return CanvasUtil.createBuffer(width, height, (ctx) => {
      layers.forEach((layer) => {
        CanvasUtil.drawTilesOnCanvas({
          ctx,
          tiles: layer.tiles,
          camera, 
          rect: CanvasUtil.cameraToRect(camera),
          globalAlpha: 1
        });        
      });
    });
  }

  static createObject2DBuffers({ land, spriteSheets, object2ds }) {
    const buffer = {};
    if (Object.keys(spriteSheets).length === 0 || object2ds.length === 0) {
      return buffer;
    }

    land.layers.forEach((layer) => {
      layer.object2ds.forEach(({ id: object2d_id }) => {
        const object2d = object2ds.find(({ id }) => id === object2d_id);
        if (object2d && !buffer[object2d.id]) {
          if (Object2DUtil.hasAnimation(object2d)) {
            buffer[object2d.id] = {
              anim: {
                rate: object2d.anim.rate,
                frames: object2d.anim.frames.map((tiles) => {
                  return CanvasUtil.transferTilesToBuffer({ tiles, spriteSheets });
                })
              }
            };
          } else {
            buffer[object2d.id] = CanvasUtil.transferTilesToBuffer({ tiles: object2d.tiles, spriteSheets });
          }
        }
      })
    });

    return buffer;
  }

  static createObject2DLayersBuffer({
    ctx,
    lifetime,
    land,
    object2ds,
    spriteSheets,
    object2DBuffers,
    camera
  }) {
    if (Object.keys(spriteSheets).length === 0 || object2ds.length === 0) {
      return [];
    }

    return land.layers.forEach((layer) => {
      layer.object2ds.forEach((object2d) => {
        if (object2d.id && !object2DBuffers[object2d.id]) {
          return;
        }

        const inCamera = camera && CanvasUtil.inCamera(object2d, camera);
        const globalAlpha = !camera || inCamera ? 1 : 0.2;

        if (object2DBuffers[object2d.id].anim) {
          const anim = object2DBuffers[object2d.id].anim;
          const frameLen =  (1 / 60) * (12 / anim.rate);
          const frameIndex = lifetime ? Math.floor(lifetime / frameLen) % anim.frames.length : 0;
          const frame = anim.frames[frameIndex];

         

          CanvasUtil.drawTilesOnCanvas({
            ctx,
            tiles: frame,
            offset: { x: object2d.rect[0], y: object2d.rect[1]},
            camera,
            globalAlpha,
          });
        } else {


          const tilesBuffer = object2DBuffers[object2d.id];
          CanvasUtil.drawTilesOnCanvas({
            ctx, 
            tiles: tilesBuffer, 
            offset: { x: object2d.rect[0], y: object2d.rect[1] },
            camera,
            globalAlpha,
          });
        }
      });
    });
  }

  static createGridBuffer(width, height) {
    return CanvasUtil.createBuffer(width, height, (ctx) => {
      CanvasUtil.grid(ctx, { width, height });
    });
  }

  static hasExistedTile({
    selectedArea,
    tilesOrigin,
    layer,
    transparent,
  }) {
    for (let x = 0; x < selectedArea[2]; x++) {
      for (let y = 0; y < selectedArea[3]; y++) {
        if (
          layer.tiles?.[selectedArea[0] + x]?.[selectedArea[1] + y] &&
          !transparent.includes(
            `${tilesOrigin[0] + x}.${tilesOrigin[1] + y}`
          )
        ) {
          return true;
        }
      }
    }

    return false;
  }

  static copyLandTiles(rect, land, callback) {
    const layer = land.layers[land.selectedLayerIndex];
    return MatrixUtil.create(rect, (_, { x, y }) => {
      const tileItems = layer.tiles?.[x]?.[y];

      return callback ? callback(tileItems) : tileItems;
    });
  }

  static findObject2DBySelectedRect(rect, land, camera) {
    const object2ds = land.layers[land.selectedLayerIndex].object2ds;

    for (let i = object2ds.length - 1; i >= 0; i--) {
      const object2d = object2ds[i];

      if (CanvasUtil.same(CanvasUtil.toCameraSpace(rect, camera), object2d.rect)) {
        return object2d;
      }
    }

    return null;
  }

  static toCameraSpace(rect, camera) {
    return [
      rect[0] + camera.pos.x / 16,
      rect[1] + camera.pos.y / 16,
      rect[2],
      rect[3],
    ]
  }

  static toWorldSpace(rect, camera) {
    return [
      rect[0] - camera.pos.x / 16,
      rect[1] - camera.pos.y / 16,
      rect[2],
      rect[3],
    ]
  }

  static inCamera(object2d, camera) {
    const rect = CanvasUtil.toWorldSpace(object2d.rect, camera);

    return rect[0] >= 0
      && rect[1] >= 0
      && (rect[0] + rect[2]) * 16 <= camera.size.x
      && (rect[1] + rect[3]) * 16 <= camera.size.y;
  }


  static cloneLandSelectedObject2D(rect, land, object2ds, camera) {

    const object2d = CanvasUtil.findObject2DBySelectedRect(rect, land, camera);
    return {
      id: object2d.id,
      tiles: Object2DUtil.tiles(object2ds.find(({ id }) => object2d.id === id)),
    };
  }

  // return followed selected rects
  static getFollowedSelectedRects(selectedRect, land, camera) {
    if (!selectedRect) {
      return [];
    }

    selectedRect = CanvasUtil.toCameraSpace(selectedRect, camera);

    const object2ds = land.layers[land.selectedLayerIndex].object2ds;
    const follows = [[], []];
 

    for (let i = object2ds.length - 1; i >= 0; i--) {
      const object2d = object2ds[i];

      // unsame and overlaps
      if (
        follows.flat().every((rect) => !CanvasUtil.same(rect, object2d.rect))
        && overlaps(object2d.rect, selectedRect)
        && CanvasUtil.inCamera(object2d, camera)
      ) {

        // not select behind contain object2d
        if (follows.flat().every((rect) => !contain(object2d.rect, { in: rect }))) {

          if (completely_contain(selectedRect, { in: object2d.rect })) {
            follows[1].unshift(object2d.rect);
          } else {
            follows[0].unshift(object2d.rect);
          }
        }
      }
    }

    if (follows[0].length === 0 && follows[1].length > 0) {
      const size = Math.min(...follows[1].map((rect) => rect[2] * rect[3]));
      const minRect = follows[1].find((rect) => rect[2] * rect[3] === size);
      follows[0].unshift(minRect);

      follows[1].forEach((rect) => {
        if (rect[2] * rect[3] !== size && !completely_contain(minRect, { in: rect })) {
          follows[0].unshift(rect);
        }
      });

    }

    return follows[0].map((rect) => [
      rect[0] - camera.pos.x / 16,
      rect[1] - camera.pos.y / 16,
      rect[2],
      rect[3]
    ]);
  }

  static getSelectedObject2DIndicesMap({ land, rects }) {
    const indices = {};
    const layerIndex = land.selectedLayerIndex;
    const object2ds = land.layers[layerIndex].object2ds;

    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i];

      for (let j = object2ds.length - 1; j >= 0; j--) {
        const object2d = land.layers[layerIndex].object2ds[j];

        if (object2d && CanvasUtil.same(rect, object2d.rect)) {
          indices[j] = object2d;
          break;
        }
      }
    }

    return indices;
  }

  static getObject2DRect(object2d) {
    return [0, 0, ...MatrixUtil.sizeCount(object2d.tiles || object2d.frames[0])];
  }

  static createFollowCursor({ event, rect, groupRect, canvas }) {
    if (!rect) {
      return null;
    }
    const pos1 = CanvasUtil.getPosition(event, canvas);
    const [x, y] = groupRect;

    const pos0 = CanvasUtil.indexToPosition([x, y]);

    const deltaRect = [groupRect[0] - rect[0], groupRect[1] - rect[1]];

    const vec = Vec2Util.calc(pos1, {
      sub: Vec2Util.calc(pos0, { add: Vec2Util.unit }),
    });

    return ({ event: nextEvent }) => {
      const pos = Vec2Util.calc(CanvasUtil.getPosition(nextEvent, canvas), {
        sub: vec,
      });
      const index = CanvasUtil.positionToIndex(pos);

      const newGroupRect = CanvasUtil.calc(
        [index[0], index[1], groupRect[2], groupRect[3]],
        {
          limit: canvas,
        }
      );

      return [
        newGroupRect[0] - deltaRect[0],
        newGroupRect[1] - deltaRect[1],
        rect[2],
        rect[3],
      ];
    };
  }

  static createFollowIndex({ index, rect }) {
    const vec = [index[0] - rect[0], index[1] - rect[1]];

    return (nextIndex) => {
      return [nextIndex[0] - vec[0], nextIndex[1] - vec[1], rect[2], rect[3]];
    };
  }

  static getGroupRect(group) {
    const bounds = [];

    for (let index = 0; index < group.length; index++) {
      const rect = group[index];

      if (bounds[0] === undefined || rect[0] < bounds[0]) {
        bounds[0] = rect[0];
      }

      if (bounds[1] === undefined || rect[1] < bounds[1]) {
        bounds[1] = rect[1];
      }

      if (bounds[2] === undefined || rect[0] + rect[2] > bounds[2]) {
        bounds[2] = rect[0] + rect[2];
      }

      if (bounds[3] === undefined || rect[1] + rect[3] > bounds[3]) {
        bounds[3] = rect[1] + rect[3];
      }
    }

    return [bounds[0], bounds[1], bounds[2] - bounds[0], bounds[3] - bounds[1]];
  }

  static exportLand({ land, spriteSheets, object2ds }) {
    const layers = CanvasUtil.createSpriteLayers({ land, spriteSheets });
    const object2DBuffers = CanvasUtil.createObject2DBuffers({ land, spriteSheets, object2ds });

    const buffer = CanvasUtil.createBuffer(land.width, land.height, (ctx) => {
      layers.forEach((layer) => {
        CanvasUtil.drawTilesOnCanvas({ ctx, tiles: layer.tiles });
        CanvasUtil.createObject2DLayersBuffer({ ctx, land, object2ds, spriteSheets, object2DBuffers })     
      });
    });

    DomUtil.downloadImage({ name: `${land.name}.png`, buffer });
  }

  static same(any1, any2) {
    return any1.every((item, index) => item === any2[index]);
  }

  static sameTile(tile1, tile2) {
    return tile1.source === tile2.source && Vec2Util.same(tile1.index, tile2.index);
  }
}

export { CanvasUtil };
