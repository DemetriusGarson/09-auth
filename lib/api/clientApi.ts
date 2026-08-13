import type { Note, NoteToPost } from '../../types/note';
import { nextServer } from './api';
import { User } from '@/types/user';

export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  page: number,
  userInput: string,
  tag?: string
): Promise<NotesHttpResponse> {
  const response = await nextServer.get<NotesHttpResponse>('/notes', {
    params: {
      search: userInput,
      page,
      perPage: 12,
      tag,
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await nextServer.get<Note>(`/notes/${id}`);

  return response.data;
}

export async function postNote(note: NoteToPost): Promise<Note> {
  const response = await nextServer.post<Note>('/notes', note);

  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await nextServer.delete<Note>(`/notes/${id}`);
  return response.data;
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export type RegisterRequest = {
  email: string;
  password: string;
};

//! РЕГИСТРАЦИЯ
export const register = async (body: RegisterRequest): Promise<User> => {
  console.log(body);
  const res = await nextServer.post<User>('/auth/register', body);
  return res.data;
};

//! ЛОГИН
export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest): Promise<User> => {
  const res = await nextServer.post<User>('/auth/login', data);
  return res.data;
};

//! ПРОВЕРКА СЕССИИ
type CheckSessionRequest = {
  success: boolean;
};

export const checkSession = async (): Promise<boolean> => {
  const res = await nextServer.get<CheckSessionRequest>('/auth/session');
  return res.data.success;
};

//! ДАННЫЕ ПОЛЬЗОВАТЕЛЯ
export const getMe = async (): Promise<User> => {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
};

//! ЛОГАУТ
export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout');
};

//! Обновление профиля

interface UserToUpdate {
  email: string;
  username: string;
}

export const updateMe = async (user: UserToUpdate): Promise<User> => {
  const { data } = await nextServer.patch<User>('/users/me', user);
  return data;
};
