export const FRAME_DURATION = 1 / 60;

export const DIRECTION = {
  NONE: '.none',
  UP: '.up',
  DOWN: '.down',
  LEFT: '.left',
  RIGHT: '.right',
};

export const SIDES = {
  TOP: Symbol('top'),
  BOTTOM: Symbol('bottom'),
  RIGHT: Symbol('right'),
  LEFT: Symbol('left'),
};

export const DEGREE = {
  [0]: Math.atan2(0, 1),
  [45]: Math.atan2(1, 1),
  [67.5]: Math.atan2(2.414, 1),
  [90]: Math.atan2(1, 0),
  [112.5]: Math.atan2(2.414, -1),
  [135]: Math.atan2(1, -1),
  [180]: Math.atan2(0, -1),
  [225]: Math.atan2(-1, -1),
  [247.5]: Math.atan2(-2.414, -1),
  [270]: Math.atan2(-1, 0),
  [292.5]: Math.atan2(-2.414, 1),
  [315]: Math.atan2(-1, 1),
};
