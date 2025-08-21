import { AppearanceSection } from "@/components/Settings/Sections/AppearanceSection";
import { UserSection } from "@/components/Settings/Sections/UserSection";
import { SettingsSidebar } from "@/components/Settings/SettingsSidebar";
import SettingsLayout from "@/layouts/settings";
import { useSearchParams } from "react-router-dom";

export const SettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const side = searchParams.get("side");

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
