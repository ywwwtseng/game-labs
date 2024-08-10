import { Object2DReview } from '@/components/common/Object2DReview';
import { BaseButton } from '@/components/ui/BaseButton';
import { AreaHeader } from '@/components/common/AreaHeader';
import { CloseIcon } from '@/components/icon/CloseIcon';
import { Object2DAnimAttribute } from '@/components/common/EditGameSettingsView/Object2DList/Object2DAnimAttribute/Object2DAnimAttribute';
import { DomUtil } from '@/utils/DomUtil';
import { Object2DUtil } from '@/utils/Object2DUtil';


function Object2DDetail({ object2d, onClose }) {
  return (
    <div className="absolute flex flex-col top-0 left-0 w-full h-full bg-[#282828] rounded" onClick={DomUtil.stopPropagation}>
      <AreaHeader
        className="bg-[#282828]"
        label={object2d.name}
        actions={[
          <BaseButton key="create-animation" onClick={onClose}>
            <CloseIcon />
          </BaseButton>
        ]}
      />
      <div className="p-1">
        <Object2DReview
          className="rounded"
          object2d={object2d}
          tiles={Object2DUtil.tiles(object2d)}
        />
      </div>
      
      <Object2DAnimAttribute object2d={object2d} />
    </div>
  );
}

export { Object2DDetail };
