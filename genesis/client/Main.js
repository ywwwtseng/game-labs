import { Navigation } from '@/components/common/Navigation';
import { CreationToolBar } from '@/components/common/CreationToolBar/CreationToolBar';
import { ShortcutBar } from '@/components/common/ShortcutBar';
import { EditSettingsArea } from '@/components/common/EditSettingsArea/EditSettingsArea';
import { SceneCanvas } from '@/components/common/SceneCanvas';
import { AppInfo } from '@/components/common/AppInfo/AppInfo';

function Main() {
  return (
    <div className="select-none h-screen min-w-[1024px] flex flex-col bg-[#1D1D1D]">
      <Navigation />
      <div className="relative flex items-center flex-1 rounded">
        <div className="rounded flex-1 max-h-screen h-full flex flex-col">
          <CreationToolBar />
          <ShortcutBar />
          <SceneCanvas />
          <AppInfo />
        </div>
        <EditSettingsArea />
      </div>
    </div>
  );
}

export { Main };
