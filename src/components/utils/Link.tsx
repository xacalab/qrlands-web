import NextLink, { LinkProps } from 'next/link';
import { useParams } from 'next/navigation';

interface Props extends LinkProps {
  children: React.ReactNode;
}

export default function Link({ locale, href, ...props }: Props) {
  const params = useParams() || {};
  const localeInPathname = params.locale;

  return (
    <NextLink
      href={`/${locale ? locale : localeInPathname}${href}`}
      {...props}
    />
  );
}
