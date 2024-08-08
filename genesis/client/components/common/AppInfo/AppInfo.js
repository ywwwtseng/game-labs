import { useSelector } from 'react-redux';
import { Text } from '@/components/ui/Text';
import { EditModeInfo } from '@/components/common/AppInfo/EditModeInfo';
import { EditModeInfo } from '@/components/common/AppInfo/EditModeInfo';
import { DrawModeInfo } from '@/components/common/AppInfo/DrawModeInfo';
import { selectedCursorIndex } from '@/features/editMode/editModeSlice';
import { MODE } from '@/constants';

const ModeInfo = {
  [MODE.SELECT]: EditModeInfo,
  [MODE.EDIT]: EditModeInfo,
  [MODE.DRAW]: DrawModeInfo,
};

function AppInfo() {
  const cursorIndex = useSelector(selectedCursorIndex);
  const mode = useSelector((state) => state.appState.mode);
  const Info = ModeInfo[mode];

  return (
    <div className="flex items-center max-h-[24px] min-h-[24px] h-[24px] px-2 py-1 rounded w-full bg-[#282828] mt-1">
      {Info && <Info />}

      <div className="flex items-center ml-auto">
        {cursorIndex && (
          <Text>{`Location: ${cursorIndex[0]},${cursorIndex[1]}`}</Text>
        )}
      </div>
    </div>
  );
}

export { AppInfo };
