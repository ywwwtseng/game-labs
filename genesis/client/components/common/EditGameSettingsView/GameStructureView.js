import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AreaHeader } from '@/components/common/AreaHeader';
import { OperableItem } from '@/components/common/OperableItem';
import { BaseButton } from '@/components/ui/BaseButton';
import { CirclePlusIcon } from '@/components/icon/CirclePlusIcon';
import { GlobalIcon } from '@/components/icon/GlobalIcon';
import { AngleRightIcon } from '@/components/icon/AngleRightIcon';
import { addLayer, selectLayer } from '@/features/appState/appStateSlice';
import { useLocalStorage } from '@/hooks/useLocalStorage';

function GameStructureView() {
  const land = useSelector((state) => state.appState.land);
  const dispatch = useDispatch();
  const lands = [land];
  const [selectedLand, selectLand] = useLocalStorage(
    'selected:land',
    lands[0].name,
  );

  return (
    <div className="flex flex-col rounded w-full max-h-[124px] h-[124px] bg-[#282828]">
      <AreaHeader
        icon={<GlobalIcon />}
        label="World"
        actions={[
          <BaseButton key="new-land">
            <CirclePlusIcon />
          </BaseButton>
        ]}
      />
      <div className="flex-1 overflow-y-scroll no-scrollbar">
        {lands.map((land) => (
          <React.Fragment key={land.name}>
            <OperableItem
              className="px-1"
              checkIcon
              selected={selectedLand === land.name}
              // onClick={() =>
              //   selectLand(selectedLand === land.name ? null : land.name)
              // }
              label={land.name}
            />
            {land.layers.map((layer, index) => (
              <OperableItem
                className="px-1"
                key={`${land.name}-layer-${index}`}
                className="pl-6"
                label={
                  <div className="flex items-center">
                    <AngleRightIcon
                      size={3}
                      className={
                        land.selectedLayerIndex === index
                          ? 'opacity-100'
                          : 'opacity-0'
                      }
                    />
                    <span className="ml-1">{layer.name}</span>
                  </div>
                }
                selected={land.selectedLayerIndex === index}
                onClick={() => dispatch(selectLayer(index))}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export { GameStructureView };
