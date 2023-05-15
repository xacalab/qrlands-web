import LandPage from '@web/components/pages/Land';

interface Props {
  params: {
    id: string;
  };
}

export default function LandByIdPage({ params: { id } }: Props) {
  return <LandPage id={id} />;
}
