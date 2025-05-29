import type { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';

export default function SetupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <ShieldCheck className="mb-4 h-16 w-16 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          SecureSheet Vision Setup
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Configure your security incident management system.
        </p>
      </div>
      <div className="w-full max-w-2xl rounded-lg border bg-card p-6 shadow-lg sm:p-8">
        {children}
      </div>
    </div>
  );
}
