import { UserItem } from '@/services';
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
  modalData: UserItem | null;
  setModalData: (data: UserItem) => void;
}

const useModalStore = create<ModalStore>(set => ({
  isOpen: false,
  modalType: null,
  modalData: null,
  openModal: (type: ModalType) => set({ isOpen: true, modalType: type }),
  closeModal: () => set({ isOpen: false, modalType: null }),
  setModalData: (data: UserItem | null) => set({ modalData: data }),
}));

export default useModalStore;
