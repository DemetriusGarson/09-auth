import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { checkServerSession } from './lib/api/serverApi';
import { parseSetCookie } from 'cookie';

// масив приватних маршрутів:

const privateRoutes = ['/notes', '/profile'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  // Отримання токенів із cookie:
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  // Шлях, на який користувач намагається перейти
  const { pathname } = request.nextUrl;

  // При помощи метода массива some, проверяем имеет ли pathname в себе публичный машрут
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // При помощи метода массива some, проверяем имеет ли pathname в себе приватный машрут
  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  //! if (!accessToken) +++++++++++++++++++++++++++++++
  if (!accessToken) {
    //! if (refreshToken) +++++++++++++++++++++++++++++
    if (refreshToken) {
      // Якщо accessToken відсутній, але є refreshToken — потрібно перевірити сесію навіть для публічного маршруту,
      // адже сесія може залишатися активною, і тоді потрібно заборонити доступ до публічного маршруту.
      // Отримуємо нові cookie
      const data = await checkServerSession();
      const setCookie = data.headers['set-cookie'];
      //! if(setCookie) +++++++++++++++++++++++++++++++++
      if (setCookie) {
        // Примусово робимо масив:
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        // Проходимось по масиву та парсимо кожне значення:
        // щоб отримати результат у вигляді обʼєкту:
        for (const cookieStr of cookieArray) {
          const parsed = parseSetCookie(cookieStr);

          if (parsed.value) {
            cookieStore.set(parsed.name, parsed.value, parsed);
          }
        }
        // Якщо сесія все ще активна:
        // для публічного маршруту — виконуємо редірект на головну.
        if (isPublicRoute) {
          return NextResponse.redirect(new URL('/', request.url), {
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
        // для приватного маршруту — дозволяємо доступ
        if (isPrivateRoute) {
          // важливо — передаємо нові cookie далі, щоб оновити їх у браузері
          return NextResponse.next({
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
      }
      //! if(setCookie) ---------------------------------
    }
    //! if (refreshToken) -----------------------------
    // Якщо refreshToken або сесії немає:
    // публічний маршрут — дозволяємо доступ
    if (isPublicRoute) {
      return NextResponse.next();
    }
    // Якщо refreshToken або сесії немає:
    // приватний маршрут — редірект на сторінку входу
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }
  //! if (!accessToken) -------------------------------

  // Якщо accessToken існує:
  // публічний маршрут — виконуємо редірект на головну
  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // приватний маршрут — дозволяємо доступ
  if (isPrivateRoute) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};
