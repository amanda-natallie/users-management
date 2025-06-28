import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  CreateUserView,
  DeleteUserView,
  UpdateUserView,
} from '@/pages/dashboard/components/modals';
import { ModalType, useModalStore } from '@/stores';

const getModalContent = (modalType: ModalType | null) => {
  switch (modalType) {
    case ModalType.CREATE:
      return <CreateUserView />;
    case ModalType.UPDATE:
      return <UpdateUserView />;
    case ModalType.DELETE:
      return <DeleteUserView />;
    default:
      return <div className="p-4 text-center text-muted-foreground">No content available</div>;
  }
};

const Modal = () => {
  const { isOpen, modalType, closeModal } = useModalStore();

  const Content = getModalContent(modalType);

  return (
    <Dialog open={isOpen} onOpenChange={() => closeModal()}>
      <DialogContent
        className="sm:max-w-md w-full p-2"
        onPointerDownOutside={e => modalType !== ModalType.CREATE && e.preventDefault()}
        onEscapeKeyDown={e => modalType !== ModalType.CREATE && e.preventDefault()}
        showCloseButton
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <div className="p-6">{Content}</div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
