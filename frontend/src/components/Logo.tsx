import React from "react";

type LogoProps = {
  size?: number;
  alt?: string;
  className?: string;
};

export const Logo: React.FC<LogoProps> = ({
  size = 40,
  alt = "DataGuard Logo",
  className = "",
}) => {
  return (
    <img
      alt={alt}
      className={`cursor-pointer ${className}`}
      height={size}
      src="/logo.png"
      style={{ objectFit: "contain" }}
      width={size}
    />
  );
};
