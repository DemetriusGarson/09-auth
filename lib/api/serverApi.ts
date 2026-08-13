import { cookies } from 'next/headers';
import { nextServer } from './api';
import { User } from '@/types/user';
import { NotesHttpResponse } from './clientApi';
import { Note } from '@/types/note';
// import { User } from './clientApi';

export const checkServerSession = async () => {
  // Дістаємо поточні cookie
  const cookieStore = await cookies();
  const res = await nextServer.get('/auth/session', {
    headers: {
      // передаємо кукі далі
      Cookie: cookieStore.toString(),
    },
  });
  // Повертаємо повний респонс, щоб proxy мав доступ до нових cookie
  return res;
};

export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export async function fetchServerNotes(
  page: number,
  userInput: string,
  tag?: string
): Promise<NotesHttpResponse> {
  const cookieStore = await cookies();
  const response = await nextServer.get<NotesHttpResponse>('/notes', {
    params: {
      search: userInput,
      page,
      perPage: 12,
      tag,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  // console.log(response.data)
  return response.data;
}

export async function fetchServerNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  // console.log(response.data);
  return response.data;
}
