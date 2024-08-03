import { forwardRef, useImperativeHandle } from 'react';
import { CreationToolBarButton } from '@/components/common/CreationToolBar/CreationToolBarButton';
import { useAnchor } from '@/hooks/useAnchor';

const CreationToolBarToggle = forwardRef(({ menu: Menu, ...props }, ref) => {
  const { open, bounds, close, toggle } = useAnchor();

  useImperativeHandle(ref, () => ({
    close,
  }));

  return (
    <>
      <CreationToolBarButton data-toggle="true" onClick={toggle} {...props} />
      {open && (
        <Menu
          origin={{
            x: bounds.right + 4,
            y: bounds.top,
          }}
          onClose={close}
        />
      )}
    </>
  );
});

export { CreationToolBarToggle };
