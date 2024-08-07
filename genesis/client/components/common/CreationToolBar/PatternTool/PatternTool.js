import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu } from '@/components/ui/Menu';
import { BaseButton } from '@/components/ui/BaseButton';
import { Text } from '@/components/ui/Text';
import { CloseIcon } from '@/components/icon/CloseIcon';
import { BoxIcon } from '@/components/icon/BoxIcon';
import { AngleRightIcon } from '@/components/icon/AngleRightIcon';
import { Pattern } from '@/components/common/Pattern';
import { usePatterns } from '@/hooks/usePatterns';
import { useSpriteSheets } from '@/context/SpriteSheetContext';

function PatternTool({ origin, onClose }) {
  const patterns = usePatterns();

  return (
    <Menu origin={origin}>
      <Menu.Header>
        <div className="flex items-center self-center text-xs whitespace-nowrap text-white mr-auto">
          <BoxIcon />
          <div className="ml-0.5">
            Pattern Palette
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
          {patterns?.map((pattern) => (
            <Pattern key={pattern.id} pattern={pattern} />
          ))}
        </div>
      </div>
    </Menu>
  );
}

export { PatternTool };
