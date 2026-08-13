import { fetchNoteById } from '@/lib/api/clientApi';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import { Metadata } from 'next';
// import { api } from '@/app/api/api';
// import { cookies } from 'next/headers';
import { fetchServerNoteById } from '@/lib/api/serverApi';

type NoteDetailsProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: NoteDetailsProps): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchServerNoteById(id);

  return {
    title: `Note: ${note.title}`,
    description: note.content,
    openGraph: {
      title: `Note: ${note.title}`,
      description: note.content,
      url: `${process.env.NEXT_PUBLIC_API_URL}/${id}`, //! ссылка на vercel
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub image',
        },
      ],
      type: 'article',
    },
  };
}

export default async function NoteDetails({ params }: NoteDetailsProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
