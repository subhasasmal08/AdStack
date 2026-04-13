import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#020617] text-white selection:bg-[#5C59E8]/30">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
