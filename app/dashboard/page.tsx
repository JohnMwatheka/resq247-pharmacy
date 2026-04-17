/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/set-state-in-effect */
//app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  LogOut,
  ShoppingCart,
  Package,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

export default function PharmacistDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/login');
    }
    setTimeout(() => setIsLoading(false), 800);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const mainNavItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', active: true },
    { title: 'POS', icon: ShoppingCart, href: '/pos' },
    { title: 'Inventory', icon: Package, href: '/inventory' },
    { title: 'Orders', icon: ClipboardList, href: '/orders' },
    { title: 'Customers', icon: Users, href: '/customers' },
    { title: 'Reports', icon: BarChart3, href: '/reports' },
  ];

  const secondaryNavItems = [
    { title: 'Profile', icon: User, href: '/profile' },
    { title: 'Documents', icon: FileText, href: '/documents' },
    { title: 'License & PPB', icon: ShieldCheck, href: '/license' },
    { title: 'Schedule', icon: Calendar, href: '/schedule' },
    { title: 'Settings', icon: Settings, href: '/settings' },
  ];

  // Proper ShadCN Skeleton Loading Component
  const DashboardSkeleton = () => (
    <div className="space-y-8">
      {/* Welcome Section Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Status Banner Skeleton */}
      <Skeleton className="h-32 w-full rounded-2xl" />

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
            <Skeleton className="h-5 w-5 mb-4" />
            <Skeleton className="h-8 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Recent Activity Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50/50">
        {/* Sidebar */}
        <Sidebar className="border-r border-gray-200/60">
          <SidebarHeader className="border-b border-gray-200/60 px-5 py-6">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-9 h-9 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">ResQ247</h1>
                <p className="text-[9px] text-gray-500 -mt-0.5 tracking-wider">PHARMACY</p>
              </div>
            </motion.div>
          </SidebarHeader>

          <SidebarContent className="px-2 py-4">
            {/* Main Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 text-[10px] tracking-wider text-gray-400 mb-2">
                MAIN
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNavItems.map((item, index) => (
                    <SidebarMenuItem key={item.title}>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04 }}
                      >
                        <SidebarMenuButton 
                          asChild 
                          isActive={item.active}
                          className="py-2.5 px-3 rounded-xl text-sm hover:bg-gray-100/80 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700"
                        >
                          <Link href={item.href} className="flex items-center gap-2.5">
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </motion.div>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Secondary Navigation */}
            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="px-3 text-[10px] tracking-wider text-gray-400 mb-2">
                ACCOUNT
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {secondaryNavItems.map((item, index) => (
                    <SidebarMenuItem key={item.title}>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.04 }}
                      >
                        <SidebarMenuButton 
                          asChild
                          className="py-2.5 px-3 rounded-xl text-sm hover:bg-gray-100/80"
                        >
                          <Link href={item.href} className="flex items-center gap-2.5">
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </motion.div>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200/60 p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start h-auto p-2.5 rounded-xl hover:bg-gray-100/80">
                  <Avatar className="mr-2.5 h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-medium">
                      {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'PH'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left text-xs">
                    <p className="font-medium truncate">{user?.fullName}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl">
                <DropdownMenuLabel className="text-xs">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="text-sm"><Link href="/profile">Profile Settings</Link></DropdownMenuItem>
                <DropdownMenuItem className="text-sm">Help & Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 text-sm">
                  <LogOut className="mr-2 h-3.5 w-3.5" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex flex-col flex-1">
          {/* Top Navigation - Softer, no sharp lines */}
          <header className="h-14 bg-white/60 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-50 border-b border-gray-200/40">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover:bg-gray-100/60 p-2 rounded-lg transition-colors" />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input 
                  placeholder="Search..." 
                  className="w-64 h-9 pl-9 text-sm bg-gray-50/50 border-gray-200/60 rounded-lg focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-gray-100/60">
                <Bell className="h-4 w-4 text-gray-500" />
              </Button>
              <div className="text-xs text-gray-500 font-medium px-3 py-1.5 bg-gray-100/50 rounded-lg">
                {new Date().toLocaleDateString('en-GB', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-5xl mx-auto">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <DashboardSkeleton />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    {/* Welcome */}
                    <div className="mb-8">
                      <h1 className="text-2xl font-medium tracking-tight text-gray-900">
                        Welcome back, {user?.fullName?.split(' ')[0]}
                      </h1>
                      <p className="text-gray-500 mt-0.5 text-sm">Your pharmacy dashboard is ready</p>
                    </div>

                    {/* Status Banner - More compact */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15, duration: 0.5 }}
                      className=" text-blue-600 rounded-2xl p-6 flex items-center gap-5 mb-8"
                    >
                      <ShieldCheck className="w-10 h-10 shrink-0 opacity-90" />
                      <div>
                        <p className="uppercase text-emerald-100 text-[10px] tracking-wider font-medium">License Status</p>
                        <p className="text-xl font-semibold">APPROVED</p>
                        <p className="text-xs opacity-90 mt-0.5">PPB License valid until March 2027</p>
                      </div>
                    </motion.div>

                    {/* Stats Grid - Smaller, cleaner cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                      {[
                        { label: "Inventory Items", value: "1,234", icon: Package },
                        { label: "Orders Today", value: "28", icon: ShoppingCart },
                        { label: "Low Stock", value: "12", icon: Bell },
                        { label: "Revenue", value: "KES 45K", icon: BarChart3 },
                      ].map((stat, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ y: -2, transition: { duration: 0.2 } }}
                          transition={{ delay: 0.3 + index * 0.08, duration: 0.5 }}
                          className="bg-white rounded-xl p-4 border border-gray-200/60 hover:border-gray-300/80 transition-all duration-200"
                        >
                          <stat.icon className="w-4 h-4 text-gray-400 mb-3" />
                          <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl border border-gray-200/60 p-5">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Recent Activity</h3>
                      <div className="space-y-3">
                        {[
                          { action: "Order #1234 completed", time: "5 min ago", icon: ShoppingCart },
                          { action: "Inventory updated: Paracetamol", time: "1 hour ago", icon: Package },
                          { action: "New customer registered", time: "3 hours ago", icon: Users },
                        ].map((activity, i) => (
                          <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                              <activity.icon className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-700">{activity.action}</p>
                              <p className="text-xs text-gray-400">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}