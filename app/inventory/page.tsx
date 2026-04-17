'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Search, 
  Plus, 
  Filter, 
  Edit2, 
  Trash2, 
  AlertTriangle 
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
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  expiryDate: string;
  lastUpdated: string;
}

const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Paracetamol 500mg', category: 'Analgesics', stock: 1240, minStock: 200, price: 45, expiryDate: '2027-06-15', lastUpdated: '2 hours ago' },
  { id: '2', name: 'Amoxicillin 250mg', category: 'Antibiotics', stock: 85, minStock: 150, price: 120, expiryDate: '2026-11-20', lastUpdated: 'Yesterday' },
  { id: '3', name: 'Cetirizine 10mg', category: 'Antihistamines', stock: 450, minStock: 100, price: 65, expiryDate: '2027-03-10', lastUpdated: '3 days ago' },
  { id: '4', name: 'Omeprazole 20mg', category: 'Gastro', stock: 320, minStock: 80, price: 85, expiryDate: '2026-09-05', lastUpdated: '1 week ago' },
  { id: '5', name: 'Metformin 500mg', category: 'Diabetes', stock: 12, minStock: 50, price: 95, expiryDate: '2026-08-30', lastUpdated: '2 days ago' },
];

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterLowStock, setFilterLowStock] = useState(false);

  // Simulate data loading
  useEffect(() => {
    setTimeout(() => {
      setInventory(mockInventory);
      setIsLoading(false);
    }, 900);
  }, []);

  const filteredInventory = inventory
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(item => !filterLowStock || item.stock <= item.minStock);

  const lowStockCount = inventory.filter(item => item.stock <= item.minStock).length;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50/50">
        {/* Sidebar - Same as Dashboard */}
        <Sidebar className="border-r border-gray-200/60">
          <SidebarHeader className="border-b border-gray-200/60 px-5 py-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">ResQ247</h1>
                <p className="text-[9px] text-gray-500 -mt-0.5 tracking-wider">PHARMACY</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 text-[10px] tracking-wider text-gray-400 mb-2">MAIN</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {[
                    { title: 'Dashboard', icon: Package, href: '/dashboard' },
                    { title: 'POS', icon: Package, href: '/pos' }, // Replace with correct icons later
                    { title: 'Inventory', icon: Package, href: '/inventory', active: true },
                    { title: 'Orders', icon: Package, href: '/orders' },
                  ].map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={item.active}>
                        <a href={item.href} className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-sm">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200/60 p-3">
            {/* User dropdown same as dashboard */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start h-auto p-2.5 rounded-xl hover:bg-gray-100/80">
                  <Avatar className="mr-2.5 h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-medium">PH</AvatarFallback>
                  </Avatar>
                  <div className="text-left text-xs">
                    <p className="font-medium truncate">John Kamau</p>
                    <p className="text-[10px] text-gray-500 truncate">john@resq247.co.ke</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl">
                <DropdownMenuLabel className="text-xs">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><a href="/profile">Profile Settings</a></DropdownMenuItem>
                <DropdownMenuItem>Help & Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex flex-col flex-1">
          <header className="h-14 bg-white/60 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-50 border-b border-gray-200/40">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover:bg-gray-100/60 p-2 rounded-lg" />
              <h2 className="text-lg font-semibold text-gray-900">Inventory Management</h2>
            </div>

            <div className="flex items-center gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-sm h-9 px-5 rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add New Item
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-6xl mx-auto">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search medicines..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 bg-white border-gray-200 rounded-xl"
                  />
                </div>

                <Button 
                  variant={filterLowStock ? "default" : "outline"}
                  onClick={() => setFilterLowStock(!filterLowStock)}
                  className="h-10 px-5 rounded-xl flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Low Stock Only {lowStockCount > 0 && `(${lowStockCount})`}
                </Button>
              </div>

              {/* Inventory Table */}
              <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left py-4 px-6 text-xs font-medium text-gray-500">MEDICINE</th>
                        <th className="text-left py-4 px-6 text-xs font-medium text-gray-500">CATEGORY</th>
                        <th className="text-right py-4 px-6 text-xs font-medium text-gray-500">STOCK</th>
                        <th className="text-right py-4 px-6 text-xs font-medium text-gray-500">MIN STOCK</th>
                        <th className="text-right py-4 px-6 text-xs font-medium text-gray-500">PRICE (KES)</th>
                        <th className="text-left py-4 px-6 text-xs font-medium text-gray-500">EXPIRY</th>
                        <th className="text-center py-4 px-6 text-xs font-medium text-gray-500">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {isLoading ? (
                          [...Array(5)].map((_, i) => (
                            <tr key={i} className="border-b">
                              <td colSpan={7} className="p-6"><Skeleton className="h-8 w-full" /></td>
                            </tr>
                          ))
                        ) : filteredInventory.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-12 text-gray-500">
                              No items found
                            </td>
                          </tr>
                        ) : (
                          filteredInventory.map((item, index) => {
                            const isLowStock = item.stock <= item.minStock;
                            return (
                              <motion.tr 
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="border-b hover:bg-gray-50 transition-colors"
                              >
                                <td className="py-4 px-6 font-medium">{item.name}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{item.category}</td>
                                <td className="py-4 px-6 text-right">
                                  <span className={`${isLowStock ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                    {item.stock.toLocaleString()}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-right text-sm text-gray-500">{item.minStock}</td>
                                <td className="py-4 px-6 text-right font-medium">KES {item.price}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{item.expiryDate}</td>
                                <td className="py-4 px-6">
                                  <div className="flex justify-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Edit2 className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </td>
                              </motion.tr>
                            );
                          })
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-center text-xs text-gray-400 mt-6">
                Showing {filteredInventory.length} of {inventory.length} items
              </p>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}