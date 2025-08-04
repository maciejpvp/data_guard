import { ThemeSwitch } from "@/components/theme-switch";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen items-center justify-center">
      {children}
      <div className="absolute bottom-3 right-4">
        <ThemeSwitch />
      </div>
    </div>
  );
}
