"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import AuthCard from '@/components/auth/AuthCard';
import InputField from '@/components/auth/InputField';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { axiosapiinstance } from '@/lib/request';
import { ENDPOINTS } from '@/lib/endpoints';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      await axiosapiinstance.post(ENDPOINTS.AUTH.PASSWORD_RECOVERY, { email });
      toast.success('Reset link sent to your email!');
      setIsSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.detail || "Failed to send reset link");
    }
  };

  if (isSent) {
    return (
      <AuthCard>
        <div className="space-y-8 text-center py-4">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-primary">AdStack</h1>
            
            <div className="pt-4 space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Check your inbox</h2>
              <p className="text-muted-foreground">
                Reset link sent to <br />
                <span className="text-foreground font-medium">{email}</span>
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Link 
              href="/login" 
              className="text-primary font-semibold hover:underline decoration-2 underline-offset-4"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold tracking-tight text-primary">AdStack</h2>
          <p className="text-muted-foreground">Enter email for a reset link.</p>
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

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(92,89,232,0.3)] transition-all hover:shadow-[0_0_25px_rgba(92,89,232,0.5)] active:scale-[0.98]"
          >
            Send Reset Link
          </Button>
        </form>

        <div className="pt-2 text-center">
          <Link 
            href="/login" 
            className="text-primary font-semibold hover:underline decoration-2 underline-offset-4"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
