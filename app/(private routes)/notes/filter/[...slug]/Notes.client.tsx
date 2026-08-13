'use client';

import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import css from './Notes.module.css';

import { fetchNotes } from '@/lib/api/clientApi';
import NoteList from '@/components/NoteList/NoteList';
// import NoteForm from '@/components/NoteForm/NoteForm';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

// import Modal from '@/components/Modal/Modal';
import Loader from '@/components/Loader/Loader';
import Link from 'next/link';

interface NotesByTagClientProps {
  categoryTag?: string | undefined;
}

export default function NotesByTagClient({
  categoryTag,
}: NotesByTagClientProps) {
  const tag = categoryTag;

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  // const [isModal, setIsModal] = useState(false);

  const { data, isError, isSuccess, isLoading } = useQuery({
    queryKey: ['notes', currentPage, search, tag],
    queryFn: () => fetchNotes(currentPage, search, tag),
    // enabled: search !== '',
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const handleSearch = useDebouncedCallback(searchText => {
    setSearch(searchText);
    setCurrentPage(1);
  }, 500);

  // const openModal = () => {
  //   setIsModal(true);
  // };

  // const closeModal = () => {
  //   setIsModal(false);
  // };

  const totalPages = data?.totalPages ?? 0;
  return (
    <div className={css.app}>
      <div>
        <Toaster
          toastOptions={{
            className: '',
            duration: 2000,
            removeDelay: 1000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
      <div className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        {/* <button onClick={openModal} className={css.button}>
          Create note +
        </button> */}
        <Link href="/notes/action/create/" className={css.button}>
          Create note +
        </Link>
      </div>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {isSuccess && data.notes.length === 0 && (
        <p className={css.text_no_results}>Not found posts for your search</p>
      )}
      {/* {isModal && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )} */}
    </div>
  );
}
