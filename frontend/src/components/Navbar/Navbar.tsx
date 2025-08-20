import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
} from "@heroui/navbar";

import { Logo } from "../Logo";

import { User } from "./User";
import { MobileMenu } from "./MobileMenu";

import { ThemeSwitch } from "@/components/theme-switch";
import { useAuthStore } from "@/store/authStore";

export const Navbar = () => {
  const user = useAuthStore((store) => store.user);

  return (
    <HeroUINavbar className="mt-3" maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start mt-1 items-center gap-1"
            color="foreground"
            href="/"
          >
            <Logo />
            <p className="font-bold text-inherit">DataGuard</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex">
          {user && <User user={user} />}
        </NavbarItem>
        <ThemeSwitch className="hidden" />
      </NavbarContent>

      {/* Phone Navbar */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Phone Drop Down */}
      <MobileMenu />
    </HeroUINavbar>
  );
};
