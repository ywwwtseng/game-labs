import { useState, useMemo } from 'react';
import { ArrayUtil } from '@/utils/ArrayUtil';

function VirtualList({
  width,
  height,
  itemHeight,
  total,
  renderItem,
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const yStart = Math.floor(scrollTop / itemHeight);
  const yEnd = yStart + Math.ceil(height / itemHeight) + 1;
  const indices = useMemo(() => ArrayUtil.range(yStart, yEnd), [yStart, yEnd]);

  const handleWheel = (event) => {
    setScrollTop(Math.min(Math.max(scrollTop + event.deltaY, 0), total * itemHeight - height));
  }
  
  return (
    <div 
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'hidden',
      }}
      onWheel={handleWheel}
    >

      <div
        style={{
          position: 'absolute',
          top: '0px',
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {indices.map((itemIndex) => (
          (itemIndex >= 0 && itemIndex < total) && <div
            key={itemIndex}
            style={{
              height: `${itemHeight}px`,
              width: '100%',
              position: 'absolute',
              top: `${itemIndex * itemHeight - scrollTop}px`,
            }}>
            {renderItem(itemIndex)}
          </div>
        ))}
      </div>

    </div>
  )
}

export { VirtualList };