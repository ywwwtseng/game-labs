import { useSelector } from "react-redux";
import { Text } from "@/components/ui/Text";
import { SelectIcon } from "@/components/icon/SelectIcon";
import { CheckIcon } from "@/components/icon/CheckIcon";

function SelectModeInfo() {
  const selected = useSelector((state) => state.selectMode.selected);
  return (
    <>
      <SelectIcon className="mr-0.5" size={4} />
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
  );
}

export { SelectModeInfo };