import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { api } from '../../api';
import { parseSetCookie } from 'cookie';

export async function GET() {
  // Отримуємо інстанс для роботи з cookie
  const cookieStore = await cookies();

  // Дістаємо токени
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  // Якщо accessToken є — сесія валідна
  if (accessToken) {
    return NextResponse.json({ success: true });
  }

  // Якщо accessToken немає — перевіряємо refreshToken
  if (refreshToken) {
    // Виконуємо запит до API, передаючи всі cookie у заголовку
    const apiRes = await api.get('auth/session', {
      headers: {
        Cookie: cookieStore.toString(), // перетворюємо cookie у рядок
      },
    });
    // Якщо бекенд повернув нові токени — встановлюємо їх
    const setCookie = apiRes.headers['set-cookie'];
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
      return NextResponse.json({ success: true });
    }
  }

  // Якщо немає refreshToken або API повернув пустий setCookie — сесія невалідна
  return NextResponse.json({ success: false });
}
