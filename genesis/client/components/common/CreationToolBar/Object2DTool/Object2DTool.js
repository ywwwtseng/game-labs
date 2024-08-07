import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu } from '@/components/ui/Menu';
import { BaseButton } from '@/components/ui/BaseButton';
import { Text } from '@/components/ui/Text';
import { CloseIcon } from '@/components/icon/CloseIcon';
import { BoxIcon } from '@/components/icon/BoxIcon';
import { AngleRightIcon } from '@/components/icon/AngleRightIcon';
import { Object2DReview } from '@/components/common/Object2DReview';
import { useObject2Ds } from '@/hooks/useObject2Ds';
import { useSpriteSheets } from '@/context/SpriteSheetContext';

function Object2DTool({ origin, onClose }) {
  const object2ds = useObject2Ds();

  return (
    <Menu origin={origin} id="object2d-tool">
      <Menu.Header>
        <div className="flex items-center self-center text-xs whitespace-nowrap text-white mr-auto">
          <BoxIcon />
          <div className="ml-0.5">
            Object2D Palette
          </div>
        </div>
        <BaseButton onClick={onClose}>
          <CloseIcon />
        </BaseButton>
      </Menu.Header>
      <div
        className="p-2 max-h-[224px] h-[224px] min-w-[224px] overflow-y-scroll no-scrollbar"
      >
        <div
          className="grid grid-cols-3 gap-2 grid-rows-3"
        >
          {object2ds?.map((object2d) => (
            <Object2DReview draggable={{ dragArea: 'object2d-tool' }} key={object2d.id} object2d={object2d} />
          ))}
        </div>
      </div>
    </Menu>
  );
}

export { Object2DTool };
