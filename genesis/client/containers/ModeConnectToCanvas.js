import { useSelector } from "react-redux";
import { SelectModeBridge } from "@/containers/modes/SelectModeBridge";
import { ViewModeBridge } from "@/containers/modes/ViewModeBridge";
import { EmptyModeBridge } from "@/containers/modes/EmptyModeBridge";
import { MODE } from "@/constants";

const Bridge = {
  [MODE.SELECT]: SelectModeBridge,
  [MODE.VIEW]: ViewModeBridge,
};

function ModeConnectToCanvas({ children }) {
  const mode = useSelector((state) => state.appState.mode);
  const ModeBridge = Bridge[mode] || EmptyModeBridge;

  return <ModeBridge>{children}</ModeBridge>;
}

export { ModeConnectToCanvas };
