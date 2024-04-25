import { DIRECTION } from '@/js/constants';

export function createAnim(frames, frameLen) {
  return function resolveFrame(distance) {
    const frameIndex = Math.floor(distance / frameLen) % frames.length;
    const frameName = frames[frameIndex];
    return frameName;
  };
}

export function createAnimByDirection(frames, frameLen) {
  return {
    [DIRECTION.UP]: createAnim(frames.map((frame) => frame + DIRECTION.UP), frameLen),
    [DIRECTION.DOWN]: createAnim(frames.map((frame) => frame + DIRECTION.DOWN), frameLen),
    [DIRECTION.LEFT]: createAnim(frames.map((frame) => frame + DIRECTION.LEFT), frameLen),
    [DIRECTION.RIGHT]: createAnim(frames.map((frame) => frame + DIRECTION.RIGHT), frameLen),
  };
}
