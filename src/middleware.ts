import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';

import * as i18n from '@web/lib/i18n';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|arena-favicon.svg|sw.js|antd.*).*)',
  ],
};

export function middleware(req: NextRequest) {
  let lang: i18n.Language = i18n.Language.EN;

  const pathname = req.nextUrl.pathname;

  if (i18n.languages.some((lng) => pathname.startsWith(`/${lng}`))) {
    return NextResponse.next();
  }

  if (req.cookies.has(i18n.cookieName)) {
    lang = acceptLanguage.get(
      req.headers.get(i18n.cookieName),
    ) as i18n.Language;
  } else if (acceptLanguage.get(req.headers.get('Accept-Language'))) {
    lang = acceptLanguage.get(
      req.headers.get('Accept-Language'),
    ) as i18n.Language;
  }

  if (!i18n.languages.includes(lang as i18n.Language)) {
    lang = i18n.Language.EN;
  }

  return NextResponse.redirect(new URL(`/${lang}${pathname}`, req.url));
}

export { default } from 'next-auth/middleware';
