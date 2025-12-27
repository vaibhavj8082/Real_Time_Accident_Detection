import type { SVGProps } from 'react';

export function AlertWatchLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 2L3.62 6.39V15.26C3.62 18.33 6.88 22 12 22C17.12 22 20.38 18.33 20.38 15.26V6.39L12 2Z"
        className="fill-current text-sidebar-primary"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15V10"
        className="stroke-current text-sidebar-primary-foreground"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 17.0195V17"
        className="stroke-current text-sidebar-primary-foreground"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}