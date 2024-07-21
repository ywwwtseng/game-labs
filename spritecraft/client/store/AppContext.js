import useSWR from "swr";
import { createContext, useEffect, useReducer } from "react";
import { loadImage, getIndex } from "../utils";

const ACTIONS = {
  UPDATE_MODE: "UPDATE_MODE",
  UPDATE_LOCATION: "UPDATE_LOCATION",
  UPDATE_SELECTED_INDEX: "UPDATE_SELECTED_INDEX",
  UPDATE_SPRITESHEETS: "UPDATE_SPRITESHEETS",
  UPDATE_SCENE: "UPDATE_SCENE",
};

const INITIAL_STATE = {
  mode: "select",
  location: null,
  selectedIndex: null,
  spriteSheets: {},
  scene: {
    width: 800,
    height: 720,
    tiles: []
  }
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_MODE:
      return { ...state, mode: action.payload };
    case ACTIONS.UPDATE_LOCATION:
      return { ...state, location: action.payload };
    case ACTIONS.UPDATE_SELECTED_INDEX:
      return { ...state, selectedIndex: action.payload };
    case ACTIONS.UPDATE_SPRITESHEETS:
      return {
        ...state,
        spriteSheets: { ...state.spriteSheets, ...action.payload },
      };
    case ACTIONS.UPDATE_SCENE:
      return {
        ...state,
        scene: { ...state.scene, ...action.payload },
      };
    default:
      return state;
  }
}

export const AppContext = createContext(INITIAL_STATE);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { data } = useSWR("/api/sprites");

  const setLocation = (location) => {
    dispatch({ type: ACTIONS.UPDATE_LOCATION, payload: location });
  };

  const setSelectedIndex = (index) => {
    dispatch({
      type: ACTIONS.UPDATE_SELECTED_INDEX,
      payload: index,
    });
  };

  const setSpriteSheets = (spriteSheets) => {
    dispatch({
      type: ACTIONS.UPDATE_SPRITESHEETS,
      payload: spriteSheets,
    });
  }

  const setSceneTile = (x, y, tile) => {
    const tiles = state.scene.tiles;

    if (!tiles[x]) {
      tiles[x] = [];
    }

    tiles[x][y] = tile;

    dispatch({
      type: ACTIONS.UPDATE_SCENE,
      payload: { tiles },
    });
  }

  useEffect(() => {
    if (data && data.filenames) {
      Promise.all(
        data.filenames
          .filter(filename => !Object.keys(state.spriteSheets).includes(filename))
          .map((filename) => Promise.all([filename, loadImage(`${window.location.origin}/sprites/${filename}`)]))
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
      if (!state.selectedIndex) return

      if (event.key === 'ArrowLeft') {
        setSelectedIndex([Math.max(0, state.selectedIndex[0] - 1), state.selectedIndex[1]])
      }

      if (event.key === 'ArrowRight') {
        const index = getIndex({ x: state.scene.width, y: state.scene.height });
        setSelectedIndex([Math.min(index.x, state.selectedIndex[0] + 1), state.selectedIndex[1]])
      }

      if (event.key === 'ArrowUp') {
        setSelectedIndex([state.selectedIndex[0], Math.max(0, state.selectedIndex[1] - 1)])
      }

      if (event.key === 'ArrowDown') {
        const index = getIndex({ x: state.scene.width, y: state.scene.height });
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
    action: {
      setLocation,
      setSelectedIndex,
      setSpriteSheets,
      setSceneTile,
    }
    
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
