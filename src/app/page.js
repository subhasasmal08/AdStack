"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // By default, redirect to login page
    router.replace('/login');
  }, [router]);

  return null;
}
