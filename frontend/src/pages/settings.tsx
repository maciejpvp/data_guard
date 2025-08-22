import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { AppearanceSection } from "@/components/Settings/Sections/AppearanceSection";
import { UserSection } from "@/components/Settings/Sections/UserSection";
import SettingsLayout from "@/layouts/settings";

export const SettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const side = searchParams.get("side");

  useEffect(() => {
    if (!side) {
      setSearchParams({ side: "account" });
    }
  }, [side, setSearchParams]);

  return (
    <SettingsLayout>
      <div className="h-full w-full flex flex-row">
        {side === "account" ? (
          <UserSection />
        ) : side === "appearance" ? (
          <AppearanceSection />
        ) : (
          ""
        )}
      </div>
    </SettingsLayout>
  );
};
