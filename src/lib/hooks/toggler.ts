'use client';

import React from 'react';

export function useToggle(initialValue: boolean) {
  const [value, setValue] = React.useState<boolean>(initialValue);

  // If receives a value, set it. If not, toggle the current value
  const togglerFunction = React.useCallback(
    (newVal?: boolean | unknown) =>
      typeof newVal === 'boolean' ? setValue(newVal) : setValue((cur) => !cur),
    [setValue],
  );

  return [value, togglerFunction] as const;
}
