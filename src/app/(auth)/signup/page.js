"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import AuthCard from '@/components/auth/AuthCard';
import InputField from '@/components/auth/InputField';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    companyAge: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validatePhone = (phone) => {
    return phone.match(/^\+?[1-9]\d{1,14}$/);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.companyName) {
      toast.error('Company Name is required');
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    toast.success('Account created successfully! Please sign in.');
    router.push('/login');
  };

  return (
    <AuthCard className="max-w-[560px]">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-primary">AdStack</h1>
          <p className="text-muted-foreground">Create your account to optimize ad revenue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            id="companyName"
            label="Company Name"
            placeholder="Acme Studios"
            value={formData.companyName}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="companyAge"
              label="Company Age"
              placeholder="Years"
              value={formData.companyAge}
              onChange={handleChange}
              required
            />
            <InputField
              id="phone"
              label="Phone (Optional)"
              placeholder="+91..."
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <InputField
              id="confirmPassword"
              label="Confirm"
              type="password"
              placeholder="Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(92,89,232,0.3)] mt-2 transition-all hover:shadow-[0_0_25px_rgba(92,89,232,0.5)] active:scale-[0.98]"
          >
            Create Account
          </Button>
        </form>

        <div className="pt-2 text-center">
          <p className="text-muted-foreground">
            Have an account?{' '}
            <Link 
              href="/login" 
              className="text-primary font-semibold hover:underline decoration-2 underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthCard>
  );
}
