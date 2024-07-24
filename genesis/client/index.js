import { createRoot } from "react-dom/client";
import { SWRConfig } from "swr";
import { App } from "@/App";
import { AppProvider } from "@/store/AppContext";
import { DragAndDropProvider } from "@/store/DragAndDropContext";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(
  <SWRConfig
    value={{
      fetcher: (resource, init) =>
        fetch(resource, init).then((res) => res.json()),
    }}
  >
    <AppProvider>
      <DragAndDropProvider>
        <App />
      </DragAndDropProvider>
    </AppProvider>
  </SWRConfig>
);
