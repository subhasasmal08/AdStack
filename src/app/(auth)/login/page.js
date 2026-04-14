"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import AuthCard from '@/components/auth/AuthCard';
import InputField from '@/components/auth/InputField';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    toast.success('Successfully signed in!');
    router.push('/chatbot'); // Redirect to dashboard
  };

  return (
    <AuthCard>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-primary">AdStack</h1>
          <p className="text-muted-foreground">Sign in to manage your ad inventory and analytics.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="space-y-2">
            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-end">
              <Link 
                href="/forgot-password" 
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(92,89,232,0.3)] transition-all hover:shadow-[0_0_25px_rgba(92,89,232,0.5)] active:scale-[0.98]"
          >
            Sign In
          </Button>
        </form>

        <div className="pt-4 text-center">
          <p className="text-muted-foreground">
            No account?{' '}
            <Link 
              href="/signup" 
              className="text-primary font-semibold hover:underline decoration-2 underline-offset-4"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </AuthCard>
  );
}
