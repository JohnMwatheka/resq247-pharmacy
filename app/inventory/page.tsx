'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';        // ← Added this
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Search, Plus, Edit2, Trash2, AlertTriangle 
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
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Medicine {
  id: string;
  medicineName: string;
  supplierName: string;
  packing: string;
  genericName: string;
  expireDate: string;
  orderDate: string;
  stock: number;
  minStock: number;
}

const mockMedicines: Medicine[] = [
  {
    id: '1',
    medicineName: 'Cetirizine',
    supplierName: 'Square',
    packing: '50tab',
    genericName: 'Cetirizine',
    expireDate: 'Mar 23, 2026',
    orderDate: 'Feb 24, 2025',
    stock: 45,
    minStock: 100,
  },
  {
    id: '2',
    medicineName: 'Omeprazole',
    supplierName: 'Sorkar Drug',
    packing: '25tab',
    genericName: 'Omeprazole',
    expireDate: 'Apr 12, 2026',
    orderDate: 'Feb 25, 2025',
    stock: 120,
    minStock: 80,
  },
  {
    id: '3',
    medicineName: 'Atorvastatin',
    supplierName: 'Beximco',
    packing: '10tab',
    genericName: 'Atorvastatin',
    expireDate: 'Jun 17, 2026',
    orderDate: 'Feb 26, 2025',
    stock: 25,
    minStock: 60,
  },
  {
    id: '4',
    medicineName: 'Metformin',
    supplierName: 'Renata',
    packing: '30tab',
    genericName: 'Metformin',
    expireDate: 'Jul 10, 2026',
    orderDate: 'Feb 27, 2025',
    stock: 180,
    minStock: 100,
  },
];

