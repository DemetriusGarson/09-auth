'use client';

import { useQuery } from '@tanstack/react-query';
import css from './NoteDetails.module.css';
import { fetchNoteById } from '@/lib/api/clientApi';
import { useParams } from 'next/navigation';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

export default function NoteDetailsClient() {
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
            </div>
            <p className={css.tag}>{note.tag}</p>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>{note.createdAt}</p>
          </div>
        </div>
      )}
    </>
  );
}
