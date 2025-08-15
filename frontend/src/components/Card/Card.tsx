import { useMemo, useState } from "react";

import { MastercardIcon, MastercardIconWhite, PaypassIcon } from "./CardIcons";

import { cx, sortCx } from "@/utils/cx";

const styles = sortCx({
  // Normal
  transparent: {
    root: "bg-black/10 bg-linear-to-br from-white/30 to-transparent backdrop-blur-[6px] before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-white",
    footerText: "text-white",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white/10",
  },
  "transparent-gradient": {
    root: "bg-black/10 bg-linear-to-br from-white/30 to-transparent backdrop-blur-[6px] before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-white",
    footerText: "text-white",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white/10",
  },
  "brand-dark": {
    root: "bg-linear-to-tr from-brand-900 to-brand-700 before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-white",
    footerText: "text-white",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white/10",
  },
  "brand-light": {
    root: "bg-brand-100 before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-black/10 before:ring-inset",
    company: "text-gray-700",
    footerText: "text-gray-700",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white",
  },
  "gray-dark": {
    root: "bg-linear-to-tr from-gray-900 to-gray-700 before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-white",
    footerText: "text-white",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white/10",
  },
  "gray-light": {
    root: "bg-gray-100 before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-black/10 before:ring-inset",
    company: "text-gray-700",
    footerText: "text-gray-700",
    paypassIcon: "text-gray-400",
    cardTypeRoot: "bg-white",
  },

  // Strip
  "transparent-strip": {
    root: "bg-linear-to-br from-white/30 to-transparent backdrop-blur-[6px] before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-white",
    footerText: "text-white",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white/10",
  },
  "gray-strip": {
    root: "bg-gray-100 before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-gray-700",
    footerText: "text-white",
    paypassIcon: "text-gray-400",
    cardTypeRoot: "bg-white/10",
  },
  "gradient-strip": {
    root: "bg-linear-to-b from-[#A5C0EE] to-[#FBC5EC] before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-white",
    footerText: "text-white",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white/10",
  },
  "salmon-strip": {
    root: "bg-[#F4D9D0] before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-gray-700",
    footerText: "text-white",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white/10",
  },

  // Vertical strip
  "gray-strip-vertical": {
    root: "bg-linear-to-br from-white/30 to-transparent before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-white",
    footerText: "text-white",
    paypassIcon: "text-gray-400",
    cardTypeRoot: "bg-white/10",
  },
  "gradient-strip-vertical": {
    root: "bg-linear-to-b from-[#FBC2EB] to-[#A18CD1] before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-white",
    footerText: "text-white",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white/10",
  },
  "salmon-strip-vertical": {
    root: "bg-[#F4D9D0] before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-white",
    footerText: "text-white",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white/10",
  },
});

const _NORMAL_TYPES = [
  "transparent",
  "transparent-gradient",
  "brand-dark",
  "brand-light",
  "gray-dark",
  "gray-light",
] as const;
const STRIP_TYPES = [
  "transparent-strip",
  "gray-strip",
  "gradient-strip",
  "salmon-strip",
] as const;
const VERTICAL_STRIP_TYPES = [
  "gray-strip-vertical",
  "gradient-strip-vertical",
  "salmon-strip-vertical",
] as const;

const CARD_WITH_COLOR_LOGO = [
  "brand-dark",
  "brand-light",
  "gray-dark",
  "gray-light",
] as const;

type CreditCardType =
  | (typeof _NORMAL_TYPES)[number]
  | (typeof STRIP_TYPES)[number]
  | (typeof VERTICAL_STRIP_TYPES)[number];

interface CreditCardProps {
  company?: string;
  cardNumber?: string;
  cardHolder?: string;
  cardExpiration?: string;
  cvv?: string;
  type?: CreditCardType;
  className?: string;
  width?: number;
}

const calculateScale = (
  desiredWidth: number,
  originalWidth: number,
  originalHeight: number,
) => {
  // Calculate the scale factor
  const scale = desiredWidth / originalWidth;

  // Calculate the new dimensions
  const scaledWidth = originalWidth * scale;
  const scaledHeight = originalHeight * scale;

  return {
    scale: scale.toFixed(4), // Scale rounded to 4 decimal places
    scaledWidth: scaledWidth.toFixed(2), // Width rounded to 2 decimal places
    scaledHeight: scaledHeight.toFixed(2), // Height rounded to 2 decimal places
  };
};

