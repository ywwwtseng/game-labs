import { useContext } from "react";
import { AppContext } from "../store/AppContext";
import { Text } from "./Text";
import { SelectIcon } from "./icon/SelectIcon";
import { CheckIcon } from "./icon/CheckIcon";

function Information() {
  const { state } = useContext(AppContext);

  return (
    <div className="flex items-center px-2 py-1 rounded w-full bg-[#282828] mt-1">
      <SelectIcon className="mr-0.5" size="4" />
      <Text className="ml-1">Select Mode</Text>
      <div className="flex items-center ml-4">
        {state.selectedIndex && (
          <>
            <CheckIcon  />
            <Text className="ml-1">{`Selected: ${state.selectedIndex[0]},${state.selectedIndex[1]}`}</Text>
          </>
        )}
      </div>
      <div className="flex items-center ml-auto">
        {state.location && (
          <Text>{`Location: ${state.location[0]},${state.location[1]}`}</Text>
        )}
      </div>
    </div>
  );
}

export { Information };
