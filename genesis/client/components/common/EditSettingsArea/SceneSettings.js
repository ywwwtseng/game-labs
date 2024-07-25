import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AreaHeader } from "@/components/common/AreaHeader";
import { OperablItem } from "@/components/common/OperablItem";
import { BaseButton } from "@/components/ui/BaseButton";
import { LayersIcon } from "@/components/icon/LayersIcon";
import { PlusIcon } from "@/components/icon/PlusIcon";
import { AngleRightIcon } from "@/components/icon/AngleRightIcon";
import { addLayer, selectLayer } from "@/features/appState/appStateSlice";

function SceneSettings() {
  const scene = useSelector((state) => state.appState.scene);
  const dispatch = useDispatch();
  const scenes = [scene];
  const [selectedScene, selectScene] = useState(scenes[0].name);

  return (
    <div className="flex flex-col rounded w-full h-[245px] bg-[#282828]">
      <AreaHeader
        icon={<LayersIcon />}
        title="Scene"
        actions={[
          <BaseButton key="new-scene">
            <PlusIcon />
          </BaseButton>,
        ]}
      />

      <div className="flex-1 overflow-y-scroll no-scrollbar">
        {scenes.map((scene) => (
          <React.Fragment key={scene.name}>
            <OperablItem
              checkIcon
              selected={selectedScene === scene.name}
              onClick={() =>
                selectScene(selectedScene === scene.name ? null : scene.name)
              }
              label={scene.name.toLocaleUpperCase()}
              actions={[
                <BaseButton
                  key="new-layer"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    dispatch(addLayer());
                  }}
                >
                  <PlusIcon />
                </BaseButton>,
              ]}
            />
            {scene.layers.map((layer, index) => (
              <OperablItem
                key={`${scene.name}-layer-${index}`}
                className="pl-6"
                label={
                  <div className="flex items-center">
                    <AngleRightIcon
                      style={{
                        width: "12px",
                        opacity: scene.selectedLayerIndex === index ? 1 : 0,
                      }}
                    />
                    <span className="ml-1">{`Layer${index + 1}`}</span>
                  </div>
                }
                selected={scene.selectedLayerIndex === index}
                onClick={() => dispatch(selectLayer(index))}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export { SceneSettings };
