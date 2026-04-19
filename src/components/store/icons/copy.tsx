import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export default function CopyIcon({
  size = 24,
  className,
  ...props
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* giấy phía sau */}
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      {/* giấy phía trước */}
      <path d="M5 15H4a2 2 0 0 1-2-2V4 a2 2 0 0 1 2-2h9 a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
