import { Provider } from 'react-redux';
import { SpriteSheetProvider } from '@/context/SpriteSheetContext';
import { DragAndDropProvider } from '@/context/DragAndDropContext';
import { ModalProvider } from '@/context/ModalContext';
import { WindowSizeProvider } from '@/context/WindowSizeContext';
import { store } from '@/store';
import { Main } from '@/Main';

export function App() {
  return (
    <Provider store={store}>
      <SpriteSheetProvider>
        <WindowSizeProvider>
          <DragAndDropProvider>
            <ModalProvider>
              <Main />
            </ModalProvider>
          </DragAndDropProvider>
        </WindowSizeProvider>
      </SpriteSheetProvider>
    </Provider>
  );
}
