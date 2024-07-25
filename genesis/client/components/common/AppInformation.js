import { useSelector } from "react-redux";
import { Text } from "@/components/ui/Text";
import { SelectIcon } from "@/components/icon/SelectIcon";
import { CheckIcon } from "@/components/icon/CheckIcon";
import { MODE } from "@/constants";

function AppInformation() {
  const selected = useSelector((state) => state.selectMode.selected);
  const poistion = useSelector((state) => state.appState.cursor.poistion);
  const mode = useSelector((state) => state.appState.mode);

  return (
    <div className="flex items-center max-h-[24px] min-h-[24px] h-[24px] px-2 py-1 rounded w-full bg-[#282828] mt-1">
      {mode === MODE.SELECT && (
        <>
          <SelectIcon className="mr-0.5" size="4" />
          <Text className="ml-1">Select Mode</Text>
          <div className="flex items-center ml-4">
            {selected.index && (
              <>
                <CheckIcon />
                <Text className="ml-1">{`Selected: ${selected.index[0]},${selected.index[1]},${selected.index[2]},${selected.index[3]}`}</Text>
              </>
            )}
          </div>
        </>
      )}
      
      <div className="flex items-center ml-auto">
        {poistion && <Text>{`Location: ${poistion[0]},${poistion[1]}`}</Text>}
      </div>
    </div>
  );
}

export { AppInformation };
