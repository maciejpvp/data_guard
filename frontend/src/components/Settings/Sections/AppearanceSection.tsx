import { Button, ButtonGroup } from "@heroui/button";
import { useTheme } from "@heroui/use-theme";

export const AppearanceSection = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-2">
      <h1 className="text-xl">Appearance</h1>
      <div className="flex flex-col items-start mt-2">
        <p className="mb-1 pl-1 font-semibold">Change Theme</p>
        <ButtonGroup>
          <Button
            color={theme === "light" ? "primary" : "default"}
            variant={theme === "light" ? "solid" : "ghost"}
            onPress={() => setTheme("light")}
          >
            Light
          </Button>
          <Button
            color={theme === "dark" ? "primary" : "default"}
            variant={theme === "dark" ? "solid" : "ghost"}
            onPress={() => setTheme("dark")}
          >
            Dark
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};
