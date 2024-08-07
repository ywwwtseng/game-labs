import { getBoundingBox } from '@/helpers/BoundingBox';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { DomUtil } from '@/utils/DomUtil';
import { Vec2Util } from '@/utils/Vec2Util';
import { overlaps, contain } from '@/helpers/BoundingBox';
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

  static drawBufferOnCanvas(ctx, buffer, x, y) {
    ctx.drawImage(buffer, 0, 0, 16, 16, x * 16, y * 16, 16, 16);
  }

  static drawTilesOnCanvas(ctx, tile, offset = { x: 0, y: 0 }) {
    MatrixUtil.traverse(tile, ({ value, x, y }) => {
      if (value?.buffer) {
        CanvasUtil.drawBufferOnCanvas(
          ctx,
          value.buffer,
          offset.x + x,
          offset.y + y
        );
      } else if (Array.isArray(value)) {

        value.forEach((tile) => {
          CanvasUtil.drawBufferOnCanvas(
            ctx,
            tile.buffer,
            offset.x + x,
            offset.y + y
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

  static createSpriteLayers({ land, spriteSheets, object2ds }) {
    if (Object.keys(spriteSheets).length === 0 || object2ds.length === 0) {
      return [];
    }

    return land.layers.map((layer) => {
      return {
        tiles: MatrixUtil.map(layer.tiles, (tileItems) => {
          return tileItems.map((tile) => {
            if (tile.source && tile.index) {
              const { source, index } = tile;
              return {
                buffer: spriteSheets[source].tiles[index[0]][index[1]].buffer,
              };
            }
          });
        }),
        object2ds: layer.object2ds.reduce((acc, { id: object2d_id, rect: object2d_rect }) => {
          const object2d = object2ds.find(({ id }) => id === object2d_id);

          
          if (!acc.buffer[object2d.id]) {
            if (Object2DUtil.hasAnimation(object2d)) {
              acc.buffer[object2d.id] = {
                frames: object2d.frames.map((tiles) => {
                  return CanvasUtil.transferTilesToBuffer({ tiles, spriteSheets });
                })
              };
            } else {

              acc.buffer[object2d.id] = CanvasUtil.transferTilesToBuffer({ tiles: object2d.tiles, spriteSheets });
            }
          }

          acc.order = [...acc.order, {
            id: object2d.id,
            rect: object2d_rect,
          }];

          return acc;
        }, { buffer: {}, order: [] }),
      };
    });
  }

  static createSpriteLayerBuffer(layers, width, height) {
    return CanvasUtil.createBuffer(width, height, (ctx) => {
      layers.forEach((layer) => {
        CanvasUtil.drawTilesOnCanvas(ctx, layer.tiles);

        if (layer.object2ds) {
          layer.object2ds.order.forEach((object2d) => {
            const tilesBuffer = layer.object2ds.buffer[object2d.id].frames?.[0] || layer.object2ds.buffer[object2d.id];
            CanvasUtil.drawTilesOnCanvas(ctx, tilesBuffer, {
              x: object2d.rect[0],
              y: object2d.rect[1],
            });
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
    localOriginIndex,
    layer,
    transparent,
  }) {
    for (let x = 0; x < selectedArea[2]; x++) {
      for (let y = 0; y < selectedArea[3]; y++) {
        if (
          layer.tiles?.[selectedArea[0] + x]?.[selectedArea[1] + y] &&
          !transparent.includes(
            `${localOriginIndex[0] + x}.${localOriginIndex[1] + y}`
          )
        ) {
          return true;
        }
      }
    }

    return false;
  }

  static cloneLandSelectedTiles(rect, land, callback = (any) => any) {
    const layer = land.layers[land.selectedLayerIndex];
    return MatrixUtil.create(rect, (_, { x, y }) => {
      return layer.tiles?.[x]?.[y]?.map((tile) => {
        return callback({ tile, x, y });
      });
    });
  }

  static findObject2DBySelectedRect(rect, land) {
    const object2ds = land.layers[land.selectedLayerIndex].object2ds;

    for (let i = object2ds.length - 1; i >= 0; i--) {
      const object2d = object2ds[i];

      if (CanvasUtil.same(rect, object2d.rect)) {
        return object2d;
      }
    }

    return null;
  }

  static cloneLandSelectedObject2D(rect, land, object2ds) {
    const object2d = CanvasUtil.findObject2DBySelectedRect(rect, land);
    const source = object2d.id.split('.')[0];
    const tiles = object2ds.find(({ id }) => object2d.id === id).tiles;

    return {
      id: object2d.id,
      tiles: object2ds.find(({ id }) => object2d.id === id).tiles,
    };
  }

  static getFollowedSelectedObject2DRects(selectedRect, land) {
    if (!selectedRect) {
      return [];
    }

    const object2ds = land.layers[land.selectedLayerIndex].object2ds;

    let follows = [];

    for (let i = object2ds.length - 1; i >= 0; i--) {
      const object2d = object2ds[i];

      if (follows.every((rect) => !CanvasUtil.same(rect, object2d.rect)) && overlaps(object2d.rect, selectedRect)) {
        if (follows.every((rect) => !contain(object2d.rect, { in: rect }))) {
          follows.unshift(object2d.rect);
        }
      }

      if (contain(selectedRect, { in: object2d.rect })) {
        follows = [object2d.rect];
        break;
      }
      
    }

    return follows;
  }

  static getObject2DRect(object2d) {
    return [0, 0, ...MatrixUtil.sizeIndex(object2d.tiles || object2d.frames[0])];
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
    const layers = CanvasUtil.createSpriteLayers({ land, spriteSheets, object2ds });
    const buffer = CanvasUtil.createSpriteLayerBuffer(
      layers,
      land.width,
      land.height,
    );

    DomUtil.downloadImage({ name: `${land.name}.png`, buffer });
  }

  static same(any1, any2) {
    return any1.every((item, index) => item === any2[index]);
  }
}

export { CanvasUtil };
