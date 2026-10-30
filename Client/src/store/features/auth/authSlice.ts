import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/lib/types";
import { setAuthToken } from "@/lib/api";

const TOKEN_KEY = "nexus_token";
const USER_KEY = "nexus_user";

export type AuthState = {
  token: string | null;
  user: User | null;
  hydrated: boolean;
};

const initialState: AuthState = {
  token: null,
  user: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth(state) {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem(TOKEN_KEY);
      const raw = localStorage.getItem(USER_KEY);
      state.token = token;
      if (raw) {
        try {
          state.user = JSON.parse(raw) as User;
        } catch {
          state.user = null;
        }
      }
      state.hydrated = true;
      setAuthToken(token);
    },
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user: User }>,
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.hydrated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, action.payload.token);
        localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
      }
      setAuthToken(action.payload.token);
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        if (action.payload) {
          localStorage.setItem(USER_KEY, JSON.stringify(action.payload));
        } else {
          localStorage.removeItem(USER_KEY);
        }
      }
    },
    logout(state) {
      state.token = null;
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
      setAuthToken(null);
    },
  },
});

export const { hydrateAuth, setCredentials, setUser, logout } =
  authSlice.actions;
export default authSlice.reducer;
