import { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps): JSX.Element {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-accent/10 via-accent/5 to-transparent" />
        <div className="absolute -left-24 top-24 h-64 w-64 animate-float rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -right-24 bottom-16 h-72 w-72 animate-float rounded-full bg-sky-200/30 blur-3xl" />
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">{children}</div>
    </main>
  );
}