export default function MedicinePage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();   // ← Added router

  useEffect(() => {
    setTimeout(() => {
      setMedicines(mockMedicines);
      setIsLoading(false);
    }, 700);
  }, []);

  const filteredMedicines = medicines.filter(item =>
    item.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Compact statistics
  const stats = [
    { title: 'Total Medicine', value: '36,759', change: '+16%' },
    { title: 'New Medicine', value: '12,453', change: '+0.9%' },
    { title: 'Today Selling', value: '18,657', change: '+15%' },
    { title: 'Total Order Today', value: '2,758', change: '+0.7%' },
  ];

  const isLowStock = (item: Medicine) => item.stock <= item.minStock;

  // Handle Add New Medicine Click
  const handleAddNewMedicine = () => {
    router.push('/medicine/add');     // ← Redirects to Add Medicine Page
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden bg-gray-50">
          {/* Sidebar - Compact */}
          <Sidebar className="border-r border-gray-200 w-60">
            <SidebarHeader className="border-b px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight">ResQ247</h1>
                  <p className="text-[10px] text-gray-500 -mt-0.5">PHARMACY</p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="px-2 py-5">
              <SidebarGroup>
                <SidebarGroupLabel className="px-3 text-[10px] tracking-widest text-gray-500 mb-3">MENU</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {[
                      { title: 'Dashboard' },
                      { title: 'Purchase' },
                      { title: 'Sale' },
                      { title: 'Product' },
                      { title: 'Suppliers' },
                    ].map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton isActive={item.title === 'Product'} className="py-2 text-sm">
                          <Package className="w-4 h-4 mr-3" />
                          {item.title}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup className="mt-7">
                <SidebarGroupLabel className="px-3 text-[10px] tracking-widest text-gray-500 mb-3">OTHERS</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {[
                      { title: 'Customer' },
                      { title: 'Medicine', active: true },
                      { title: 'Invoice' },
                      { title: 'Orders' },
                    ].map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton isActive={item.active} className="py-2 text-sm">
                          <Package className="w-4 h-4 mr-3" />
                          {item.title}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-medium">JK</AvatarFallback>
                </Avatar>
                <div className="text-xs">
                  <p className="font-medium">John Kamau</p>
                  <p className="text-gray-500">john@resq247.co.ke</p>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          {/* Main Content */}
          <SidebarInset className="flex flex-col flex-1">
            {/* Compact Header */}
            <header className="h-14 bg-white border-b flex items-center px-6 justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div className="flex items-center gap-2">
                  <span className="text-xl">☀️</span>
                  <h1 className="text-lg font-semibold">Hello, John Kamau!</h1>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-72">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search anything"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-9 text-sm bg-gray-50 border-gray-200 rounded-full"
                  />
                </div>

                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">JK</AvatarFallback>
                </Avatar>
              </div>
            </header>

            <main className="flex-1 p-5 overflow-auto">
              <div className="max-w-6xl mx-auto">
                {/* Title & Add Button */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Medicine</h2>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Pharmacy purchase refers to buying medications and supplies.
                    </p>
                  </div>
                  
                  {/* Updated Add Button with onClick */}
                  <Button 
                    onClick={handleAddNewMedicine}
                    className="bg-blue-600 hover:bg-blue-700 h-9 px-5 text-sm rounded-xl flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Medicine
                  </Button>
                </div>

                {/* Compact Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {stats.map((stat, index) => (
                    <Card key={index} className="border border-gray-200 shadow-sm">
                      <CardContent className="p-4">
                        <p className="text-xs text-gray-500">{stat.title}</p>
                        <p className="text-2xl font-semibold tracking-tight mt-1">{stat.value}</p>
                        <p className="text-xs text-emerald-600 mt-2">{stat.change} since last month</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Compact Medicine Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left py-3 px-5 text-xs font-medium text-gray-500">Medicine Name</th>
                          <th className="text-left py-3 px-5 text-xs font-medium text-gray-500">Supplier</th>
                          <th className="text-left py-3 px-5 text-xs font-medium text-gray-500">Packing</th>
                          <th className="text-left py-3 px-5 text-xs font-medium text-gray-500">Generic Name</th>
                          <th className="text-left py-3 px-5 text-xs font-medium text-gray-500">Expire Date</th>
                          <th className="text-left py-3 px-5 text-xs font-medium text-gray-500">Order Date</th>
                          <th className="text-center py-3 px-5 text-xs font-medium text-gray-500">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                              <tr key={i} className="border-b">
                                <td colSpan={7} className="p-6">
                                  <div className="h-5 bg-gray-100 rounded animate-pulse" />
                                </td>
                              </tr>
                            ))
                          ) : filteredMedicines.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-12 text-center text-gray-500 text-sm">
                                No medicines found
                              </td>
                            </tr>
                          ) : (
                            filteredMedicines.map((item, index) => {
                              const lowStock = isLowStock(item);
                              return (
                                <motion.tr
                                  key={item.id}
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.02 }}
                                  className={`border-b hover:bg-gray-50 transition-colors ${lowStock ? 'bg-red-50/70' : ''}`}
                                >
                                  <td className="py-4 px-5 font-medium flex items-center gap-2">
                                    {item.medicineName}
                                    {lowStock && (
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <AlertTriangle className="w-4 h-4 text-red-600" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Low Stock Alert: Only {item.stock} left (Min: {item.minStock})</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    )}
                                  </td>
                                  <td className="py-4 px-5 text-gray-600">{item.supplierName}</td>
                                  <td className="py-4 px-5 text-gray-600">{item.packing}</td>
                                  <td className="py-4 px-5 text-gray-600">{item.genericName}</td>
                                  <td className="py-4 px-5 text-gray-600">{item.expireDate}</td>
                                  <td className="py-4 px-5 text-gray-600">{item.orderDate}</td>
                                  <td className="py-4 px-5">
                                    <div className="flex justify-center gap-1">
                                      <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <Edit2 className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600 hover:text-red-700">
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
                  Showing {filteredMedicines.length} of {medicines.length} medicines
                </p>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}