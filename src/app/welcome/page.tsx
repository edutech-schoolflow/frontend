"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  School,
  GraduationCap,
  Mail,
  Briefcase,
  ArrowRight,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import AuthShell, { AUTH_BUTTON } from "@/src/components/auth/AuthShell";
import {
  getIdentityMe,
  getWelcome,
  createOrganization,
  createParentProfile,
  selectContext,
  dashboardFor,
  type IdentityMe,
  type Welcome,
} from "@/src/lib/api/identityAuth";

/**
 * The onboarding hub (EDD-001): a signed-in identity with no organization relationships chooses
 * what to do next. Registration never asks "who are you?" — this screen answers it through actions.
 */
export default function StartPage() {
  const router = useRouter();
  const [me, setMe] = useState<IdentityMe | null | undefined>(undefined); // undefined = probing
  const [welcome, setWelcome] = useState<Welcome | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getIdentityMe()
      .then((m) => {
        if (cancelled) return;
        setMe(m);
        // Adaptive extras (invites, drafts) — best-effort; the hub still works without them.
        getWelcome()
          .then((w) => !cancelled && setWelcome(w))
          .catch(() => {});
      })
      .catch(() => !cancelled && setMe(null));
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreateSchool() {
    setBusy("school");
    try {
      const { message, slug } = await createOrganization();
      toast.success(message);
      // A fresh org has no name yet → land straight in the setup wizard (/o/{slug}/setup).
      // Fall back to the workspace chooser if the slug didn't come back.
      router.push(slug ? `/o/${slug}/setup` : "/select-context");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not create your school."
      );
      setBusy(null);
    }
  }

  async function handleParentJourney() {
    setBusy("parent");
    try {
      // Two deliberate steps: the parent context creates the PROFILE; auth switches the session.
      const { contextId, message } = await createParentProfile();
      toast.success(message);
      const outcome = await selectContext(contextId);
      const selected = outcome.contexts.find((c) => c.id === outcome.selected);
      router.push(
        selected
          ? `${dashboardFor(selected.type)}/search`
          : "/parent/dashboard/search"
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not start the parent journey."
      );
      setBusy(null);
    }
  }

  const formatRole = (role: string) =>
    role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const card =
    "flex w-full items-center gap-[16px] rounded-[12px] border border-[#e0e0e0] px-[20px] py-[18px] text-left transition-colors hover:border-brand-green hover:bg-[#f7fdf9] disabled:opacity-60";
  const iconWrap =
    "flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#e8f5ee]";

  return (
    <AuthShell>
      <div className="mx-auto w-full max-w-[526px] lg:mx-0">
        {me === undefined ? (
          <div className="flex justify-center py-[80px]">
            <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
          </div>
        ) : me === null ? (
          <div className="flex flex-col gap-[18px]">
            <div>
              <h2 className="text-[24px] font-medium text-[#1b1b1b]">
                Get started
              </h2>
              <p className="mt-[6px] text-[15px] text-[#666]">
                First things first — you need an account. What you do with it
                comes right after.
              </p>
            </div>

            <div className="mt-[14px] flex flex-col gap-[12px]">
              <Link href="/register?next=/welcome" className={AUTH_BUTTON}>
                Create an account
              </Link>
              <Link
                href="/login?next=/welcome"
                className="flex h-[59px] w-full items-center justify-center rounded-[5px] border border-[#ccc] text-[18px] font-normal text-[#1b1b1b] transition-colors hover:border-brand-green"
              >
                I already have an account
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-[18px]">
            <div>
              <h2 className="text-[24px] font-medium text-[#1b1b1b]">
                Welcome, {me.fullName.split(" ")[0]}
              </h2>
              <p className="mt-[6px] text-[15px] text-[#666]">
                Your account is ready. What would you like to do?
              </p>
            </div>

            {/* Adaptive: resume unfinished schools + surface pending staff invites. */}
            {welcome && welcome.draftOrganizations.length > 0 && (
              <div className="flex flex-col gap-[10px]">
                <p className="text-[13px] font-medium uppercase tracking-[0.04em] text-[#888]">
                  Pick up where you left off
                </p>
                {welcome.draftOrganizations.map((draft) => (
                  <Link
                    key={draft.organizationId}
                    href={`/o/${draft.slug}/setup`}
                    className={card}
                  >
                    <span className={iconWrap}>
                      <Building2 className="h-[20px] w-[20px] text-brand-green" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-medium text-[#1b1b1b]">
                        Finish setting up your school
                      </span>
                      <span className="block text-[13px] text-[#888]">
                        You started creating a school but haven&apos;t named it
                        yet.
                      </span>
                    </span>
                    <ArrowRight className="h-[18px] w-[18px] shrink-0 text-[#ccc]" />
                  </Link>
                ))}
              </div>
            )}

            {welcome && welcome.pendingInvites.length > 0 && (
              <div className="flex flex-col gap-[10px]">
                <p className="text-[13px] font-medium uppercase tracking-[0.04em] text-[#888]">
                  You&apos;ve been invited
                </p>
                {welcome.pendingInvites.map((invite, i) => (
                  <Link key={i} href="/join" className={card}>
                    <span className={iconWrap}>
                      <Mail className="h-[20px] w-[20px] text-brand-green" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-medium text-[#1b1b1b]">
                        {invite.schoolName ?? "A school"} invited you as{" "}
                        {formatRole(invite.role)}
                      </span>
                      <span className="block text-[13px] text-[#888]">
                        Use the link from your SMS, or tap to enter your invite
                        code.
                      </span>
                    </span>
                    <ArrowRight className="h-[18px] w-[18px] shrink-0 text-[#ccc]" />
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-[10px] flex flex-col gap-[12px]">
              <button
                type="button"
                onClick={() => void handleCreateSchool()}
                disabled={busy !== null}
                className={card}
              >
                <span className={iconWrap}>
                  <School className="h-[20px] w-[20px] text-brand-green" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium text-[#1b1b1b]">
                    Create a school
                  </span>
                  <span className="block text-[13px] text-[#888]">
                    Set up a new school and become its owner.
                  </span>
                </span>
                {busy === "school" ? (
                  <Loader2 className="h-[18px] w-[18px] shrink-0 animate-spin text-brand-green" />
                ) : (
                  <ArrowRight className="h-[18px] w-[18px] shrink-0 text-[#ccc]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => void handleParentJourney()}
                disabled={busy !== null}
                className={card}
              >
                <span className={iconWrap}>
                  <GraduationCap className="h-[20px] w-[20px] text-brand-green" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium text-[#1b1b1b]">
                    Find a school for my child
                  </span>
                  <span className="block text-[13px] text-[#888]">
                    Browse schools, apply, and track your child&apos;s
                    admission.
                  </span>
                </span>
                {busy === "parent" ? (
                  <Loader2 className="h-[18px] w-[18px] shrink-0 animate-spin text-brand-green" />
                ) : (
                  <ArrowRight className="h-[18px] w-[18px] shrink-0 text-[#ccc]" />
                )}
              </button>

              <Link href="/join" className={card}>
                <span className={iconWrap}>
                  <Mail className="h-[20px] w-[20px] text-brand-green" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium text-[#1b1b1b]">
                    Join a school
                  </span>
                  <span className="block text-[13px] text-[#888]">
                    Been invited as staff? Use the invitation link your school
                    sent you.
                  </span>
                </span>
                <ArrowRight className="h-[18px] w-[18px] shrink-0 text-[#ccc]" />
              </Link>

              <div
                className={`${card} cursor-default opacity-60 hover:border-[#e0e0e0] hover:bg-white`}
              >
                <span className={iconWrap}>
                  <Briefcase className="h-[20px] w-[20px] text-brand-green" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium text-[#1b1b1b]">
                    Browse jobs
                  </span>
                  <span className="block text-[13px] text-[#888]">
                    Teaching and non-teaching vacancies — coming soon.
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
