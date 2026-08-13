'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
// 1. Імпортуємо хук
import { useNoteDraftStore } from '@/lib/store/noteStore';

import css from '@/components/NoteForm/NoteForm.module.css';
import { postNote } from '@/lib/api/clientApi';
import { NoteToPost } from '@/types/note';
import { useId } from 'react';

// interface NoteFormDraftProps {
//   onClose: () => void;
// }

export default function NoteForm() {
  const formId = useId();
  const router = useRouter();

  // 2. Викликаємо хук і отримуємо значення
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  // 3. Оголошуємо функцію для onChange щоб при зміні будь-якого
  // елемента форми оновити чернетку нотатки в сторі
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    // 4. Коли користувач змінює будь-яке поле форми — оновлюємо стан
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  const { mutate } = useMutation({
    mutationFn: async (note: NoteToPost) => {
      await postNote(note);
    },
    // 5. При успішному створенні нотатки очищуємо чернетку
    onSuccess: () => {
      //   onClose();
      clearDraft();
      router.push('/notes/filter/all');
    },
  });

  const handleSubmit = (formData: FormData) => {
    const values = Object.fromEntries(formData) as unknown as NoteToPost;
    mutate(values);
  };

  const handleCancel = () => {
    // onClose();
    router.push('/notes/filter/all');
  };

  // 6. До кожного елемента додаємо defaultValue та onChange
  // щоб задати початкове значення із чернетки
  // та при зміні оновити чернетку в сторі
  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor={`${formId}-title`}>Title</label>
        <input
          className={css.input}
          id={`${formId}-title`}
          type="text"
          name="title"
          defaultValue={draft?.title}
          onChange={handleChange}
        />
      </div>
      <div className={css.formGroup}>
        <label htmlFor={`${formId}-content`}>Content</label>
        <textarea
          className={css.textarea}
          id={`${formId}-content`}
          name="content"
          defaultValue={draft?.content}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className={css.formGroup}>
        <label htmlFor={`${formId}-tag`}>Tag</label>
        <select
          className={css.select}
          id={`${formId}-tag`}
          name="tag"
          defaultValue={draft?.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="submit" className={css.submitButton}>
          Create
        </button>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
