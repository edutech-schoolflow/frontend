"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check, Plus, GraduationCap, Loader2 } from "lucide-react";
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
 * Slack-style workspace switcher (FE-001). Shows the current workspace's badge; clicking it drops a
 * menu of the OTHER workspaces you can switch to (the current one is the header, never a target) plus
 * ways to add one. Switching re-mints the session in place — no full-page /select-context hop.
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

export default function WorkspaceSwitcher({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [contexts, setContexts] = useState<AuthContext[] | null>(null);
  const [profiles, setProfiles] = useState<string[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    getIdentityMe()
      .then((me) => {
        if (cancelled) return;
        setContexts(me.contexts);
        setProfiles(me.profiles);
        setCurrentId(me.currentContextId ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = contexts?.find((c) => c.id === currentId) ?? null;
  const others = (contexts ?? []).filter((c) => c.id !== currentId);
  const currentName = current?.organizationName ?? "Workspace";

  async function switchTo(ctx: AuthContext) {
    setBusy(ctx.id);
    try {
      const outcome = await selectContext(ctx.id);
      const selected =
        outcome.contexts.find((c) => c.id === outcome.selected) ?? ctx;
      setOpen(false);
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
      setOpen(false);
      router.push("/parent/dashboard");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Couldn't set up parent access."
      );
      setBusy(null);
    }
  }

  return (
    <div ref={ref} className="relative">
      {/* Current workspace badge (the trigger) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={collapsed ? currentName : undefined}
        className={`flex items-center rounded-[8px] transition-colors hover:bg-white/10 ${
          collapsed
            ? "justify-center p-[6px]"
            : "w-full gap-[10px] px-[8px] py-[7px]"
        }`}
      >
        <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[#1ca95c] text-[13px] font-bold text-white">
          {initials(currentName)}
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-[14px] font-semibold text-white">
                {currentName}
              </span>
              {current && (
                <span className="block text-[11px] text-white/60">
                  {ROLE_LABEL[current.type]}
                </span>
              )}
            </span>
            <ChevronDown
              className={`h-[15px] w-[15px] shrink-0 text-white/60 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute z-50 mt-[6px] w-[268px] overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white shadow-xl ${
            collapsed ? "left-[52px] top-0" : "left-0"
          }`}
        >
          {/* Current workspace header */}
          <div className="flex items-center gap-[10px] px-[14px] py-[12px]">
            <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[9px] bg-[#1ca95c] text-[14px] font-bold text-white">
              {initials(currentName)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-[#1b1b1b]">
                {currentName}
              </p>
              {current && (
                <p className="text-[12px] text-[#9ca3af]">
                  {ROLE_LABEL[current.type]} · current
                </p>
              )}
            </div>
            <Check className="h-[16px] w-[16px] shrink-0 text-brand-green" />
          </div>

          {/* Other workspaces to switch to */}
          {others.length > 0 && (
            <>
              <div className="border-t border-[#f0f0f0]" />
              <p className="px-[14px] pb-[4px] pt-[10px] text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                Switch to
              </p>
              {others.map((ctx) => (
                <button
                  key={ctx.id}
                  type="button"
                  onClick={() => void switchTo(ctx)}
                  disabled={busy !== null}
                  className="flex w-full items-center gap-[10px] px-[14px] py-[9px] text-left transition-colors hover:bg-[#f7fdf9] disabled:opacity-60"
                >
                  <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[#e8f5ee] text-[12px] font-bold text-brand-green">
                    {initials(ctx.organizationName)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium text-[#1b1b1b]">
                      {ctx.organizationName ?? "Workspace"}
                    </span>
                    <span className="block text-[11.5px] text-[#9ca3af]">
                      {ROLE_LABEL[ctx.type]}
                    </span>
                  </span>
                  {busy === ctx.id && (
                    <Loader2 className="h-[15px] w-[15px] shrink-0 animate-spin text-brand-green" />
                  )}
                </button>
              ))}
            </>
          )}

          {/* Add a workspace */}
          <div className="border-t border-[#f0f0f0]" />
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push("/welcome");
            }}
            className="flex w-full items-center gap-[10px] px-[14px] py-[10px] text-left text-[13.5px] text-[#1b1b1b] transition-colors hover:bg-[#f5f5f5]"
          >
            <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[#f3f4f6]">
              <Plus className="h-[16px] w-[16px] text-[#666]" />
            </span>
            Create or join a school
          </button>
          {!profiles.includes("parent") &&
            !(contexts ?? []).some((c) => c.type === "parent") && (
              <button
                type="button"
                onClick={() => void becomeParent()}
                disabled={busy !== null}
                className="flex w-full items-center gap-[10px] px-[14px] py-[10px] text-left text-[13.5px] text-[#1b1b1b] transition-colors hover:bg-[#f5f5f5] disabled:opacity-60"
              >
                <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[#f3f4f6]">
                  {busy === "parent" ? (
                    <Loader2 className="h-[15px] w-[15px] animate-spin text-[#666]" />
                  ) : (
                    <GraduationCap className="h-[16px] w-[16px] text-[#666]" />
                  )}
                </span>
                Use as a parent
              </button>
            )}
        </div>
      )}
    </div>
  );
}
