import { useContext } from "react";
import { AppContext } from "@/store/AppContext";
import { Text } from "@/components/ui/Text";
import { SelectIcon } from "@/components/icon/SelectIcon";
import { CheckIcon } from "@/components/icon/CheckIcon";

function AppInformation() {
  const { state } = useContext(AppContext);

  return (
    <div className="flex items-center px-2 py-1 rounded w-full bg-[#282828] mt-1">
      <SelectIcon className="mr-0.5" size="4" />
      <Text className="ml-1">Select Mode</Text>
      <div className="flex items-center ml-4">
        {state.selected.index && (
          <>
            <CheckIcon  />
            <Text className="ml-1">{`Selected: ${state.selected.index[0]},${state.selected.index[1]},${state.selected.index[2]},${state.selected.index[3]}`}</Text>
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

export { AppInformation };
