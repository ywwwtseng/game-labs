import { Provider } from 'react-redux';
import { QueryClientProvider } from '@/features/query/QueryClientContext';
import { SpriteSheetProvider } from '@/features/appState/SpriteSheetContext';
import { DragAndDropProvider } from '@/context/DragAndDropContext';
import { ModalProvider } from '@/context/ModalContext';
import { WindowSizeProvider } from '@/context/WindowSizeContext';
import { store } from '@/store';
import { Main } from '@/Main';

export function App() {
  return (
    <QueryClientProvider>
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
    </QueryClientProvider>
  );
}
