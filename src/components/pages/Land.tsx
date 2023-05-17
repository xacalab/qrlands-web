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
  const [errorMessage, setErrorMessage] = React.useState<string>();

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
        } else {
          setErrorMessage(err.message);
        }
      });
  }, [id]);

  return (
    <main className="flex flex-row p-2 gap-2">
      <div className="flex-1">
        {landData && (
          <Descriptions title={t('description-title')} bordered>
            <Descriptions.Item label={t('description-folio')}>
              {landData.folio}
            </Descriptions.Item>
            <Descriptions.Item label={t('description-measures')}>
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
      </div>
      <div className="">
        {qrValue && (
          <QRCode
            /*icon="https://static.thenounproject.com/png/3097481-200.png"*/
            value={qrValue}
          />
        )}
      </div>
    </main>
  );
}
