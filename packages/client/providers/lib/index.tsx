"use client";

import { AuthProvider } from "./auth";
import { Toaster } from "./toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}
