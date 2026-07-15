"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/src/lib/store/store";
import { Toaster } from "@/src/components/ui/sonner";
import { useState, ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </ReduxProvider>
  );
}
