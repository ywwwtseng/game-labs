import {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
} from "react";
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
    name: "default",
    width: 560,
    height: 560,
    layers: [
      {
        tiles: [],
      }
    ],
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
  ADD_LAYER: "ADD_LAYER",
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
    case ACTIONS.ADD_LAYER:
      draft.scene.layers.push([{ tiles: [] }]);
      break;
    case ACTIONS.UPDATE_SCENE_TILE:
      if (!draft.scene.layers[0].tiles[action.payload.index[0]]) {
        draft.scene.layers[0].tiles[action.payload.index[0]] = [];
      }
      draft.scene.layers[0].tiles[action.payload.index[0]][action.payload.index[1]] =
        action.payload.tile;
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

  const selectStop = useCallback(() => {
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

  const addLayer = useCallback((scene) => {
    dispatch({
      type: ACTIONS.ADD_LAYER,
      payload: {},
    });
  }, []);

  const setSceneTile = useCallback((index, tile) => {
    dispatch({
      type: ACTIONS.UPDATE_SCENE_TILE,
      payload: { index, tile },
    });
  }, []);

  useEffect(() => {
    if (data && data.filenames) {
      Promise.all(
        data.filenames
          .filter(
            (filename) => !Object.keys(state.spriteSheets).includes(filename)
          )
          .map((filename) =>
            Promise.all([
              filename,
              LoaderUtil.loadImage(
                `${window.location.origin}/sprites/${filename}`
              ),
            ])
          )
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
                buffer: CanvasUtil.createBuffer(image, x * 16, y * 16, 16, 16),
              };
            });

            acc[filename] = {
              image,
              filename,
              index,
              tiles,
            };
            return acc;
          }, {});
        })
        .then(setSpriteSheets);
    }
  }, [data?.filenames]);

  useEffect(() => {
    const handlePress = (event) => {
      if (!state.selected.index || !state.scene) return;
      const index = CanvasUtil.rect(state.selected.index);
      const sizeX = index[2];
      const sizeY = index[3];

      if (event.key === "ArrowLeft") {
        select([
          Math.max(0, index[0] - 1),
          index[1],
          sizeX,
          sizeY,
        ]);
      }

      if (event.key === "ArrowRight") {
        const maxIndex = CanvasUtil.positionToIndex({
          x: state.scene.width,
          y: state.scene.height,
        });
        select([
          Math.min(maxIndex[0] - sizeX + 1, index[0] + 1),
          index[1],
          sizeX,
          sizeY,
        ]);
      }

      if (event.key === "ArrowUp") {
        select([
          index[0],
          Math.max(0, index[1] - 1),
          sizeX,
          sizeY,
        ]);
      }

      if (event.key === "ArrowDown") {
        const maxIndex = CanvasUtil.positionToIndex({
          x: state.scene.width,
          y: state.scene.height,
        });
        select([
          index[0],
          Math.min(maxIndex[1] - sizeY + 1, index[1] + 1),
          sizeX,
          sizeY,
        ]);
      }

      if (event.key === "Backspace") {
        MatrixUtil.traverse([sizeX, sizeY], (x, y) => {
          setSceneTile(
            [index[0] + x, index[1] + y],
            undefined
          );
        });
      }
    };
    window.addEventListener("keydown", handlePress);

    return () => {
      window.removeEventListener("keydown", handlePress);
    };
  }, [state.selected]);

  const value = {
    state,
    action: useMemo(
      () => ({
        setLocation,
        selectStart,
        select,
        selectStop,
        setSpriteSheets,
        setScene,
        setSceneTile,
        addLayer,
      }),
      []
    ),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
