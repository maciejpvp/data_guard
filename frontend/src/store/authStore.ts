import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

import { refreshSession } from "@/utils/auth";
import { UserType } from "@/types";

interface GoogleIdTokenPayload {
  given_name?: string;
  email?: string;
  picture?: string;
}

type AuthState = {
  idToken: string;
  user: UserType | undefined;
  login: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  idToken: "",
  user: undefined,
  login: async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      // # List of endpoints that doesnt need auth
      if (!["/login", "/callback"].includes(window.location.pathname)) {
        window.location.pathname = "/login";
      }

      return;
    }

    const idToken = await refreshSession(refreshToken);

    if (idToken) {
      set({ idToken });
      const decoded = jwtDecode<GoogleIdTokenPayload>(idToken);

      set({
        user: {
          name: decoded?.given_name ?? "",
          email: decoded?.email ?? "",
          avatar: decoded?.picture ?? "",
        },
      });
    } else {
      localStorage.removeItem("refreshToken");
      window.location.pathname = "/login";
    }
  },

  refresh: async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) return;

    const idToken = await refreshSession(refreshToken);

    if (idToken) {
      set({ idToken });
    }
  },
}));
