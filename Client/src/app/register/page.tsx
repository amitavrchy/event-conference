"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/features/auth/authSlice";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Min 6 characters"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name required"),
  company: z.string().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", name: "", company: "" },
  });

  const loginMut = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      dispatch(setCredentials({ token: data.accessToken, user: data.user }));
      router.push("/schedule");
    },
  });

  const registerMut = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      dispatch(setCredentials({ token: data.accessToken, user: data.user }));
      router.push("/tickets");
    },
  });

  const inputClass =
    "w-full rounded-md border border-violet/30 bg-bg px-4 py-3 text-base text-text outline-none focus:border-neon";

  return (
    <Section
      eyebrow="Account"
      title={mode === "login" ? "Sign in" : "Register"}
      description="Build your agenda and claim ticket passes."
      className="pt-12"
    >
      <div className="mb-8 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={cn(
            "rounded-md border px-4 py-2 text-sm",
            mode === "login"
              ? "border-neon text-neon"
              : "border-violet/30 text-muted",
          )}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={cn(
            "rounded-md border px-4 py-2 text-sm",
            mode === "register"
              ? "border-neon text-neon"
              : "border-violet/30 text-muted",
          )}
        >
          Create account
        </button>
      </div>

      <p className="mb-6 rounded-md border border-violet/20 bg-surface/40 px-4 py-3 text-sm text-muted">
        Demo: <span className="text-neon">amitav@nexusconf.dev</span> /{" "}
        <span className="text-neon">nexus2026</span> · staff@ / admin@ same
        password
      </p>

      {mode === "login" ? (
        <form
          onSubmit={loginForm.handleSubmit((v) => loginMut.mutate(v))}
          className="mx-auto max-w-md space-y-4"
        >
          <div>
            <label className="mb-2 block text-sm text-muted" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              className={inputClass}
              {...loginForm.register("email")}
            />
            {loginForm.formState.errors.email && (
              <p className="mt-1 text-sm text-warn">
                {loginForm.formState.errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              className="mb-2 block text-sm text-muted"
              htmlFor="login-password"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className={inputClass}
              {...loginForm.register("password")}
            />
            {loginForm.formState.errors.password && (
              <p className="mt-1 text-sm text-warn">
                {loginForm.formState.errors.password.message}
              </p>
            )}
          </div>
          {loginMut.isError && (
            <p className="text-sm text-warn">Login failed. Check credentials.</p>
          )}
          <Button type="submit" className="w-full" disabled={loginMut.isPending}>
            {loginMut.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      ) : (
        <form
          onSubmit={registerForm.handleSubmit((v) => registerMut.mutate(v))}
          className="mx-auto max-w-md space-y-4"
        >
          <div>
            <label className="mb-2 block text-sm text-muted" htmlFor="reg-name">
              Name
            </label>
            <input
              id="reg-name"
              className={inputClass}
              {...registerForm.register("name")}
            />
            {registerForm.formState.errors.name && (
              <p className="mt-1 text-sm text-warn">
                {registerForm.formState.errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm text-muted" htmlFor="reg-email">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              className={inputClass}
              {...registerForm.register("email")}
            />
            {registerForm.formState.errors.email && (
              <p className="mt-1 text-sm text-warn">
                {registerForm.formState.errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              className="mb-2 block text-sm text-muted"
              htmlFor="reg-company"
            >
              Company (optional)
            </label>
            <input
              id="reg-company"
              className={inputClass}
              {...registerForm.register("company")}
            />
          </div>
          <div>
            <label
              className="mb-2 block text-sm text-muted"
              htmlFor="reg-password"
            >
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              className={inputClass}
              {...registerForm.register("password")}
            />
            {registerForm.formState.errors.password && (
              <p className="mt-1 text-sm text-warn">
                {registerForm.formState.errors.password.message}
              </p>
            )}
          </div>
          {registerMut.isError && (
            <p className="text-sm text-warn">
              Registration failed. Email may already exist.
            </p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={registerMut.isPending}
          >
            {registerMut.isPending ? "Creating…" : "Create account"}
          </Button>
        </form>
      )}
    </Section>
  );
}
