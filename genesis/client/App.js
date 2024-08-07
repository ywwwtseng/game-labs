import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SpriteSheetProvider } from '@/context/SpriteSheetContext';
import { DragAndDropProvider } from '@/context/DragAndDropContext';
import { ModalProvider } from '@/context/ModalContext';
import { store } from '@/store';
import { Main } from '@/Main';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SpriteSheetProvider>
        <Provider store={store}>
          <DragAndDropProvider>
            <ModalProvider>
              <Main />
            </ModalProvider>
          </DragAndDropProvider>
        </Provider>
      </SpriteSheetProvider>
    </QueryClientProvider>
  );
}
