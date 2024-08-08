import { useSelector } from 'react-redux';
import { EditModeBehavior } from '@/containers/modes/EditModeBehavior';
import { DrawModeBehavior } from '@/containers/modes/DrawModeBehavior';
import { MODE } from '@/constants';

const Behavior = {
  [MODE.EDIT]: EditModeBehavior,
  [MODE.DRAW]: DrawModeBehavior,
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
