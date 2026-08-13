import { cookies } from 'next/headers';
import { api } from '../../api';
import { NextResponse } from 'next/server';

export async function POST() {
  // получаем куки от браузера:
  const cookieStore = await cookies();
  console.log(cookieStore);

  await api.post('auth/logout', null, {
    //!Треба явно указать тело запроса null
    // Передаємо поточні cookie до API
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  // Очищаємо токени після запиту
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');

  return NextResponse.json({ message: 'Logged out successfully' });
}
