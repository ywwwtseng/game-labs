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
}

export { CanvasUtil };