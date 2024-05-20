import { Vec2 } from '@/js/math';

export default class Joystick {
  constructor() {
    this.maxRadius = 40;
    this.circle = document.createElement('div');
    this.circle.style.cssText = `
      position: fixed;
      display: none;
      width: ${this.maxRadius * 2}px;
      height: ${this.maxRadius * 2}px;
      border: 1px solid rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      user-select: none;
      transform: translate(-50%, -50%);
    `;

    this.circle.style.display = 'none';

    const thumb = document.createElement('div');
    thumb.style.cssText = ` 
      position: absolute;
      left: 0px;
      top: 0px;
      width: ${this.maxRadius}px;
      height: ${this.maxRadius}px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.8);
      user-select: none;
      transform: translate(50%, 50%);
    `;

    this.circle.appendChild(thumb);
    document.body.appendChild(this.circle);
    this.domElement = thumb;
    this.origin = null;
    this.move = this.move.bind(this);
    this.up = this.up.bind(this);

    document.addEventListener('touchstart', this.tap.bind(this), { passive: false });
  }

  get dragging() {
    return this.circle.style.display === 'block';
  }

  getMousePosition(event) {
    const clientX = event.targetTouches ? event.targetTouches[0].pageX : event.clientX;
    const clientY = event.targetTouches ? event.targetTouches[0].pageY : event.clientY;

    return new Vec2(clientX, clientY);
  }

  tap(event) {
    event.preventDefault();
    event = event || window.event;
    this.origin = this.getMousePosition(event);

    document.addEventListener('touchmove', this.move, { passive: false });
    document.addEventListener('touchend', this.up, { passive: false });
    document.addEventListener('touchcancel', this.up, { passive: false });
  }

  move(event) {
    event.preventDefault();
    event = event || window.event;
    const mouse = this.getMousePosition(event);

    const delta = mouse
      .clone()
      .sub(this.origin)
      .limit(this.maxRadius);

    if (!this.dragging) {
      this.circle.style.top = `${mouse.y}px`;
      this.circle.style.left = `${mouse.x}px`;
      this.circle.style.display = 'block';
    }

    this.domElement.style.top = `${delta.y}px`;
    this.domElement.style.left = `${delta.x}px`;

    delta.normalize();

    if (this.onMove !== undefined) {
      this.onMove({ x: Math.floor(delta.x * 600) / 600, y: Math.floor(delta.y * 600) / 600 });
    }
  }

  up(event) {
    event.preventDefault();
    if (this.dragging) {
      this.reset();
    } else {
      if (this.onTouch !== undefined) {
        this.onTouch();
      }
    }    
  }

  reset() {
    this.origin = null;
    this.domElement.style.top = '0px';
    this.domElement.style.left = '0px';
    this.circle.style.display = 'none';

    if (this.onMove !== undefined) {
      this.onMove({ x: 0, y: 0 });
    }

    document.removeEventListener('touchmove', this.move, { passive: false });
    document.removeEventListener('touchend', this.up, { passive: false });
    document.removeEventListener('touchcancel', this.up, { passive: false });
  }

  onTouch() {}

  onMove() {}
}