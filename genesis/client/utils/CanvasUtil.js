import { BoundingBox } from "@/helpers/BoundingBox";
import { MatrixUtil } from "@/utils/MatrixUtil";

class CanvasUtil {
  static get transparent() {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAB9JREFUOE9jZKAQMFKon2HUAIbRMGAYDQNQPhr4vAAAJpgAEX/anFwAAAAASUVORK5CYII=";
  }

  static getPosition(event, box, offset = { x: 0, y: 0 }, allowDiff = 0) {
    const bounds = new BoundingBox(box);
    const originX = event.pageX - bounds.pos.x + offset.x;
    const originY = event.pageY - bounds.pos.y + offset.y;

    return {
      x: Math.min(Math.max(1, originX), bounds.size.x - 1),
      y: Math.min(Math.max(1, originY), bounds.size.y - 1),
      within:
        originX >= 0 - allowDiff &&
        originX <= bounds.size.x + allowDiff &&
        originY >= 0 - allowDiff &&
        originY <= bounds.size.y + allowDiff,
    };
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
    }
  }

  static clear(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  static grid(ctx, { width, height, color = "#424242" }) {
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

  static selected(ctx, selected, color = "white") {
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
    const canvas = document.createElement("canvas");
    canvas.id = displayId;
    canvas.width = selectedRect[2] * 16;
    canvas.height = selectedRect[3] * 16;
    const ctx = canvas.getContext("2d");
    const [originX, originY, sizeIndexX, sizeIndexY] = selectedRect;

    MatrixUtil.traverse([sizeIndexX, sizeIndexY], (x, y) => {
      ctx.drawImage(
        spriteSheet.tiles[originX + x][originY + y].buffer,
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
      const bounds = new BoundingBox(limit);
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
    const buffer = document.createElement("canvas");
    buffer.width = width;
    buffer.height = height;
    if (render) {
      render(buffer.getContext("2d"));
    }
    return buffer;
  }

  static createBufferBySource(source, x, y, width, height) {
    const buffer = CanvasUtil.createBuffer(width, height);
    buffer
      .getContext("2d")
      .drawImage(source, x, y, width, height, 0, 0, width, height);

    return buffer;
  }

  static createTileBuffer(tiles, width, height) {
    return CanvasUtil.createBuffer(
      width,
      height,
      (ctx) => {
        tiles.forEach((layer) => {
          MatrixUtil.forEach(layer.tiles, (tile, x, y) => {
            ctx.drawImage(
              tile.buffer,
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
        });
      }
    );
  }

  static createGridBuffer(width, height) {
    return CanvasUtil.createBuffer(
      width,
      height,
      (ctx) => {
        CanvasUtil.grid(ctx, { width, height });
      }
    );
  }

  static hasExistedTile({
    selectedArea,
    firstTileOriginInSprite,
    layer,
    transparent,
  }) {
    for (let x = 0; x < selectedArea[2]; x++) {
      for (let y = 0; y < selectedArea[3]; y++) {
        if (
          layer.tiles?.[selectedArea[0] + x]?.[selectedArea[1] + y] &&
          !transparent.includes(`${firstTileOriginInSprite[0] + x}.${firstTileOriginInSprite[1] + y}`)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  static getSceneSelectedTiles(selectedArea, layer, callback = (any) => any) {
    return MatrixUtil.createByRect(selectedArea, (x, y) => {
      const tile = layer.tiles?.[selectedArea[0] + x]?.[selectedArea[1] + y];
      return callback(tile);
    })
  }
}

export { CanvasUtil };
