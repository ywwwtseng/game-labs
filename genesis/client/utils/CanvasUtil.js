import range from 'lodash-es/range';
import { getBoundingBox } from '@/helpers/BoundingBox';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { Vec2Util } from '@/utils/Vec2Util';
import { overlaps, contain } from '@/helpers/BoundingBox';

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

  static drawTilesOnCanvas(ctx, T, offset = { x: 0, y: 0 }) {
    MatrixUtil.traverse(T, ({ value, x, y }) => {
      if (value.buffer) {
        CanvasUtil.drawBufferOnCanvas(
          ctx,
          value.buffer,
          offset.x + x,
          offset.y + y
        );
      }
    });
  }

  static createSpriteLayerBuffer(layers, width, height) {
    return CanvasUtil.createBuffer(width, height, (ctx) => {
      layers.forEach((layer) => {
        CanvasUtil.drawTilesOnCanvas(ctx, layer.tiles);

        layer.patterns?.forEach((pattern) => {
          pattern.index.forEach((index) => {
            CanvasUtil.drawTilesOnCanvas(ctx, pattern.tiles, {
              x: index[0],
              y: index[1],
            });
          });
        });
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

  static cloneSceneSelectedTiles(rect, scene, callback = (any) => any) {
    const layer = scene.layers[scene.selectedLayerIndex];
    return MatrixUtil.create(rect, (_, { x, y }) => {
      const tile = layer.tiles?.[x]?.[y];
      return callback({ tile, x, y });
    });
  }

  static findPatternBySelectedRect(rect, scene) {
    const patterns = Object.values(
      scene.layers[scene.selectedLayerIndex].patterns
    );

    for (let i = patterns.length - 1; i >= 0; i--) {
      const pattern = patterns[i];

      for (let j = 0; j < pattern.index.length; j++) {
        const index = pattern.index[j];

        if (CanvasUtil.same(rect, [index[0], index[1], ...MatrixUtil.sizeIndex(pattern.tiles)])) {
          return pattern;
        }
      }
    }

    return null;
  }

  static cloneSceneSelectedPattern(rect, scene) {
    const pattern = CanvasUtil.findPatternBySelectedRect(rect, scene);
    const source = pattern.id.split('.')[0];
    const tiles = MatrixUtil.create(pattern.tiles, ({ value: index }) =>
      index
        ? {
            index,
            source,
          }
        : undefined
    );

    return {
      id: pattern.id,
      tiles,
    };
  }

  static getFollowedSelectedPatternRects(selectedRect, scene) {
    if (!selectedRect) {
      return [];
    }

    const patterns = Object.values(
      scene.layers[scene.selectedLayerIndex].patterns
    );

    return Object.values(patterns)
      .map((pattern) => {
        const size = MatrixUtil.sizeIndex(pattern.tiles);
        return pattern.index.map(([x, y]) => {
          const rect = [x, y, ...size];
          if (
            overlaps(rect, selectedRect) ||
            contain(rect, { in: selectedRect })
          ) {
            return rect;
          }
        });
      })
      .flat()
      .reduce((acc, val) => {
        if (val && !acc.some(rect => CanvasUtil.same(rect, val))) {
          return [...acc, val];
        }
        return acc;
      }, []);
  }

  static getPatternRect(pattern) {
    return [0, 0, ...MatrixUtil.sizeIndex(pattern.tiles)];
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

      if (!bounds[0] || rect[0] < bounds[0]) {
        bounds[0] = rect[0];
      }

      if (!bounds[1] || rect[1] < bounds[1]) {
        bounds[1] = rect[1];
      }

      if (!bounds[2] || rect[0] + rect[2] > bounds[2]) {
        bounds[2] = rect[0] + rect[2];
      }

      if (!bounds[3] || rect[1] + rect[3] > bounds[3]) {
        bounds[3] = rect[1] + rect[3];
      }
    }

    return [bounds[0], bounds[1], bounds[2] - bounds[0], bounds[3] - bounds[1]];
  }

  static same(any1, any2) {
    return any1.every((item, index) => item === any2[index]);
  }
}

export { CanvasUtil };
