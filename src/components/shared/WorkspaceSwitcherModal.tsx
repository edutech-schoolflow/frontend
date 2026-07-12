"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, GraduationCap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  getIdentityMe,
  selectContext,
  createParentProfile,
  landingFor,
  type AuthContext,
  type AuthContextType,
} from "@/src/lib/api/identityAuth";

/**
 * Slack-style workspace switcher as a MODAL (FE-001). Used where the trigger isn't a sidebar badge —
 * the parent family home opens it from its "Switch workspace" action and stays put. It lists only the
 * workspaces you can move TO (the one you're already in is never a target) and never offers a parent
 * profile you already hold.
 */
const ROLE_LABEL: Record<AuthContextType, string> = {
  owner: "Owner",
  staff: "Staff",
  parent: "Parent",
};

function initials(name?: string | null): string {
  if (!name) return "•";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export default function WorkspaceSwitcherModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [contexts, setContexts] = useState<AuthContext[] | null>(null);
  const [profiles, setProfiles] = useState<string[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    // No synchronous reset here — on reopen we keep the last list and refresh it in place (the fetch
    // updates it from its own callback). First open shows the loader from the initial null state.
    getIdentityMe()
      .then((me) => {
        if (cancelled) return;
        setContexts(me.contexts);
        setProfiles(me.profiles);
        setCurrentId(me.currentContextId ?? null);
      })
      .catch(() => {
        if (!cancelled) setContexts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  // The one you're inside is never a switch target. On the family home there's no current context, so
  // every workspace is reachable.
  const others = (contexts ?? []).filter((c) => c.id !== currentId);
  const hasParent =
    profiles.includes("parent") ||
    (contexts ?? []).some((c) => c.type === "parent");

  async function switchTo(ctx: AuthContext) {
    setBusy(ctx.id);
    try {
      const outcome = await selectContext(ctx.id);
      const selected =
        outcome.contexts.find((c) => c.id === outcome.selected) ?? ctx;
      onClose();
      router.push(landingFor(selected));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Couldn't switch workspace."
      );
      setBusy(null);
    }
  }

  async function becomeParent() {
    setBusy("parent");
    try {
      await createParentProfile();
      onClose();
      router.push("/parent/dashboard");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Couldn't set up parent access."
      );
      setBusy(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-[16px]"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-[420px] overflow-hidden rounded-[16px] bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f0f0f0] px-[20px] py-[16px]">
          <h2 className="text-[16px] font-semibold text-[#1b1b1b]">
            Switch workspace
          </h2>
          <button
            onClick={onClose}
            className="flex h-[28px] w-[28px] items-center justify-center rounded-[8px] text-[#666] transition-colors hover:bg-[#f5f5f5]"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-[6px]">
          {contexts === null ? (
            <div className="flex items-center justify-center py-[36px]">
              <Loader2 className="h-6 w-6 animate-spin text-brand-green" />
            </div>
          ) : (
            <>
              {others.length > 0 ? (
                <>
                  <p className="px-[20px] pb-[4px] pt-[10px] text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                    Your workspaces
                  </p>
                  {others.map((ctx) => (
                    <button
                      key={ctx.id}
                      type="button"
                      onClick={() => void switchTo(ctx)}
                      disabled={busy !== null}
                      className="flex w-full items-center gap-[12px] px-[20px] py-[11px] text-left transition-colors hover:bg-[#f7fdf9] disabled:opacity-60"
                    >
                      <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-[#e8f5ee] text-[13px] font-bold text-brand-green">
                        {initials(ctx.organizationName)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-medium text-[#1b1b1b]">
                          {ctx.organizationName ?? "Workspace"}
                        </span>
                        <span className="block text-[12px] text-[#9ca3af]">
                          {ROLE_LABEL[ctx.type]}
                        </span>
                      </span>
                      {busy === ctx.id && (
                        <Loader2 className="h-[16px] w-[16px] shrink-0 animate-spin text-brand-green" />
                      )}
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-[20px] py-[24px] text-center">
                  <p className="text-[14px] font-medium text-[#1b1b1b]">
                    You&apos;re only in your family space right now.
                  </p>
                  <p className="mt-[4px] text-[13px] text-[#666]">
                    Create or join a school and it&apos;ll show up here.
                  </p>
                </div>
              )}

              {/* Add a workspace */}
              <div className="my-[4px] border-t border-[#f0f0f0]" />
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/welcome");
                }}
                className="flex w-full items-center gap-[12px] px-[20px] py-[11px] text-left text-[14px] text-[#1b1b1b] transition-colors hover:bg-[#f5f5f5]"
              >
                <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-[#f3f4f6]">
                  <Plus className="h-[17px] w-[17px] text-[#666]" />
                </span>
                Create or join a school
              </button>
              {!hasParent && (
                <button
                  type="button"
                  onClick={() => void becomeParent()}
                  disabled={busy !== null}
                  className="flex w-full items-center gap-[12px] px-[20px] py-[11px] text-left text-[14px] text-[#1b1b1b] transition-colors hover:bg-[#f5f5f5] disabled:opacity-60"
                >
                  <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-[#f3f4f6]">
                    {busy === "parent" ? (
                      <Loader2 className="h-[16px] w-[16px] animate-spin text-[#666]" />
                    ) : (
                      <GraduationCap className="h-[17px] w-[17px] text-[#666]" />
                    )}
                  </span>
                  Use as a parent
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
