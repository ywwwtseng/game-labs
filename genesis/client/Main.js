import { Navigation } from '@/components/common/Navigation';
import { ModeSwitch } from '@/components/common/ModeSwitch';
import { CreationToolBar } from '@/components/common/CreationToolBar/CreationToolBar';
import { ShortcutBar } from '@/components/common/ShortcutBar';
import { EditGameSettingsView } from '@/components/common/EditGameSettingsView/EditGameSettingsView';
import { LandCanvasEditArea } from '@/components/common/LandCanvasEditArea/LandCanvasEditArea';
import { AppInfo } from '@/components/common/AppInfo/AppInfo';
import { useDispatch, useSelector } from 'react-redux';
import { selectedLand, selectedLandId, setLand } from '@/features/appState/appStateSlice';
import { sql } from '@/sql';
import { useQuery } from '@/hooks/useQuery';
import { useMemo } from 'react';

function Main() {
  const dispatch = useDispatch();
  const land = useSelector(selectedLand);
  const id = useSelector(selectedLandId);
  const params = useMemo(() => ({ id }), [id]);
  useQuery(
    id ? sql.lands.receive : undefined,
    params,
    {
      force: true,
      onSuccess: (res) => {
        dispatch(setLand(res?.data));
      },
    }
  );

  return (
    <div className="select-none h-screen flex flex-col bg-[#1D1D1D]">
      <Navigation />
      <div className="relative flex items-center flex-1 rounded">
        <div className="rounded flex-1 max-h-screen h-full flex flex-col">
          <ModeSwitch />
          <CreationToolBar />
          {/* <ShortcutBar /> */}
          {land ? <LandCanvasEditArea /> : <LandCanvasEditArea.Empty />}
          <AppInfo />
        </div>
        <EditGameSettingsView />
      </div>
    </div>
  );
}

export { Main };
