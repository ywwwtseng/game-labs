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
import { useEffect, useMemo } from 'react';

function Main() {
  const dispatch = useDispatch();
  const id = useSelector(selectedLandId);
  const { data: lands } = useQuery(sql.lands.list);
  const params = useMemo(() => ({ id }), [id]);
  const pathname = lands?.find((land) => land.id === id)?.pathname;
  const land = useSelector(selectedLand);

  useEffect(() => {
    if (pathname) {
      fetch(`${window.location.origin}/${pathname}`)
        .then(res => res.json())
        .then((data) => {
          dispatch(setLand(data))
        });
    }
    console.log(pathname, 'pathname')
  }, [pathname]);

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
