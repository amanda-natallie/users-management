import useModalStore, { ModalType } from './modal-store';

describe('useModalStore', () => {
  beforeEach(() => {
    const { closeModal } = useModalStore.getState();
    closeModal();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { isOpen, modalType } = useModalStore.getState();

      expect(isOpen).toBe(false);
      expect(modalType).toBe(null);
    });
  });

  describe('openModal', () => {
    it('should open modal with create type', () => {
      const { openModal } = useModalStore.getState();

      openModal(ModalType.CREATE);

      const { isOpen, modalType } = useModalStore.getState();
      expect(isOpen).toBe(true);
      expect(modalType).toBe(ModalType.CREATE);
    });

    it('should open modal with update type', () => {
      const { openModal } = useModalStore.getState();

      openModal(ModalType.UPDATE);

      const { isOpen, modalType } = useModalStore.getState();
      expect(isOpen).toBe(true);
      expect(modalType).toBe(ModalType.UPDATE);
    });

    it('should open modal with delete type', () => {
      const { openModal } = useModalStore.getState();

      openModal(ModalType.DELETE);

      const { isOpen, modalType } = useModalStore.getState();
      expect(isOpen).toBe(true);
      expect(modalType).toBe(ModalType.DELETE);
    });

    it('should update state when opening modal multiple times', () => {
      const { openModal } = useModalStore.getState();

      openModal(ModalType.CREATE);
      let { isOpen, modalType } = useModalStore.getState();
      expect(isOpen).toBe(true);
      expect(modalType).toBe(ModalType.CREATE);

      openModal(ModalType.UPDATE);
      ({ isOpen, modalType } = useModalStore.getState());
      expect(isOpen).toBe(true);
      expect(modalType).toBe(ModalType.UPDATE);
    });
  });

  describe('closeModal', () => {
    it('should close modal and reset modalType to null', () => {
      const { openModal, closeModal } = useModalStore.getState();

      openModal(ModalType.CREATE);
      let { isOpen, modalType } = useModalStore.getState();
      expect(isOpen).toBe(true);
      expect(modalType).toBe(ModalType.CREATE);

      closeModal();
      ({ isOpen, modalType } = useModalStore.getState());
      expect(isOpen).toBe(false);
      expect(modalType).toBe(null);
    });

    it('should handle closing modal when already closed', () => {
      const { closeModal } = useModalStore.getState();

      let { isOpen, modalType } = useModalStore.getState();
      expect(isOpen).toBe(false);
      expect(modalType).toBe(null);

      closeModal();
      ({ isOpen, modalType } = useModalStore.getState());
      expect(isOpen).toBe(false);
      expect(modalType).toBe(null);
    });
  });

  describe('store integration', () => {
    it('should maintain state consistency across multiple operations', () => {
      const { openModal, closeModal } = useModalStore.getState();

      openModal(ModalType.CREATE);
      let { isOpen, modalType } = useModalStore.getState();
      expect(isOpen).toBe(true);
      expect(modalType).toBe(ModalType.CREATE);

      closeModal();
      ({ isOpen, modalType } = useModalStore.getState());
      expect(isOpen).toBe(false);
      expect(modalType).toBe(null);

      openModal(ModalType.UPDATE);
      ({ isOpen, modalType } = useModalStore.getState());
      expect(isOpen).toBe(true);
      expect(modalType).toBe(ModalType.UPDATE);

      closeModal();
      ({ isOpen, modalType } = useModalStore.getState());
      expect(isOpen).toBe(false);
      expect(modalType).toBe(null);
    });
  });
});
