import { SWRConfig } from 'swr';
import { Provider } from 'react-redux';
import { SpriteSheetProvider } from '@/context/SpriteSheetContext';
import { DragAndDropProvider } from '@/context/DragAndDropContext';
import { ModalProvider } from '@/context/ModalContext';
import { store } from '@/store';
import { Main } from '@/Main';

export function App() {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <SpriteSheetProvider>
        <Provider store={store}>
          <DragAndDropProvider>
            <ModalProvider>
              <Main />
            </ModalProvider>
          </DragAndDropProvider>
        </Provider>
      </SpriteSheetProvider>
    </SWRConfig>
  );
}
