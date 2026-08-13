import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesByTagClient from './Notes.client';
import { Metadata } from 'next';
import { fetchServerNotes } from '@/lib/api/serverApi';

type NotesByTagProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: NotesByTagProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug[0]} Notes`,
    description: `${slug[0]} Notes List`,
    openGraph: {
      title: `${slug[0]} Notes`,
      description: `${slug[0]} Notes List`,
      url: `${process.env.NEXT_PUBLIC_API_URL}/${slug[0]}`, //! ссылка на vercel
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

const NotesByTag = async ({ params }: NotesByTagProps) => {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? undefined : slug[0];
  const queryClient = new QueryClient();
  const currentPage = 1;
  const search = '';

  await queryClient.prefetchQuery({
    queryKey: ['notes', currentPage, search, tag],
    queryFn: () => fetchServerNotes(currentPage, search, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesByTagClient categoryTag={tag} />
    </HydrationBoundary>
  );
};

export default NotesByTag;
