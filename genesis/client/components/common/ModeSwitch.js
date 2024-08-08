import { useDispatch, useSelector } from 'react-redux';
import { DropDown } from '@/components/ui/Dropdown/DropDown';
import { selectedMode, setMode } from '@/features/appState/appStateSlice';
import { MODE } from '@/constants';

function ModeSwitch() {
  const dispatch = useDispatch();
  const mode = useSelector(selectedMode);

  return (
    <div className="absolute top-1 left-1 z-20">
      <DropDown
        icon
        className="bg-[#282828] px-1.5 py-0.5"
        value={mode}
        onChange={(mode) => dispatch(setMode({ mode }))}
        options={[
          {
            type: 'option',
            id: MODE.EDIT,
            label: 'Edit Mode'
          },
          {
            type: 'option',
            id: MODE.PREVIEW,
            label: 'Preview Mode'
          }
        ]}
      />
    </div>
  );
}

export { ModeSwitch };