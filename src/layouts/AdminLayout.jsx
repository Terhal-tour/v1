// src/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';


export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      

      {/* Content area */}
      <div className="flex flex-col flex-1">
        {/* Top navbar */}
        

        {/* Main content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
