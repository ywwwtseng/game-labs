import React, { useContext, useState } from "react";
import { AppContext } from "@/store/AppContext";
import { AreaHeader } from "@/components/common/AreaHeader";
import { OperablItem } from "@/components/common/OperablItem";
import { BaseButton } from "@/components/ui/BaseButton";
import { LayersIcon } from "@/components/icon/LayersIcon";
import { PlusIcon } from "@/components/icon/PlusIcon";
import { AngleRightIcon } from "@/components/icon/AngleRightIcon";

function SceneSettings() {
  const { state, action } = useContext(AppContext);
  const scenes = [state.scene];
  const [selectedScene, selectScene] = useState(scenes[0].name);
  const [selectedLayerIndex, selectLayerIndex] = useState(0);

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
              name={scene.name.toLocaleUpperCase()}
              actions={[
                <BaseButton
                  key="new-layer"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    action.addLayer(scene);
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
                name={
                  <div className="flex items-center">
                    <AngleRightIcon style={{width: '12px'}} />
                    <span className="ml-1">{`Layer${index + 1}`}</span>
                  </div>
                }
                selected={selectedLayerIndex === index}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export { SceneSettings };
