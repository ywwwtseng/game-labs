import { Modal } from '@/components/ui/Modal';

function GamePreviewModal() {
  return (
    <Modal>
      <Modal.Header title="Game Preview" showCloseButton />
      <iframe width={375} height={667} src="http://localhost:3001/" />
    </Modal>
  );
}

export { GamePreviewModal };
