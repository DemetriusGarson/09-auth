import { NoteToPost } from '@/types/note';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
//! Поменял название noteStore не билдится vercel
type NoteDraftStore = {
  draft: NoteToPost;
  setDraft: (note: NoteToPost) => void;
  clearDraft: () => void;
};

const initialDraft: NoteToPost = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  // 2. Обгортаємо функцію створення стора
  persist(
    set => ({
      draft: initialDraft,
      // setDraft: note => set(() => ({ draft: note })),
      setDraft: note => set({ draft: note }),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      // Ключ у localStorage
      name: 'note-draft',
      // Зберігаємо лише властивість draft
      partialize: state => ({ draft: state.draft }),
    }
  )
);
