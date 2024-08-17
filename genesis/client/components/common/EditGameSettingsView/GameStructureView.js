import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AreaHeader } from '@/components/common/AreaHeader';
import { OperableItem } from '@/components/common/OperableItem';
import { BaseButton } from '@/components/ui/BaseButton';
import { CirclePlusIcon } from '@/components/icon/CirclePlusIcon';
import { GlobalIcon } from '@/components/icon/GlobalIcon';
import { AngleRightIcon } from '@/components/icon/AngleRightIcon';
import { selectedLand, selectLandId, selectedLandId, selectLandLayer } from '@/features/appState/appStateSlice';
import { useQuery } from '@/hooks/useQuery';
import { sql } from '@/sql';

function GameStructureView() {
  const dispatch = useDispatch();
  const { data: lands } = useQuery(sql.lands.list);
  const land = useSelector(selectedLand);
  const id = useSelector(selectedLandId);

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
        {lands?.map((l) => (
          <React.Fragment key={l.id}>
            <OperableItem
              className="px-1"
              checkIcon
              selected={id === l.id}
              onClick={() =>
                dispatch(selectLandId(id === l.id ? null : l.id))
              }
              label={l.id.toLocaleUpperCase()}
            />
            {land && land?.layers?.map((layer, index) => (
              <OperableItem
                className="px-1 pl-6"
                key={`${land.name}-layer-${index}`}
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
                onClick={() => dispatch(selectLandLayer(index))}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export { GameStructureView };
