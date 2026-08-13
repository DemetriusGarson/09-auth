import { Metadata } from 'next';
import css from './not-found.module.css';

export const metadata: Metadata = {
  title: 'Not Found',
  description: 'Page Not Found',
  openGraph: {
    title: `Not Found`,
    description: 'Page Not Found',
    url: `https://08-zustand-eta-opal.vercel.app/not-found/`, //! ссылка на vercel
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

export default function NotFound() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
}
