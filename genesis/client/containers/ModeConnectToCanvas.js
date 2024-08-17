import { useSelector } from 'react-redux';
import { EditModeBehavior } from '@/containers/modes/EditModeBehavior';
import { PreviewModeBehavior } from '@/containers/modes/PreviewModeBehavior';
import { ViewModeBehavior } from '@/containers/modes/ViewModeBehavior';
import { MODE } from '@/constants';

const Behavior = {
  [MODE.EDIT]: EditModeBehavior,
  [MODE.PREVIEW]: PreviewModeBehavior,
  [MODE.VIEW]: ViewModeBehavior,
};

function ModeConnectToCanvas({ children }) {
  const mode = useSelector((state) => state.appState.mode);
  const ModeBehavior = Behavior[mode];

  if (!ModeBehavior) {
    return children;
  }

  return <ModeBehavior>{children}</ModeBehavior>;
}

export { ModeConnectToCanvas };
