import { Text } from '@/components/ui/Text';
function ShortcutBar() {
  const shortcuts = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"];
  return (
    <div
      id="shortcut-bar"
      className="absolute mx-auto bottom-8 left-0 right-0 flex items-center justify-center pr-64"
    >
      {shortcuts.map(shortcut => (
        <div key={shortcut} className="relative z-20 rounded bg-black/30 p-1 border border-gray-300/50 border-dashed cursor-pointer mx-0.5">
          <Text className="flex items-center justify-center block w-6 h-6 opacity-50" size="xs" color="white">{shortcut}</Text>
        </div>
      ))}
    </div>
  );
}

export { ShortcutBar };
