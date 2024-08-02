import { useSelector } from "react-redux";
import { Text } from "@/components/ui/Text";
import { SelectModeInfo } from "@/components/common/AppInfo/SelectModeInfo";
import { EditModeInfo } from "@/components/common/AppInfo/EditModeInfo";
import { DrawModeInfo } from "@/components/common/AppInfo/DrawModeInfo";
import { MODE } from "@/constants";

const ModeInfo = {
  [MODE.SELECT]: SelectModeInfo,
  [MODE.EDIT]: EditModeInfo,
  [MODE.DRAW]: DrawModeInfo,
};

function AppInfo() {
  const position = useSelector((state) => state.selectMode.cursor.position);
  const mode = useSelector((state) => state.appState.mode);
  const Info = ModeInfo[mode];

  return (
    <div className="flex items-center max-h-[24px] min-h-[24px] h-[24px] px-2 py-1 rounded w-full bg-[#282828] mt-1">
      {Info && (<Info />)}
      
      <div className="flex items-center ml-auto">
        {position && <Text>{`Location: ${position[0]},${position[1]}`}</Text>}
      </div>
    </div>
  );
}

export { AppInfo };
