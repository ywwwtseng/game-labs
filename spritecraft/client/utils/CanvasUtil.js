class CanvasUtil {
  static getPositionInCanvas(event) {
    const offset = event.target.getBoundingClientRect();
    return {
      x: event.pageX - offset.x,
      y: event.pageY - offset.y,
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
    ctx.beginPath();
    ctx.rect(
      selected[0] * 16 + 0.5,
      selected[1] * 16 + 0.5,
      16,
      16
    );
    ctx.strokeStyle = color;
    ctx.stroke();
  }
}

export { CanvasUtil };