export const CreditCard = ({
  company = "Untitled.",
  cardNumber = "1234 1234 1234 1234",
  cardHolder = "OLIVIA RHYE",
  cardExpiration = "06/28",
  type = "brand-dark",
  className,
  width,
  cvv,
}: CreditCardProps) => {
  const originalWidth = 316;
  const originalHeight = 190;

  const { scale, scaledWidth, scaledHeight } = useMemo(() => {
    if (!width)
      return {
        scale: 1,
        scaledWidth: originalWidth,
        scaledHeight: originalHeight,
      };

    return calculateScale(width, originalWidth, originalHeight);
  }, [width]);

  const privacyBlur = "blur-xs hover:blur-none transition-all duration-300";

  const [tiltStyle, setTiltStyle] = useState({});

  const updateTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const { width, height, left, top } =
      e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - left;
    const offsetY = e.clientY - top;

    const rotateX = (offsetY / height - 0.5) * -15;
    const rotateY = (offsetX / width - 0.5) * 15;

    setTiltStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: "transform 150ms ease-out",
    });
  };

  const resetTilt = () => {
    setTiltStyle({
      transform: `perspective(800px) rotateX(0deg) rotateY(0deg)`,
      transition: "transform 300ms ease-in-out",
    });
  };

  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());

  const toggleReveal = (id: string) => {
    setRevealedCards((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }

      return newSet;
    });
  };

  const buttonClickStyle = "active:scale-90 transition-all duration-100";

  return (
    <div
      className={cx("relative flex", [className])}
      style={{
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
        ...tiltStyle,
      }}
      onMouseLeave={resetTilt}
      onMouseMove={updateTilt}
    >
      <div
        className={cx(
          "absolute top-0 left-0 flex origin-top-left flex-col justify-between overflow-hidden rounded-2xl p-4",
          styles[type].root,
        )}
        style={{
          transform: `scale(${scale})`,
          width: `${originalWidth}px`,
          height: `${originalHeight}px`,
        }}
      >
        {/* Horizontal strip */}
        {STRIP_TYPES.includes(type as (typeof STRIP_TYPES)[number]) && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-1/2 bg-gray-800"></div>
        )}
        {/* Vertical stripe */}
        {VERTICAL_STRIP_TYPES.includes(
          type as (typeof VERTICAL_STRIP_TYPES)[number],
        ) && (
          <div className="pointer-events-none absolute inset-y-0 right-22 left-0 z-0 bg-gray-800"></div>
        )}
        {/* Gradient diffusor */}
        {type === "transparent-gradient" && (
          <div className="absolute -top-4 -left-4 grid grid-cols-2 blur-3xl">
            <div className="size-20 rounded-tl-full bg-pink-500 opacity-30 mix-blend-normal" />
            <div className="size-20 rounded-tr-full bg-orange-500 opacity-50 mix-blend-normal" />
            <div className="size-20 rounded-bl-full bg-blue-500 opacity-30 mix-blend-normal" />
            <div className="size-20 rounded-br-full bg-success-500 opacity-30 mix-blend-normal" />
          </div>
        )}

        <div className="relative flex items-start justify-between px-1 pt-1">
          <div
            className={cx(
              "text-md leading-[normal] font-semibold",
              styles[type].company,
            )}
          />

          <div className="flex flex-row justify-center items-end gap-2">
            <PaypassIcon className={styles[type].paypassIcon} />
            <p className="text-lg leading-[normal] font-semibold tracking-[1px] tabular-nums">
              <button
                className={`${revealedCards.has("cvv") ? "" : privacyBlur} ${buttonClickStyle}`}
                onClick={() => toggleReveal("cvv")}
              >
                {cvv ? cvv : ""}
              </button>
            </p>
          </div>
        </div>

        <div className="relative flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex items-end gap-1">
              <button
                style={{
                  wordBreak: "break-word",
                }}
                className={cx(
                  "text-xs leading-snug font-semibold tracking-[0.6px] uppercase",
                  styles[type].footerText,
                  revealedCards.has("cardHolder") ? "" : privacyBlur,
                  buttonClickStyle,
                )}
                onClick={() => toggleReveal("cardHolder")}
              >
                {cardHolder}
              </button>
              <button
                className={cx(
                  "ml-auto text-right text-xs leading-[normal] font-semibold tracking-[0.6px] tabular-nums",
                  styles[type].footerText,
                  revealedCards.has("cardExpiration") ? "" : privacyBlur,
                  buttonClickStyle,
                )}
                onClick={() => toggleReveal("cardExpiration")}
              >
                {cardExpiration}
              </button>
            </div>
            <button
              className={cx(
                "text-md leading-[normal] font-semibold tracking-[1px] tabular-nums",
                styles[type].footerText,
                revealedCards.has("cardNumber") ? "" : privacyBlur,
                buttonClickStyle,
              )}
              onClick={() => toggleReveal("cardNumber")}
            >
              {cardNumber}

              {/* This is just a placeholder to always keep the space for card number even if there's no card number yet. */}
              <span className="pointer-events-none invisible inline-block w-0 max-w-0 opacity-0">
                1
              </span>
            </button>
          </div>

          <div
            className={cx(
              "flex h-8 w-11.5 shrink-0 items-center justify-center rounded",
              styles[type].cardTypeRoot,
            )}
          >
            {CARD_WITH_COLOR_LOGO.includes(
              type as (typeof CARD_WITH_COLOR_LOGO)[number],
            ) ? (
              <MastercardIcon />
            ) : (
              <MastercardIconWhite />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
