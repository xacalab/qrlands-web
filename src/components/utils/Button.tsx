'use client';

import { Button as AntButton, ButtonProps } from 'antd';
import React from 'react';

import Link from '@web/components/utils/Link';

export default function Button({
  href,
  ...props
}: ButtonProps & React.RefAttributes<HTMLElement>) {
  let component = <AntButton {...props} />;

  if (href) {
    component = <Link href={href}>{component}</Link>;
  }

  return component;
}
