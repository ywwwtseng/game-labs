class CanvasUtil {
  static getPositionInCanvas(event, canvas) {
    const bounds = canvas.getBoundingClientRect();
    const originX = event.pageX - bounds.x;
    const originY = event.pageY - bounds.y;

    return {
      x: Math.min(Math.max(1, originX), bounds.width - 1),
      y: Math.min(Math.max(1, originY), bounds.height - 1),
      within: originX >= 1 && originX <= bounds.width - 1 && originY >= 1 && originY <= bounds.height - 1
    };
  }
  
  static positionToIndex(pos) {
    return {
      x: Math.ceil((pos.x) / 16) - 1,
      y: Math.ceil((pos.y) / 16) - 1,
    };
  }

  static clear(ctx, { width, height }) {
    ctx.clearRect(0, 0, width, height);
  }

  static grid(ctx, { width, height, scale, color = "#424242" }) {
    for (var x = 0; x <= width; x += (16 * scale)) {
      ctx.moveTo(0.5 + x, 0);
      ctx.lineTo(0.5 + x, height);
    }
    
    for (var x = 0; x <= height; x += (16 * scale)) {
      ctx.moveTo(0, 0.5 + x);
      ctx.lineTo(width, 0.5 + x);
    }
    
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  static selected(ctx, selected, color = "white") {
    ctx.beginPath();
    ctx.rect(
      (selected[0] + (selected[2] > 0 ? 0 : + 1)) * 16 + 0.5,
      (selected[1] + (selected[3] > 0 ? 0 : + 1)) * 16 + 0.5,
      selected[2] * 16,
      selected[3] * 16,
    );
    ctx.strokeStyle = color;
    ctx.stroke();
  }
  
  static createBuffer(source, x, y, width, height) {
    const buffer = document.createElement('canvas');
    buffer.width = width; 
    buffer.height = height;
    buffer
      .getContext('2d')
      .drawImage(
        source,
        x,
        y,
        width,
        height,
        0,
        0,
        width,
        height,
      );
    
    return buffer;
  }

  static rect(selectedIndex) {
    const dx = selectedIndex[2];
    const dy = selectedIndex[3];

    return [
      dx > 0 ? selectedIndex[0] : selectedIndex[0] + dx + 1,
      dy > 0 ? selectedIndex[1] : selectedIndex[1] + dy + 1,
      Math.abs(dx),
      Math.abs(dy),
    ];
  }
}

export { CanvasUtil };