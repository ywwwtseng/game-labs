import { Text } from '@/components/ui/Text';
import { EyeIcon } from '@/components/icon/EyeIcon';

function PreviewModeInfo() {
  return (
    <>
      <EyeIcon className="mr-0.5" size={4} />
      <Text className="ml-1">Preview Mode</Text>
    </>
  );
}

export { PreviewModeInfo };
