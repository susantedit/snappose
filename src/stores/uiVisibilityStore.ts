import { create } from 'zustand';

interface UiVisibilityState {
  isCapturing: boolean;
  setIsCapturing: (capturing: boolean) => void;
}

export const useUiVisibilityStore = create<UiVisibilityState>((set) => ({
  isCapturing: false,
  setIsCapturing: (capturing: boolean) => set({ isCapturing: capturing }),
}));
