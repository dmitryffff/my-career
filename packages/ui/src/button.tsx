"use client";

import type { ReactNode} from "react";
import { useEffect, useState } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
}

export const Button = ({ children, className, appName }: ButtonProps): JSX.Element => {
  return (
    <button
      className={className}
      /* eslint-disable-next-line no-console --
      * Here's a very long description about why this configuration is necessary
      * along with some additional information
      **/
      onClick={() => { console.log(`Hello from your ${appName} app!`); }}
      type="button"
    >
      {children}
    </button>
  );
};
