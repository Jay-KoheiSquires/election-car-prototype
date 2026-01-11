/**
 * Next.js Appコンポーネント
 * グローバルプロバイダーとエラーハンドリングを設定
 */
"use client";

import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import ErrorBoundary from "../component/atoms/ErrorBoundary";

function MyApp({ Component, pageProps }: AppProps) {
  // React Query v5: QueryClientをuseState内で作成
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
