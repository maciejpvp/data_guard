import { useEffect, useRef, useState } from "react";
import { CiGlobe, CiCreditCard1 } from "react-icons/ci";
import { GoTerminal } from "react-icons/go";
import { IoKeyOutline } from "react-icons/io5";
import { MdOutlineEventNote } from "react-icons/md";

import { Type } from "../AddItem/AddItemModal";

type GetLogoProps = {
  url: string;
  size: number;
};

export const GetLogo = ({ url, size }: GetLogoProps) => {
  const [actualSize, setActualSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [hide, setHide] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`;

  const onLoad = () => {
    if (imgRef.current) {
      setActualSize({
        width: imgRef.current.naturalWidth,
        height: imgRef.current.naturalHeight,
      });
    }
  };

  useEffect(() => {
    if (actualSize && actualSize.width === 16 && actualSize.height === 16) {
      setHide(true);
    }
  }, [actualSize]);

  return (
    <>
      {hide ? (
        <CiGlobe size={36} />
      ) : (
        <img
          ref={imgRef}
          alt="favicon"
          className="rounded-full"
          height={size}
          src={faviconUrl}
          width={size}
          onLoad={onLoad}
        />
      )}
    </>
  );
};

type GetIconProps = {
  url?: string;
  size?: number;
  type: Type;
};

export const GetIcon = ({ url, size = 36, type }: GetIconProps) => {
  if (type === "password") {
    return (
      <>{url ? <GetLogo size={size} url={url} /> : <CiGlobe size={36} />}</>
    );
  }
  if (type === "card") {
    return <CiCreditCard1 size={36} />;
  }
  if (type === "sshkey") {
    return <GoTerminal size={36} />;
  }
  if (type === "apikey") {
    return <IoKeyOutline size={36} />;
  }
  if (type === "note") {
    return <MdOutlineEventNote size={36} />;
  }

  return <p>Invalid Type</p>;
};
