import { createContext, useEffect, useReducer, useCallback, useMemo } from "react";
import useSWR from "swr";
import { produce } from "immer";
import { LoaderUtil } from "@/utils/LoaderUtil";
import { CanvasUtil } from "@/utils/CanvasUtil";

const INITIAL_STATE = {
  mode: "select",
  location: null,
  selectedIndex: null,
  spriteSheets: {},
  // scene: undefined
  scene: {
    name: 'default',
    width: 720,
    height: 720,
    tiles: [],
  },
};

const ACTIONS = {
  UPDATE_MODE: "UPDATE_MODE",
  UPDATE_LOCATION: "UPDATE_LOCATION",
  UPDATE_SELECTED_INDEX: "UPDATE_SELECTED_INDEX",
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
    case ACTIONS.UPDATE_SELECTED_INDEX:
      draft.selectedIndex = action.payload;
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

  const setSelectedIndex = useCallback((index) => {
    dispatch({
      type: ACTIONS.UPDATE_SELECTED_INDEX,
      payload: index,
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
          acc[filename] = {
            image: image,
            filename: filename,
            index: [
              Math.ceil(image.naturalWidth / 16 - 1),
              Math.ceil(image.naturalHeight / 16 - 1),
            ]
          };
          return acc;
        }, {})
      })
      .then(setSpriteSheets);
    }
  }, [data?.filenames]);

  useEffect(() => {
    const handlePress = (event) => {
      if (!state.selectedIndex || !state.scene) return

      if (event.key === 'ArrowLeft') {
        setSelectedIndex([Math.max(0, state.selectedIndex[0] - 1), state.selectedIndex[1]])
      }

      if (event.key === 'ArrowRight') {
        const index = CanvasUtil.positionToIndex({ x: state.scene.width, y: state.scene.height });
        setSelectedIndex([Math.min(index.x, state.selectedIndex[0] + 1), state.selectedIndex[1]])
      }

      if (event.key === 'ArrowUp') {
        setSelectedIndex([state.selectedIndex[0], Math.max(0, state.selectedIndex[1] - 1)])
      }

      if (event.key === 'ArrowDown') {
        const index = CanvasUtil.positionToIndex({ x: state.scene.width, y: state.scene.height });
        setSelectedIndex([state.selectedIndex[0], Math.min(index.y, state.selectedIndex[1] + 1)])
      }
    }
    window.addEventListener("keydown", handlePress);

    return () => {
      window.removeEventListener("keydown", handlePress);
    };
  }, [state.selectedIndex]);

  const value = {
    state,
    action: useMemo(() => ({
      setLocation,
      setSelectedIndex,
      setSpriteSheets,
      setScene,
      setSceneTile,
    }), [])
    
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
