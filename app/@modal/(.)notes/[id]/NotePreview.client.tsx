'use client';
import { fetchNoteById } from '@/lib/api/clientApi';
import css from './NotePreview.module.css';
import { useParams, useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import { useQuery } from '@tanstack/react-query';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Loader from '@/components/Loader/Loader';

const NotePreviewClient = () => {
  const router = useRouter();
  const close = () => router.back();

  const { id } = useParams<{ id: string }>();
  // console.log(id);

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <Modal onClose={close}>
      <>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {!note ? (
          <ErrorMessage />
        ) : (
          <div className={css.container}>
            <div className={css.item}>
              <div className={css.header}>
                <h2>{note.title}</h2>
                <button className={css.backBtn} onClick={close}>
                  Close
                </button>
              </div>
              <p className={css.tag}>{note.tag}</p>
              <p className={css.content}>{note.content}</p>
              <p className={css.date}>{note.createdAt}</p>
            </div>
          </div>
        )}
      </>
    </Modal>
  );
};

export default NotePreviewClient;
