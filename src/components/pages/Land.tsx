'use client';

import { PushpinOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { Button, Descriptions, QRCode } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';

import { APIFetchError, apiFetch } from '@web/lib/typed-fetch';

interface Props {
  id: string;
}

interface LandAPIData {
  id: string;
  folio: string;
  residencial: string;
  measures: string;
  adjoining: string[];
  licenseStatus: boolean;
  debtStatus: boolean;
  agrarianCore: string;
  observations: string[];
  locationURL: string;
  isApproved: boolean;
}

function buildURL(id: string) {
  const { host, protocol } = window.location;

  return `${protocol}//${host}/lands/${id}`;
}

export default function LandPage({ id }: Props) {
  const t = useTranslations('Land');
  const router = useRouter();
  const [qrValue, setQrValue] = React.useState<string>();
  const [landData, setLandData] = React.useState<LandAPIData>();

  React.useEffect(() => {
    apiFetch<LandAPIData>(`/lands/${id}`, {
      method: 'GET',
    })
      .then(({ data }) => {
        setLandData(data);
        setQrValue(buildURL(id));
      })
      .catch((err: APIFetchError) => {
        if (err.status === 404) {
          router.push('/404');
        }
      });
  }, [id, router, setLandData, setQrValue]);

  return (
    <main className="bg-yellow-50">
      <header className="relative flex flex-col items-center justify-center w-full ">
        <img
          className="w-full  min-[768px]:hidden"
          src="/assets/cabeza-mobile.png"
          alt=""
        />
        <img
          className="hidden min-[768]:show"
          src="/assets/cabeza-escritorio.png"
          alt=""
        />
        <p className="font-serif text-xs text-justify">
          Los que suscribimos: Presidente, Secretario, Tesorero respecticamente
          del Comisariado de Bienes Comunales y el Consejo de Vigilancia de San
          Francisco Cozoaltepec, Distrito de Pochutla, Estado de Oaxaca, con
          fundamento en los artículos 33 fracción II, 57, 60, 64, 69 y 80 de la
          nueva legislación agraria vigente.
        </p>
      </header>
      <section className="flex-1">
        {landData && (
          <Descriptions title={t('description-title')} bordered>
            <Descriptions.Item label={t('description-owner')}>
              {landData.folio}
            </Descriptions.Item>
            <Descriptions.Item label={t('description-residencial')}>
              {landData.residencial}
            </Descriptions.Item>
            <Descriptions.Item label={t('description-measures')} span={3}>
              {landData.measures}
            </Descriptions.Item>
            <Descriptions.Item label={t('description-adjoining')}>
              {landData.adjoining}
            </Descriptions.Item>
            <Descriptions.Item label={t('description-license-status')}>
              {landData.licenseStatus
                ? t('description-yes')
                : t('description-no')}
            </Descriptions.Item>
            <Descriptions.Item label={t('description-debts-status')}>
              {landData.debtStatus ? t('description-yes') : t('description-no')}
            </Descriptions.Item>
            <Descriptions.Item label={t('description-agrarian-core')}>
              {landData.agrarianCore}
            </Descriptions.Item>
            <Descriptions.Item label={t('description-observations')}>
              {landData.observations.map((observation) => observation)}
            </Descriptions.Item>
            <Descriptions.Item label={t('description-location')}>
              <a href={landData.locationURL} target="_blank">
                <Button icon={<PushpinOutlined />}></Button>
              </a>
            </Descriptions.Item>
            <Descriptions.Item label={t('description-approved')}>
              {landData.isApproved ? t('description-yes') : t('description-no')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </section>
      <div className="">{qrValue && <QRCode value={qrValue} />}</div>
    </main>
  );
}
