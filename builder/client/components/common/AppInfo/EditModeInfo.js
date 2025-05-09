import { useSelector } from 'react-redux';
import { Text } from '@/components/ui/Text';
import { SelectIcon } from '@/components/icon/SelectIcon';
import { CheckIcon } from '@/components/icon/CheckIcon';
import { selectedEditModeSelectorRectDefault } from '@/features/editMode/editModeSlice';

function EditModeInfo() {
  const selectedRect = useSelector(selectedEditModeSelectorRectDefault);

  return (
    <>
      <SelectIcon className="mr-0.5" size={4} />
      <Text className="ml-1">Edit Mode</Text>
      <div className="flex items-center ml-4">
        {selectedRect && (
          <>
            <CheckIcon />
            <Text className="ml-1">{`Selected: ${selectedRect[0]},${selectedRect[1]},${selectedRect[2]},${selectedRect[3]}`}</Text>
          </>
        )}
      </div>
    </>
  );
}

export { EditModeInfo };
