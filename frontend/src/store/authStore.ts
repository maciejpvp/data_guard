import { create } from "zustand";

import { refreshSession } from "@/utils/auth";

interface AuthState {
  idToken: string;
  login: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  idToken: "",

  login: async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      if (window.location.pathname !== "/login") {
        window.location.pathname = "/login";
      }

      return;
    }

    const idToken = await refreshSession(refreshToken);

    if (idToken) {
      set({ idToken });
      console.log(idToken);
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
