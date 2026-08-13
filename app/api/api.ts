import axios, { AxiosError } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

export const api = axios.create({
  // baseURL: 'https://notehub-public.goit.study/api',
  baseURL: 'https://notehub-api.goit.study',
  withCredentials: true, // також додаємо цей параметр
  // headers: {
  //   Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  // },
});
