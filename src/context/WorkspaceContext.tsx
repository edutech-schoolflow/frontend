"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Workspace } from "@/src/lib/api/organizations";

// The resolved /o/{slug} workspace, made available to every page under the shell. Provided by the
// workspace layout once the slug has been validated against the signed-in identity's contexts.

const WorkspaceContext = createContext<Workspace | null>(null);

export function WorkspaceProvider({
  workspace,
  children,
}: {
  workspace: Workspace;
  children: ReactNode;
}) {
  return (
    <WorkspaceContext.Provider value={workspace}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): Workspace {
  const workspace = useContext(WorkspaceContext);
  if (!workspace) {
    throw new Error(
      "useWorkspace must be used inside a /o/[slug] workspace route."
    );
  }
  return workspace;
}
