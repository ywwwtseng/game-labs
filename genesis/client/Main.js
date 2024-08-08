import { Navigation } from '@/components/common/Navigation';
import { ModeSwitch } from '@/components/common/ModeSwitch';
import { CreationToolBar } from '@/components/common/CreationToolBar/CreationToolBar';
import { ShortcutBar } from '@/components/common/ShortcutBar';
import { EditGameSettingsView } from '@/components/common/EditGameSettingsView/EditGameSettingsView';
import { LandCanvas } from '@/components/common/LandCanvas';
import { AppInfo } from '@/components/common/AppInfo/AppInfo';

function Main() {
  return (
    <div className="select-none h-screen min-w-[1024px] flex flex-col bg-[#1D1D1D]">
      <Navigation />
      <div className="relative flex items-center flex-1 rounded">
        <div className="rounded flex-1 max-h-screen h-full flex flex-col">
          <ModeSwitch />
          <CreationToolBar />
          {/* <ShortcutBar /> */}
          <LandCanvas />
          <AppInfo />
        </div>
        <EditGameSettingsView />
      </div>
    </div>
  );
}

export { Main };
