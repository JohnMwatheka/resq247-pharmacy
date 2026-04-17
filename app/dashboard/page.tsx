'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  User, 
  Calendar, 
  FileText, 
  Clock, 
  ShieldCheck, 
  LogOut 
} from 'lucide-react';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

export default function PharmacistDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage (you can replace this with proper auth context later)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Please log in to access the dashboard</p>
          <Link href="/login" className="text-blue-600 hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <div>
              <h1 className="font-semibold text-xl">ResQ247 Pharmacy</h1>
              <p className="text-xs text-gray-500 -mt-1">Pharmacist Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium text-sm">{user.fullName}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <User size={20} />
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors px-4 py-2 rounded-xl hover:bg-gray-100"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.fullName.split(' ')[0]} 👋
          </h2>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your pharmacist account today.
          </p>
        </div>

        {/* Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 mb-10 border border-green-100 bg-gradient-to-r from-green-50 to-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="text-green-600" size={32} />
            </div>
            <div>
              <p className="text-green-700 font-semibold text-lg">Account Status</p>
              <p className="text-2xl font-bold text-green-800">APPROVED</p>
              <p className="text-sm text-green-600 mt-1">Your pharmacist license is active</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { 
              title: "License Expiry", 
              value: "12 Mar 2027", 
              icon: Calendar, 
              color: "blue" 
            },
            { 
              title: "Years Experience", 
              value: "7", 
              icon: Clock, 
              color: "amber" 
            },
            { 
              title: "Documents", 
              value: "8 Uploaded", 
              icon: FileText, 
              color: "purple" 
            },
            { 
              title: "PPB Reg No.", 
              value: "PPB/2020/XXXX", 
              icon: ShieldCheck, 
              color: "emerald" 
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon className={`text-${stat.color}-600`} size={26} />
              </div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-3xl font-semibold mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h3 className="font-semibold text-xl mb-6">Quick Actions</h3>
            
            <div className="space-y-4">
              <Link href="/profile" className="block p-5 border border-gray-200 hover:border-blue-300 rounded-2xl transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Update Profile</p>
                    <p className="text-sm text-gray-500">Edit personal & professional details</p>
                  </div>
                  <div className="text-blue-600 group-hover:translate-x-1 transition-transform">→</div>
                </div>
              </Link>

              <Link href="/documents" className="block p-5 border border-gray-200 hover:border-blue-300 rounded-2xl transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Manage Documents</p>
                    <p className="text-sm text-gray-500">View or upload supporting documents</p>
                  </div>
                  <div className="text-blue-600 group-hover:translate-x-1 transition-transform">→</div>
                </div>
              </Link>

              <Link href="/license" className="block p-5 border border-gray-200 hover:border-blue-300 rounded-2xl transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">License Status</p>
                    <p className="text-sm text-gray-500">Check PPB license & expiry</p>
                  </div>
                  <div className="text-blue-600 group-hover:translate-x-1 transition-transform">→</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h3 className="font-semibold text-xl mb-6">Recent Activity</h3>
            
            <div className="space-y-6">
              {[
                { time: "2 days ago", action: "Profile updated", detail: "Changed phone number" },
                { time: "1 week ago", action: "Document uploaded", detail: "Bachelor of Pharmacy Certificate" },
                { time: "3 weeks ago", action: "Account verified", detail: "Approved by PPB Admin" },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.detail}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link href="/activity" className="text-blue-600 text-sm font-medium hover:underline">
                View full activity log →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}