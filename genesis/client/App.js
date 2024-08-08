import { Provider } from 'react-redux';
import { QueryClientProvider } from '@/features/query';
import { SpriteSheetProvider } from '@/context/SpriteSheetContext';
import { DragAndDropProvider } from '@/context/DragAndDropContext';
import { ModalProvider } from '@/context/ModalContext';
import { store } from '@/store';
import { Main } from '@/Main';

export function App() {
  return (
    <QueryClientProvider>
        <Provider store={store}>
          <SpriteSheetProvider>
            <DragAndDropProvider>
              <ModalProvider>
                <Main />
              </ModalProvider>
            </DragAndDropProvider>
          </SpriteSheetProvider>
        </Provider>
    </QueryClientProvider>
  );
}
