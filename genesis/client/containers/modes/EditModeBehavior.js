import { useDropToDraw } from '@/hooks/useDropToDraw';

function EditModeBehavior({ children }) {
  const { setup } = useDropToDraw({ id: 'canvas' });
  return children({ register: {}, connect: setup });
}

export { EditModeBehavior };
