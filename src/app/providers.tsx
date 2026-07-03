"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { AuthProvider } from "@/src/context/AuthContext";
import { store } from "@/src/lib/store/store";
import { Toaster } from "@/src/components/ui/sonner";
import { useState, ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {/* AuthProvider still serves the not-yet-migrated portals (parent/staff mocks). */}
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
