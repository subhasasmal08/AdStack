"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import AuthCard from '@/components/auth/AuthCard';
import InputField from '@/components/auth/InputField';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { axiosapiinstance } from '@/lib/request';
import { ENDPOINTS } from '@/lib/endpoints';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    address: '',
    founded_date: '',
    company_age_years: '',
    profile_summary: ''
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

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 6;
    const hasCapital = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasMinLength && hasCapital && hasNumber && hasSpecial;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.company_name) {
      toast.error('Company Name is required');
      return;
    }

    if (!formData.email || !validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!formData.password || !validatePassword(formData.password)) {
      toast.error('Password must be at least 6 characters long and include one capital letter, one number, and one special character.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.phone_number && !validatePhone(formData.phone_number)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    try {
      const payload = {
        company_name: formData.company_name,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number || "",
        address: formData.address || "",
        founded_date: formData.founded_date || new Date().toISOString().split('T')[0],
        company_age_years: parseInt(formData.company_age_years) || 0,
        profile_summary: formData.profile_summary || ""
      };

      await axiosapiinstance.post(ENDPOINTS.PUBLISHERS.REGISTER, payload);
      
      toast.success('Account created successfully! Please sign in.');
      router.push('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <AuthCard className="max-w-[700px]">
      <div className="space-y-6 max-h-[85vh] overflow-y-auto px-2 pb-4 scrollbar-hide">
        <div className="space-y-2 sticky top-0 bg-sidebar pt-2 z-10 pb-4 border-b border-border-sidebar">
          <h1 className="text-4xl font-bold tracking-tight text-primary">AdStack</h1>
          <p className="text-muted-foreground">Create your account to optimize ad revenue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="company_name"
              label="Company Name *"
              placeholder="Acme Studios"
              value={formData.company_name}
              onChange={handleChange}
              required
            />
            <InputField
              id="email"
              label="Email *"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="password"
              label="Password *"
              type="password"
              placeholder="Min 6 chars, 1 capital, 1 num, 1 special"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <InputField
              id="confirmPassword"
              label="Confirm Password *"
              type="password"
              placeholder="Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="phone_number"
              label="Phone (Optional)"
              placeholder="+91..."
              value={formData.phone_number}
              onChange={handleChange}
            />
            <InputField
              id="founded_date"
              label="Founded Date (Optional)"
              type="date"
              value={formData.founded_date}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="company_age_years"
              label="Company Age (Optional)"
              type="number"
              placeholder="Years"
              value={formData.company_age_years}
              onChange={handleChange}
            />
            <InputField
              id="address"
              label="Address (Optional)"
              placeholder="123 Street Name, City"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <InputField
            id="profile_summary"
            label="Profile Summary (Optional)"
            placeholder="Tell us about your company..."
            value={formData.profile_summary}
            onChange={handleChange}
          />

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(92,89,232,0.3)] mt-2 transition-all hover:shadow-[0_0_25px_rgba(92,89,232,0.5)] active:scale-[0.98]"
          >
            Create Account
          </Button>
        </form>

        <div className="pt-2 text-center pb-4">
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
