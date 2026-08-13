import { NextRequest, NextResponse } from 'next/server';
import { api, ApiError } from '../api';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get('search');
  const page = request.nextUrl.searchParams.get('page');
  const perPage = request.nextUrl.searchParams.get('perPage');
  const tag = request.nextUrl.searchParams.get('tag');

  const cookieStore = await cookies();

  try {
    const { data } = await api.get('/notes', {
      params: {
        search,
        page,
        perPage,
        tag,
      },
      //!передаём куки что бы передать токены к запросу
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
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

export async function POST(request: NextRequest) {
  const note = await request.json();
  try {
    const { data } = await api.post('/notes', note);
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
