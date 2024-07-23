import { createContext, useEffect, useReducer, useCallback, useMemo } from "react";
import useSWR from "swr";
import { produce } from "immer";
import { LoaderUtil } from "@/utils/LoaderUtil";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { MatrixUtil } from "@/utils/MatrixUtil";

const INITIAL_STATE = {
  mode: "select",
  location: null,
  selected: {
    progress: false,
    index: null,
  },
  spriteSheets: {},
  // scene: undefined
  scene: {
    name: 'default',
    width: 560,
    height: 560,
    tiles: [],
  },
};

const ACTIONS = {
  UPDATE_MODE: "UPDATE_MODE",
  UPDATE_LOCATION: "UPDATE_LOCATION",
  SELECT_START: "SELECT_START",
  SELECT: "SELECT",
  SELECT_STOP: "SELECT_STOP",
  UPDATE_SPRITESHEETS: "UPDATE_SPRITESHEETS",
  UPDATE_SCENE: "UPDATE_SCENE",
  UPDATE_SCENE_TILE: "UPDATE_SCENE_TILE",
};

const reducer = produce((draft, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_MODE:
      draft.mode = action.payload;
      break;
    case ACTIONS.UPDATE_LOCATION:
      draft.location = action.payload;
      break;
    case ACTIONS.SELECT_START:
      draft.selected.progress = !!action.payload;
      draft.selected.index = action.payload;
      break;
    case ACTIONS.SELECT:
      draft.selected.index = action.payload;
      break;
    case ACTIONS.SELECT_STOP:
        draft.selected.progress = false;
        break;
    case ACTIONS.UPDATE_SPRITESHEETS:
      draft.spriteSheets = { ...draft.spriteSheets, ...action.payload };
      break;
    case ACTIONS.UPDATE_SCENE:
      draft.scene = { ...draft.scene, ...action.payload };
      break;
    case ACTIONS.UPDATE_SCENE_TILE:
       if (!draft.scene.tiles[action.payload.x]) {
        draft.scene.tiles[action.payload.x] = [];
      }
      draft.scene.tiles[action.payload.x][action.payload.y] = action.payload.tile;
      break;
    default:
      break;
  }
});

export const AppContext = createContext(INITIAL_STATE);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { data } = useSWR("/api/sprites");

  const setLocation = useCallback((location) => {
    dispatch({ type: ACTIONS.UPDATE_LOCATION, payload: location });
  }, []);

  const selectStart = useCallback((index) => {
    dispatch({
      type: ACTIONS.SELECT_START,
      payload: index,
    });
  }, []);

  const select = useCallback((index) => {
    dispatch({
      type: ACTIONS.SELECT,
      payload: index,
    });
  }, []);

  const selectStop = useCallback((index) => {
    dispatch({
      type: ACTIONS.SELECT_STOP,
    });
  }, []);

  const setSpriteSheets = useCallback((spriteSheets) => {
    dispatch({
      type: ACTIONS.UPDATE_SPRITESHEETS,
      payload: spriteSheets,
    });
  }, []);

  const setScene = useCallback(({ name, width, height }) => {
    dispatch({
      type: ACTIONS.UPDATE_SCENE,
      payload: { name, width, height, tiles: [] },
    });
  }, []);

  const setSceneTile = useCallback((x, y, tile) => {
    dispatch({
      type: ACTIONS.UPDATE_SCENE_TILE,
      payload: { x, y, tile },
    });
  }, []);

  useEffect(() => {
    if (data && data.filenames) {
      Promise.all(
        data.filenames
          .filter(filename => !Object.keys(state.spriteSheets).includes(filename))
          .map((filename) => Promise.all([filename, LoaderUtil.loadImage(`${window.location.origin}/sprites/${filename}`)]))
      )
      .then((spriteSheets) => {
        return spriteSheets.reduce((acc, [filename, image]) => {
          const index = [
            Math.ceil(image.naturalWidth / 16 - 1),
            Math.ceil(image.naturalHeight / 16 - 1),
          ];

          const tiles = MatrixUtil.createByIndex(index, (x, y) => {
            return {
              type: "tile",
              buffer: CanvasUtil.createBuffer(image, x * 16, y * 16, 16, 16)
            };
          });

          acc[filename] = {
            image,
            filename,
            index,
            tiles,
          };
          return acc;
        }, {})
      })
      .then(setSpriteSheets);
    }
  }, [data?.filenames]);

  useEffect(() => {
    const handlePress = (event) => {
      if (!state.selected || !state.scene) return

      if (event.key === 'ArrowLeft') {
        selectStart([Math.max(0, state.selected[0] - 1), state.selected[1]])
      }

      if (event.key === 'ArrowRight') {
        const index = CanvasUtil.positionToIndex({ x: state.scene.width, y: state.scene.height });
        selectStart([Math.min(index.x, state.selected[0] + 1), state.selected[1]])
      }

      if (event.key === 'ArrowUp') {
        selectStart([state.selected[0], Math.max(0, state.selected[1] - 1)])
      }

      if (event.key === 'ArrowDown') {
        const index = CanvasUtil.positionToIndex({ x: state.scene.width, y: state.scene.height });
        selectStart([state.selected[0], Math.min(index.y, state.selected[1] + 1)])
      }
    }
    window.addEventListener("keydown", handlePress);

    return () => {
      window.removeEventListener("keydown", handlePress);
    };
  }, [state.selected]);

  const value = {
    state,
    action: useMemo(() => ({
      setLocation,
      selectStart,
      select,
      selectStop,
      setSpriteSheets,
      setScene,
      setSceneTile,
    }), [])
    
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
