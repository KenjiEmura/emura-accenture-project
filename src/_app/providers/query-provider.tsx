"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// The YUMEMI data is a static snapshot, so within a browser session a
// fetched result never goes stale — checked prefectures are never refetched.
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

// Official TanStack Query SSR pattern: a fresh client per server render,
// a module-level singleton in the browser (React state could be discarded
// if the tree suspends before hydration finishes).
let browserQueryClient: QueryClient | undefined;

const getQueryClient = () => {
  if (typeof window === "undefined") {
    return createQueryClient();
  }
  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
};

export const QueryProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
