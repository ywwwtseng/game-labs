import { createRoot } from "react-dom/client";
import { SWRConfig } from "swr";
import { App } from "./App";
import { AppProvider } from "./store/AppContext";

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
      <App />
    </AppProvider>
  </SWRConfig>
);
