import { NextRequest, NextResponse } from 'next/server';
import { api, ApiError } from '../../api';
import { cookies } from 'next/headers';
import { userToUpdate } from '@/lib/api/clientApi';
import { User } from '@/types/user';

export async function GET() {
  // получаем куки от сервера:
  const cookieStore = await cookies();

  try {
    //делаем запрос на юэкэнд и отправляем в хедере - куки сервера
    const { data } = await api.get('/users/me', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    //если всё хорошо возвращаем data(объект пользователя)
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          (error as ApiError).response?.data?.error ??
          (error as ApiError).message,
      },
      { status: (error as ApiError).status }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  const user = await request.json();

  const { data } = await api.patch<User>('users/me', user, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return NextResponse.json(data);
}
