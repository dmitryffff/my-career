"use client";

import type { ReactNode} from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: () => void | Promise<void>
  className?: string;
}

export const Button = ({ children, onClick, className }: ButtonProps): JSX.Element => {
  return (
    <button
      className={className}
      onClick={onClick}
      type="button"
      style={{
        backgroundColor: 'red',
      }}
    >
      {children}
    </button>
  );
};
