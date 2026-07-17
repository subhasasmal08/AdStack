"use client";

import React, { useState } from 'react';
import ProfileSync from '../settings/components/ProfileSync';

export default function ProfilePage() {
  const [user, setUser] = useState({
    c: "AdStack Labs",
    e: "jekin@adstack.io",
    ph: "+91 98765 43210"
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-[32px] font-bold text-foreground leading-none tracking-tight font-heading">Profile</h1>
        <p className="text-[13px] text-slate-500 font-medium mt-1.5 font-sans">
          Manage user details and sync status metadata.
        </p>
      </div>

      <div className="mt-4">
        <ProfileSync 
          user={user}
          onSave={setUser}
          onAddLog={(action) => console.log(action)}
        />
      </div>
    </div>
  );
}
