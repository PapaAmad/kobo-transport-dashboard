import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface AppShellProps {
  children: ReactNode;
  theme?: "studio" | "executive";
}

export function AppShell({ children, theme = "studio" }: AppShellProps): JSX.Element {
  return (
    <main
      className={cn(
        "relative min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-300",
        theme === "executive" && "theme-exec"
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="dashboard-grid absolute inset-0 opacity-40" />
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-accent/12 via-accent/5 to-transparent" />
        <div className="absolute -left-28 top-20 h-72 w-72 animate-float rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute -right-24 top-10 h-72 w-72 animate-float rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute left-1/4 top-1/2 h-56 w-56 rounded-full bg-indigo-200/20 blur-3xl" />
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-6 lg:px-10 lg:py-10">
        {children}
      </div>
    </main>
  );
}
