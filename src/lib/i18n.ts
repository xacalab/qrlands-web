export enum Language {
  EN = 'en',
  ES = 'es',
}

export const languages = Object.values(Language);
export const cookieName = 'i18n';
export const fallbackLanguage = Language.EN;

export async function getMessages(locale: Language) {
  try {
    return (await import(`@web/lib/i18n/${locale}.json`)).default;
  } catch (err) {
    return (await import(`@web/lib/i18n/${fallbackLanguage}.json`)).default;
  }
}
