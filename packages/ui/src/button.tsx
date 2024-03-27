'use client';

import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick: () => void | Promise<void>;
  className?: string;
}

export const Button = ({
  children,
  onClick,
  className,
}: ButtonProps): JSX.Element => {
  return (
    <button
      className={className}
      onClick={void onClick}
      style={{
        backgroundColor: 'red',
      }}
      type="button"
    >
      {children}
    </button>
  );
};
