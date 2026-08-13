// import axios from 'axios';
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
  // console.log(response.data)
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await nextServer.get<Note>(`/notes/${id}`);
  // console.log(response.data);
  return response.data;
}

export async function postNote(note: NoteToPost): Promise<Note> {
  const response = await nextServer.post<Note>('/notes', note);
  // console.log(response.data);
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
  // userName: string;
};

// export type User = {
//   id: string;
//   email: string;
//   userName?: string;
//   photoUrl?: string;
//   createdAt: Date;
//   updatedAt: Date;
// };

//! РЕГИСТРАЦИЯ
export const register = async (body: RegisterRequest) => {
  console.log(body);
  const res = await nextServer.post<User>('/auth/register', body);
  return res.data;
};

// export const registerTest = async (body: RegisterRequest) => {
//   const resTest = await axios.post<User>(
//     'https://notehub-api.goit.study/auth/register',
//     body
//   );
//   console.log(resTest.data);
//   return resTest.data;
// };

//! ЛОГИН
export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>('/auth/login', data);
  console.log(res.data);
  return res.data;
};

//! ПРОВЕРКА СЕССИИ
type CheckSessionRequest = {
  success: boolean;
};

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>('/auth/session');
  return res.data.success;
};

//! ДАННЫЕ ПОЛЬЗОВАТЕЛЯ
export const getMe = async () => {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
};

//! ЛОГАУТ
export const logout = async () => {
  await nextServer.post('/auth/logout');
};

//! Обновление профиля

export type userToUpdate = {
  username: string;
  email: string;
};

export const updateMe = async (user: userToUpdate): Promise<User> => {
  const { data } = await nextServer.patch<User>('/users/me', user);
  return data;
};
