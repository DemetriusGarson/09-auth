import { NextRequest, NextResponse } from 'next/server';
import { api, ApiError } from '../../api';
// Імпортуємо parse з пакету cookie та cookies з next/headers:
import { parseSetCookie } from 'cookie';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  // Парсимо body:
  const body = await req.json();
  try {
    // Запит до бекенду:
    const apiRes = await api.post('/auth/login', body);
    // Отримуємо інстанс для роботи з cookies:
    const cookieStore = await cookies(); //! куки браузера
    // Отримуємо значення set-cookie з хедерів:
    const setCookie = apiRes.headers['set-cookie']; //!куки от бэкэнда
    // Додаємо перевірку існування setCookie:
    if (setCookie) {
      // Примусово робимо масив:
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      // Проходимось по масиву та парсимо кожне значення:
      // щоб отримати результат у вигляді обʼєкту:
      for (const cookieStr of cookieArray) {
        const parsed = parseSetCookie(cookieStr);
        // Створюємо налаштування для cookies:
        const options = {
          expires: parsed.expires ? new Date(parsed.expires) : undefined,
          path: parsed.path,
          maxAge: Number(parsed.maxAge),
        };
        // Методом cookieStore.set додаємо кукі до нашого запиту:
        if (parsed.name === 'accessToken' && parsed.value) {
          // cookieStore.set('імʼя ключа',  'значення токену',  додаткові налаштування)
          cookieStore.set(parsed.name, parsed.value, options);
        }
        if (parsed.name === 'refreshToken' && parsed.value) {
          cookieStore.set(parsed.name, parsed.value, options);
        }
      }
      // Тільки якщо є setCookie повертаємо результат
      return NextResponse.json(apiRes.data);
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
