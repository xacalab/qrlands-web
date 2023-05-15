import { NextIntlClientProvider } from 'next-intl';

import ClientWrapper from '@web/components/layout/ClientWrapper';
import * as i18n from '@web/lib/i18n';
import '@web/app/globals.css';

export const metadata = {
  title: 'POC',
  description: 'POC',
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: i18n.Language };
}) {
  const messages = await i18n.getMessages(locale);

  return (
    <html lang={locale}>
      <head>
        <link rel="stylesheet" href="/antd.min.css" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientWrapper>{children}</ClientWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
