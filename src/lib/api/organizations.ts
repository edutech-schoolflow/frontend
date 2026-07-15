import { apiGet, apiPatch } from "./client";
import type { AuthContext } from "./identityAuth";

// FE-001 Phase 2 — the /o/{slug} workspace. One identity, many organizations; the workspace URL is
// the slug (D-FE-1: everything lives under /o/{slug}, portal prefixes retire). Mirrors the backend
// OrganizationWorkspaceResponse (GET /api/v1/organizations/{slug}).

export interface Workspace {
  organizationId: string;
  slug: string;
  /** Null until the Organization Wizard names the school — the workspace shows a setup state. */
  name: string | null;
  logoUrl?: string | null;
  status: string;
  kycStatus: string;
  /** The caller's own context in this organization — drives what the workspace shows. */
  myContext: AuthContext;
}

/**
 * Resolves a workspace by slug for the signed-in identity. The backend returns 404 whether the slug
 * is unknown OR isn't the caller's — a workspace URL reveals nothing about orgs you don't belong to.
 */
export async function getWorkspace(slug: string): Promise<Workspace> {
  const { data } = await apiGet<Workspace>(
    `/organizations/${encodeURIComponent(slug)}`
  );
  return data;
}

/** The workspace URL for a context, or null when it isn't org-scoped (has no slug yet). */
export function workspaceHref(
  ctx: Pick<AuthContext, "organizationSlug">
): string | null {
  return ctx.organizationSlug ? `/o/${ctx.organizationSlug}` : null;
}

export interface SetupOrganizationInput {
  name: string;
  /** Drives the standard class ladder (nursery | primary | secondary | combined). */
  type?: string;
  state?: string;
}

/**
 * Organization Wizard — names a bootstrapped org (owner-only). Naming re-slugs the workspace, so the
 * returned workspace carries the NEW slug; the caller must route to /o/{workspace.slug}.
 */
export async function setupOrganization(
  slug: string,
  input: SetupOrganizationInput
): Promise<Workspace> {
  const { data } = await apiPatch<Workspace>(
    `/organizations/${encodeURIComponent(slug)}`,
    {
      name: input.name,
      type: input.type || null,
      state: input.state || null,
    }
  );
  return data;
}
