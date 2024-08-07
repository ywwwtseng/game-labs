import { useState } from 'react';
import { OperableItem } from '@/components/common/OperableItem';
import { Text } from '@/components/ui/Text';
import { Pattern } from '@/components/common/Pattern';
import { BaseButton } from '@/components/ui/BaseButton';
import { AreaHeader } from '@/components/common/AreaHeader';
import { useAnchor } from '@/hooks/useAnchor';
import { useMutation } from '@/hooks/useMutation';
import { DomUtil } from '@/utils/DomUtil';
import { PlusIcon } from '@/components/icon/PlusIcon';
import { CirclePlusIcon } from '@/components/icon/CirclePlusIcon';

function PatternItem({ pattern }) {
  const { open, toggle } = useAnchor();
  const { trigger } = useMutation(`/api/patterns/${pattern.id}/anim/create`);

  return (
    <OperableItem
      className="w-full"
      label={
        <div className="w-full" data-toggle="true" onClick={toggle}>
          <div className="p-1 flex items-start">
            <Pattern draggable pattern={pattern} />
            <div className="p-2">
              <Text>Name: {pattern.name}</Text>
            </div>
          </div>
          {open && (
            <div onClick={DomUtil.stopPropagation}>
              <AreaHeader
                className="bg-[#282828]"
                label="Animation"
                actions={[
                  <BaseButton key="create-animation" onClick={() => trigger()}>
                    <CirclePlusIcon />
                  </BaseButton>,
                ]}
              />
              <div className="flex p-1 gap-2 overflow-x-scroll no-scrollbar">
                <div className="flex flex-col">
                  <Pattern
                    className="rounded"
                    pattern={pattern}
                  />
                  <Text className="mt-0.5">Frame #1</Text>
                </div>
                <div className="min-w-16 h-16 rounded border border-dashed border-white/80 flex items-center justify-center">
                  <PlusIcon size={5} />
                </div>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}

export { PatternItem };
