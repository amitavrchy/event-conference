"use client";

import { format } from "date-fns";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Session, Speaker } from "@/lib/types";
import { agendaApi } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addSessionOptimistic,
  removeSessionOptimistic,
} from "@/store/features/agenda/agendaSlice";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

function speakersOf(session: Session): Speaker[] {
  const list = session.speakers ?? [];
  return list.map((s) => ("speaker" in s ? s.speaker : (s as Speaker)));
}

export function SessionDrawer({
  session,
  onClose,
}: {
  session: Session | null;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((s) => s.auth);
  const sessionIds = useAppSelector((s) => s.agenda.sessionIds);
  const queryClient = useQueryClient();

  const inAgenda = session ? sessionIds.includes(session.id) : false;

  const addMut = useMutation({
    mutationFn: (id: string) => agendaApi.add(id),
    onMutate: (id) => dispatch(addSessionOptimistic(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agenda"] }),
    onError: (_e, id) => dispatch(removeSessionOptimistic(id)),
  });

  const removeMut = useMutation({
    mutationFn: (id: string) => agendaApi.remove(id),
    onMutate: (id) => dispatch(removeSessionOptimistic(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agenda"] }),
    onError: (_e, id) => dispatch(addSessionOptimistic(id)),
  });

  if (!session) return null;

  const start = new Date(session.startsAt);
  const end = new Date(session.endsAt);
  const speakers = speakersOf(session);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
        aria-label="Close session details"
        onClick={onClose}
      />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-violet/30 bg-surface p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-neon">
              {format(start, "EEE · HH:mm")} – {format(end, "HH:mm")}
            </p>
            <h2 className="mt-2 font-display text-2xl uppercase leading-tight text-text">
              {session.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-muted hover:text-text"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        <p className="mt-4 text-base text-muted">{session.abstract}</p>

        <dl className="mt-6 space-y-3 text-base">
          {session.track && (
            <div>
              <dt className="font-mono text-sm uppercase text-muted">Track</dt>
              <dd style={{ color: session.track.color }}>{session.track.name}</dd>
            </div>
          )}
          {session.room && (
            <div>
              <dt className="font-mono text-sm uppercase text-muted">Room</dt>
              <dd className="text-text">{session.room.name}</dd>
            </div>
          )}
          {session.level && (
            <div>
              <dt className="font-mono text-sm uppercase text-muted">Level</dt>
              <dd className="text-text">{session.level}</dd>
            </div>
          )}
        </dl>

        {speakers.length > 0 && (
          <div className="mt-6">
            <p className="font-mono text-sm uppercase text-muted">Speakers</p>
            <ul className="mt-2 space-y-2">
              {speakers.map((sp) => (
                <li key={sp.id}>
                  <Link
                    href={`/speakers/${sp.slug}`}
                    className="text-base text-neon hover:underline"
                  >
                    {sp.name}
                  </Link>
                  <span className="text-sm text-muted">
                    {" "}
                    · {sp.title}
                    {sp.company ? `, ${sp.company}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto space-y-3 pt-8">
          {!token ? (
            <Button href="/register" className="w-full">
              Sign in to save
            </Button>
          ) : inAgenda ? (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => removeMut.mutate(session.id)}
              disabled={removeMut.isPending}
            >
              Remove from my schedule
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={() => addMut.mutate(session.id)}
              disabled={addMut.isPending}
            >
              Add to my schedule
            </Button>
          )}
          {addMut.data?.warning === "overlap" && (
            <p className="text-sm text-warn">
              Added — this overlaps another session on your agenda.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
