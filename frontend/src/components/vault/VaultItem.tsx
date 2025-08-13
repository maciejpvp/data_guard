import { useEffect, useRef, useState } from "react";
import { DynamicField } from "../AddItem/Forms/DynamicForm";
import { Card, CardBody } from "@heroui/card";
import { CiGlobe } from "react-icons/ci";
import { VaultItemDropdown } from "./VaultItemDropdown";
import { user } from "@heroui/theme";

type Props = {
  item: DynamicField[];
};

type GetIconProps = {
  url: string;
  size?: number;
};

export const GetIcon = ({ url, size = 36 }: GetIconProps) => {
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

export const VaultItem = ({ item }: Props) => {
  const getField = (key: string) => item.find((f) => f.key === key);

  const name = getField("name")?.defaultValue || "(No name)";
  const username = getField("username")?.defaultValue;
  const password = getField("password")?.defaultValue;
  const url = getField("url")?.defaultValue;
  const note = getField("note")?.defaultValue;

  return (
    <li>
      <Card>
        <CardBody className="ml-3 flex flex-row items-center justify-between gap-6">
          <div className="flex flex-row items-center gap-6">
            {url ? <GetIcon url={url} /> : <CiGlobe size={36} />}
            <div>
              <h1 className="text-lg text-blue-400 font-semibold">
                {url ? (url.split("://").at(1) ?? url) : name}
              </h1>
              <p className="text-default-600">{username}</p>
            </div>
          </div>
          <VaultItemDropdown
            password={password ?? ""}
            url={url}
            username={username ?? ""}
          />
        </CardBody>
      </Card>
    </li>
  );
};
