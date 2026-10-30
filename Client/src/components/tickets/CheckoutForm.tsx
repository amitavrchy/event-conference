"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ticketsApi } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
});

type FormValues = z.infer<typeof schema>;

export function CheckoutForm({ ticketTypeId }: { ticketTypeId: string | null }) {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  const checkout = useMutation({
    mutationFn: ticketsApi.checkout,
    onSuccess: (res) => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("nexus_last_ticket", JSON.stringify(res.ticket));
      }
      if (res.mode === "stripe" && res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
        return;
      }
      router.push(`/ticket/pass?code=${encodeURIComponent(res.ticket.code)}`);
    },
  });

  if (!ticketTypeId) {
    return (
      <p className="text-base text-muted">Select a tier above to continue.</p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) =>
        checkout.mutate({ ...values, ticketTypeId }),
      )}
      className="mx-auto max-w-md space-y-5 border border-white/10 bg-surface/60 p-6"
    >
      <h3 className="font-display text-2xl text-text">Checkout</h3>
      <p className="text-sm text-muted">
        Secure payment via Stripe Checkout. Test mode works with Stripe test
        keys; without keys, checkout falls back to mock PAID.
      </p>
      <div>
        <label className="mb-2 block text-sm text-muted" htmlFor="name">
          Full name
        </label>
        <input
          id="name"
          className="w-full rounded-sm border border-white/15 bg-bg px-4 py-3 text-base text-text outline-none focus:border-neon"
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-warn">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label className="mb-2 block text-sm text-muted" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded-sm border border-white/15 bg-bg px-4 py-3 text-base text-text outline-none focus:border-neon"
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-warn">{errors.email.message}</p>
        )}
      </div>
      {checkout.isError && (
        <p className="text-sm text-warn">Checkout failed. Is the API running?</p>
      )}
      <Button type="submit" className="w-full" disabled={checkout.isPending}>
        {checkout.isPending ? "Redirecting…" : "Pay with Stripe"}
      </Button>
    </form>
  );
}
