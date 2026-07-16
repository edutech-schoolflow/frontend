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
  Plus,
  Search,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import CreateSchoolModal from "@/src/components/organization/CreateSchoolModal";
import {
  getPlatformHome,
  createParentProfile,
  selectContext,
  landingFor,
  type PlatformHome,
  type WorkspaceRef,
} from "@/src/lib/api/identityAuth";

/**
 * The Platform Home (EDD-005): the identity's launcher, rendered ENTIRELY from the one
 * GET /identity/home projection — organizations (recency-ordered), capability cards, pending
 * invitations, draft schools, family summary. Everything else branches from here.
 */
const ROLE_LABEL: Record<string, string> = {
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

const card =
  "flex w-full items-center gap-[16px] rounded-[12px] border border-[#e0e0e0] bg-white px-[20px] py-[18px] text-left transition-colors hover:border-brand-green hover:bg-[#f7fdf9] disabled:opacity-60";
const iconWrap =
  "flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#e8f5ee]";
const sectionLabel =
  "text-[13px] font-medium uppercase tracking-[0.04em] text-[#888]";

export default function PlatformHomePage() {
  const router = useRouter();
  const [home, setHome] = useState<PlatformHome | undefined>(undefined);
  const [busy, setBusy] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getPlatformHome()
      .then((h) => !cancelled && setHome(h))
      .catch(() => {
        if (!cancelled) router.replace("/login?next=/dashboard");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleBecomeParent() {
    setBusy("parent");
    try {
      const { message } = await createParentProfile();
      toast.success(message);
      router.push("/family");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not set up parent access."
      );
      setBusy(null);
    }
  }

  async function enterWorkspace(w: WorkspaceRef) {
    // Entering mints the org-scoped token (select-context) — a plain link would land the shell
    // with an identity-scope session and the workspace's own API calls would 401.
    setBusy(w.contextId);
    try {
      const outcome = await selectContext(w.contextId);
      const selected = outcome.contexts.find((c) => c.id === outcome.selected);
      router.push(selected ? landingFor(selected) : `/o/${w.organizationSlug}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Couldn't open that workspace."
      );
      setBusy(null);
    }
  }

  const formatRole = (role: string) =>
    role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  if (home === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    );
  }

  const firstName = home.identity.fullName.split(" ")[0];
  const workspaces = home.switcher.recentWorkspaces;
  const continueWorking = workspaces[0];

  const workspaceCard = (w: WorkspaceRef, prominent = false) => (
    <button
      type="button"
      key={w.contextId}
      onClick={() => void enterWorkspace(w)}
      disabled={busy !== null}
      className={card + (prominent ? " border-brand-green/40" : "")}
    >
      <span className={iconWrap + " rounded-[10px] text-[13px] font-bold text-brand-green"}>
        {initials(w.organizationName)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium text-[#1b1b1b]">
          {w.organizationName ?? "Workspace"}
        </span>
        <span className="block text-[13px] text-[#888]">
          {ROLE_LABEL[w.type] ?? w.type}
          {w.role && w.type === "staff" ? ` · ${formatRole(w.role)}` : ""}
        </span>
      </span>
      {busy === w.contextId ? (
        <Loader2 className="h-[18px] w-[18px] shrink-0 animate-spin text-brand-green" />
      ) : (
        <ArrowRight className="h-[18px] w-[18px] shrink-0 text-[#ccc]" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="flex h-[64px] items-center justify-between border-b border-[#eee] bg-white px-[28px]">
        <p className="text-[17px] font-semibold text-brand-green">SchoolFlow</p>
        <Link
          href="/settings"
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-[#666] transition-colors hover:bg-[#f5f5f5]"
          aria-label="Settings"
        >
          <Settings size={18} />
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-[680px] flex-col gap-[26px] px-[20px] py-[36px]">
        <div>
          <h1 className="text-[26px] font-medium text-[#1b1b1b]">
            Welcome, {firstName} 👋
          </h1>
          <p className="mt-[4px] text-[15px] text-[#666]">
            Your account is ready. What would you like to do?
          </p>
        </div>

        {/* Continue working — the most recently entered workspace */}
        {continueWorking && (
          <section className="flex flex-col gap-[10px]">
            <p className={sectionLabel}>Continue working</p>
            {workspaceCard(continueWorking, true)}
          </section>
        )}

        {/* Waiting for you: invites + unfinished schools (straight from the projection) */}
        {home.draftOrganizations.length > 0 && (
          <section className="flex flex-col gap-[10px]">
            <p className={sectionLabel}>Pick up where you left off</p>
            {home.draftOrganizations.map((draft) => (
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
                    You started creating a school but haven&apos;t named it yet.
                  </span>
                </span>
                <ArrowRight className="h-[18px] w-[18px] shrink-0 text-[#ccc]" />
              </Link>
            ))}
          </section>
        )}

        {home.pendingInvitations.length > 0 && (
          <section className="flex flex-col gap-[10px]">
            <p className={sectionLabel}>You&apos;ve been invited</p>
            {home.pendingInvitations.map((invite, i) => (
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
          </section>
        )}

        {/* Organizations */}
        {workspaces.length > 1 && (
          <section className="flex flex-col gap-[10px]">
            <p className={sectionLabel}>Your organizations</p>
            {workspaces.slice(1).map((w) => workspaceCard(w))}
          </section>
        )}

        {/* Quick actions — every card renders from capabilities; nothing asks "am I a parent?" */}
        <section className="flex flex-col gap-[10px]">
          <p className={sectionLabel}>Quick actions</p>

          {home.capabilities.includes("create_school") && (
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
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
              <ArrowRight className="h-[18px] w-[18px] shrink-0 text-[#ccc]" />
            </button>
          )}

          {home.capabilities.includes("open_family_home") ? (
            <Link href="/family" className={card}>
              <span className={iconWrap}>
                <GraduationCap className="h-[20px] w-[20px] text-brand-green" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium text-[#1b1b1b]">
                  Go to my family home
                </span>
                <span className="block text-[13px] text-[#888]">
                  Follow your children, pay fees, and find schools.
                </span>
              </span>
              <span className="flex items-center gap-[10px]">
                {(home.family.children > 0 || home.family.openApplications > 0) && (
                  <span className="rounded-full bg-[#e8f5ee] px-[10px] py-[3px] text-[12px] font-medium text-brand-green">
                    {home.family.children > 0
                      ? `${home.family.children} ${home.family.children === 1 ? "child" : "children"}`
                      : `${home.family.openApplications} open`}
                  </span>
                )}
                <ArrowRight className="h-[18px] w-[18px] shrink-0 text-[#ccc]" />
              </span>
            </Link>
          ) : home.capabilities.includes("add_child") ? (
            <button
              type="button"
              onClick={() => void handleBecomeParent()}
              disabled={busy !== null}
              className={card}
            >
              <span className={iconWrap}>
                <GraduationCap className="h-[20px] w-[20px] text-brand-green" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium text-[#1b1b1b]">
                  Use SchoolFlow as a parent
                </span>
                <span className="block text-[13px] text-[#888]">
                  Set up parent access to follow your child, pay fees, and find
                  schools.
                </span>
              </span>
              {busy === "parent" ? (
                <Loader2 className="h-[18px] w-[18px] shrink-0 animate-spin text-brand-green" />
              ) : (
                <ArrowRight className="h-[18px] w-[18px] shrink-0 text-[#ccc]" />
              )}
            </button>
          ) : null}

          {home.capabilities.includes("find_school") && (
            <Link href="/family/schools" className={card}>
              <span className={iconWrap}>
                <Search className="h-[20px] w-[20px] text-brand-green" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium text-[#1b1b1b]">
                  Find a school
                </span>
                <span className="block text-[13px] text-[#888]">
                  Browse schools near you and apply for admission.
                </span>
              </span>
              <ArrowRight className="h-[18px] w-[18px] shrink-0 text-[#ccc]" />
            </Link>
          )}

          <Link href="/join" className={card}>
            <span className={iconWrap}>
              <Plus className="h-[20px] w-[20px] text-brand-green" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-medium text-[#1b1b1b]">
                Join a school
              </span>
              <span className="block text-[13px] text-[#888]">
                Been invited as staff? Use the invitation link your school sent
                you.
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
        </section>
      </main>

      <CreateSchoolModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
