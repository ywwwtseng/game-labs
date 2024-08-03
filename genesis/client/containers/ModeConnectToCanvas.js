import { useSelector } from 'react-redux';
import { SelectModeBehavior } from '@/containers/modes/SelectModeBehavior';
import { EditModeBehavior } from '@/containers/modes/EditModeBehavior';
import { DrawModeBehavior } from '@/containers/modes/DrawModeBehavior';
import { MODE } from '@/constants';

const Behavior = {
  [MODE.SELECT]: SelectModeBehavior,
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
