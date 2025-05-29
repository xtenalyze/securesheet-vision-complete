"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isSetupComplete, isLoading } = useAppContext();

  useEffect(() => {
    if (!isLoading) {
      if (isSetupComplete) {
        router.replace('/dashboard');
      } else {
        router.replace('/setup');
      }
    }
  }, [isSetupComplete, isLoading, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="ml-4 text-xl font-semibold text-foreground">Loading SecureSheet Vision...</p>
    </div>
  );
}
