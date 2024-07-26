import { Text } from "@/components/ui/Text";
import { EditIcon } from "@/components/icon/EditIcon";

function EditModeInfo() {
  return (
    <>
      <EditIcon className="mr-0.5" size={4} />
      <Text className="ml-1">Edit Mode</Text>
    </>
  );
}

export { EditModeInfo };