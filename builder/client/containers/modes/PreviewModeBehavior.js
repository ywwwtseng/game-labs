import { useEffect, useState } from 'react';
import { Timer } from '@/helpers/Timer';

function PreviewModeBehavior({ children }) {
  const [lifetime, setLifetime] = useState(0);

  useEffect(() => {
    const timer = new Timer();
    timer.update = (deltaTime) => {
      setLifetime(lifetime => lifetime + deltaTime);
    };
    timer.start();

    return () => {
      timer.dispose();
    };
  }, [])

  return children({
    register: {},
    connect: {
      lifetime,
    },
  });
}

export { PreviewModeBehavior };
