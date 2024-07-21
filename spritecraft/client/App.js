import { Navigation } from "./components/Navigation";
import { CreationBar } from "./components/CreationBar";
import { ShortcutBar } from './components/ShortcutBar';
import { SpriteSheetArea } from "./components/SpriteSheetArea";
import { EditArea } from "./components/EditArea";
import { Information } from './components/Information';


export function App() {
  return (
    <div className="select-none h-screen flex flex-col bg-[#1D1D1D]">
      <Navigation />
      <div className="relative flex items-center flex-1 rounded">
        <div className="rounded flex-1 h-full flex flex-col">
          <CreationBar />
          <ShortcutBar />
          <EditArea />
          <Information />
        </div>
        <SpriteSheetArea />
      </div>
    </div>
  );
}
