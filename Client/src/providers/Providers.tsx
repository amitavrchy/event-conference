"use client";

import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { makeStore, type AppStore } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydrateAuth, setUser, logout } from "@/store/features/auth/authSlice";
import { setAgenda, clearAgenda } from "@/store/features/agenda/agendaSlice";
import { agendaApi, authApi, setAuthToken } from "@/lib/api";

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { token, hydrated, user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const meQuery = useQuery({
    queryKey: ["auth", "me", token],
    queryFn: async () => {
      if (!token) return null;
      setAuthToken(token);
      return authApi.me();
    },
    enabled: hydrated && !!token,
    retry: false,
  });

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      dispatch(setUser(null));
      dispatch(clearAgenda());
      return;
    }
    if (meQuery.isError) {
      dispatch(logout());
      dispatch(clearAgenda());
      return;
    }
    if (meQuery.data) {
      dispatch(setUser(meQuery.data));
    }
  }, [hydrated, token, meQuery.data, meQuery.isError, dispatch]);

  const agendaQuery = useQuery({
    queryKey: ["agenda", token],
    queryFn: () => agendaApi.get(),
    enabled: hydrated && !!token && !!user,
    retry: false,
  });

  useEffect(() => {
    if (agendaQuery.data) {
      dispatch(setAgenda(agendaQuery.data.sessionIds ?? []));
    }
  }, [agendaQuery.data, dispatch]);

  return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <Provider store={storeRef.current}>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap>{children}</AuthBootstrap>
      </QueryClientProvider>
    </Provider>
  );
}
