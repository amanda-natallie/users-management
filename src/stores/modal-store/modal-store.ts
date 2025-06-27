import { create } from 'zustand';

export enum ModalType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

interface ModalStore {
  isOpen: boolean;
  modalType: ModalType | null;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalStore>(set => ({
  isOpen: false,
  modalType: null,
  openModal: (type: ModalType) => set({ isOpen: true, modalType: type }),
  closeModal: () => set({ isOpen: false, modalType: null }),
}));

export default useModalStore;
