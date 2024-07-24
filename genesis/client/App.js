import { Navigation } from "./components/common/Navigation";
import { CreationBar } from "./components/common/CreationBar";
import { ShortcutBar } from "./components/common/ShortcutBar";
import { EditSettingsArea } from "./components/common/EditSettingsArea/EditSettingsArea";
import { EditArea } from "./components/common/EditArea";
import { AppInformation } from "./components/common/AppInformation";

export function App() {
  return (
    <div className="select-none h-screen min-w-[1024px] flex flex-col bg-[#1D1D1D]">
      <Navigation />
      <div className="relative flex items-center flex-1 rounded">
        <div className="rounded flex-1 max-h-screen h-full flex flex-col">
          <CreationBar />
          <ShortcutBar />
          <EditArea />
          <AppInformation />
        </div>
        <EditSettingsArea />
      </div>
    </div>
  );
}
