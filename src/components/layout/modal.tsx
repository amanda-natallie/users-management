import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ModalType, useModalStore } from '@/stores';

const getModalContent = (modalType: ModalType | null) => {
  switch (modalType) {
    case ModalType.CREATE:
      return {
        title: 'Create New User',
        content: (
          <div className="p-4 text-center text-muted-foreground">
            Create modal content goes here
          </div>
        ),
      };
    case ModalType.UPDATE:
      return {
        title: 'Update Item',
        content: (
          <div className="p-4 text-center text-muted-foreground">
            Update modal content goes here
          </div>
        ),
      };
    case ModalType.DELETE:
      return {
        title: 'Delete Item',
        content: (
          <div className="p-4 text-center text-muted-foreground">
            Delete modal content goes here
          </div>
        ),
      };
    default:
      return {
        title: 'Modal',
        content: <div className="p-4 text-center text-muted-foreground">No content available</div>,
      };
  }
};

const Modal = () => {
  const { isOpen, modalType, closeModal } = useModalStore();

  const { title, content } = getModalContent(modalType);

  return (
    <Dialog open={isOpen} onOpenChange={() => closeModal()}>
      <DialogContent
        className="sm:max-w-md w-full p-0"
        onPointerDownOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
        showCloseButton
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader className="p-6 pb-4 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-xl font-semibold text-foreground">{title}</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">{content}</div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
