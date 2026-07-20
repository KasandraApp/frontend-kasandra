import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 md:flex-row flex-col">
      <Sidebar />

      <div className="flex-1">{children}</div>
    </div>
  );
}
