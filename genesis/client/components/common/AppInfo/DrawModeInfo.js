import { Text } from "@/components/ui/Text";
import { PenNibIcon } from "@/components/icon/PenNibIcon";

function DrawModeInfo() {
  return (
    <>
      <PenNibIcon className="mr-0.5" size={4} />
      <Text className="ml-1">Draw Mode</Text>
    </>
  );
}

export { DrawModeInfo };