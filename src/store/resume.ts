import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ResumeData } from '../types/resume';

const defaultData: ResumeData = {
  name: '',
  birthDate: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  education: '',
  availableStartDate: '',
  profileImageUri: null,
  skills: [],
  careerLevel: null,
  certifications: '',
  portfolio: [],
  introduction: '',
};

interface ResumeStore {
  data: ResumeData;
  update: (partial: Partial<ResumeData>) => void;
  reset: () => void;
  isEditMode: boolean;
  setEditMode: (v: boolean) => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      data: defaultData,
      update: (partial) =>
        set((state) => ({ data: { ...state.data, ...partial } })),
      reset: () => set({ data: defaultData }),
      isEditMode: false,
      setEditMode: (v) => set({ isEditMode: v }),
    }),
    {
      name: 'resume-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ data: state.data }),
    }
  )
);
