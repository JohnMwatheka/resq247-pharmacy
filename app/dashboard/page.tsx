
// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { 
  TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, 
   Package,  Bell, CheckCircle, XCircle 
} from 'lucide-react';

import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  TooltipProvider,
} from '@/components/ui/tooltip';

export default function SuperAdminDashboard() {
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data load
    setTimeout(() => setIsLoading(false), 900);
  }, []);

  // KPI Strip Data
  const kpiStrip = [
    { label: "Today's Revenue", value: "KES 248,750", change: "+12.4%", trend: "up", breakdown: "Cash: 62% | Insurance: 31% | Credit: 7%" },
    { label: "Transactions Today", value: "184", change: "+8%", trend: "up", breakdown: "Prescriptions: 97 | OTC: 72 | Controlled: 15 ⚠️" },
    { label: "Low Stock Items", value: "23", change: "-5", trend: "down", breakdown: "Near Expiry: 9" },
    { label: "Compliance Score", value: "94%", change: "+2%", trend: "up", breakdown: "PPB License: Valid" },
  ];

  // Mock Data for Sections
  const complianceAlerts = [
    { type: "PPB License", status: "Valid until 12 Mar 2027", color: "text-emerald-600", icon: CheckCircle },
    { type: "Superintendent Pharmacist", status: "Active", color: "text-emerald-600", icon: CheckCircle },
    { type: "Controlled Drugs Today", status: "15 dispensed", color: "text-amber-600", icon: AlertTriangle },
    { type: "Audit Issues", status: "2 Open", color: "text-red-600", icon: XCircle },
  ];

  const inventoryHealth = [
    { label: "Low Stock Items", count: 23, risk: "Medium" },
    { label: "Near Expiry (30 days)", count: 9, risk: "High", value: "KES 87,450" },
    { label: "Stock-out Risk", count: "4%", risk: "Low" },
  ];

  const quickActions = [
    "Enable Regulator Inspection Mode",
    "Generate PPB Audit Report",
    "Auto-generate Reorder List",
    "Broadcast System Notice",
  ];

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden bg-gray-50">
          {/* Sidebar - Super Admin Style */}
          <Sidebar className="border-r border-gray-200 w-64">
            <SidebarHeader className="px-6 py-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">R</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">ResQ247</h1>
                  <p className="text-xs text-gray-500">PHARMACY • SUPER ADMIN</p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="px-3 py-6">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs text-gray-500 mb-3">MAIN</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {['Dashboard', 'POS', 'Inventory', 'Orders', 'Reports'].map((title) => (
                      <SidebarMenuItem key={title}>
                        <SidebarMenuButton isActive={title === 'Dashboard'}>
                          <Package className="w-4 h-4 mr-3" />
                          {title}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup className="mt-8">
                <SidebarGroupLabel className="text-xs text-gray-500 mb-3">OVERSIGHT</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {['Compliance', 'Staff Activity', 'Branches', 'Audit Logs'].map((title) => (
                      <SidebarMenuItem key={title}>
                        <SidebarMenuButton>{title}</SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">SA</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">Super Admin</p>
                  <p className="text-xs text-gray-500">Head Office • Nairobi</p>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          {/* Main Content */}
          <SidebarInset className="flex flex-col flex-1">
            {/* Top Header */}
            <header className="h-14 bg-white border-b flex items-center px-6 justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold">Super Admin Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="text-xs">
                  <Bell className="w-4 h-4 mr-2" /> Alerts (3)
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-sm h-9 px-5">
                  Generate PPB Report
                </Button>
              </div>
            </header>

            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-7xl mx-auto space-y-8">

                {/* 1. KPI STRIP - Always Visible */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {kpiStrip.map((kpi, i) => (
                    <Card key={i} className="border border-gray-200">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs text-gray-500">{kpi.label}</p>
                            <p className="text-3xl font-semibold tracking-tight mt-1">{kpi.value}</p>
                          </div>
                          <div className={`flex items-center gap-1 text-sm ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            {kpi.change}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">{kpi.breakdown}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* 2. Compliance & Risk + Revenue Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Compliance & Risk Panel */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ShieldCheck className="w-5 h-5" /> Compliance & Risk
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {complianceAlerts.map((alert, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <alert.icon className={`w-5 h-5 ${alert.color}`} />
                            <div>
                              <p className="font-medium">{alert.type}</p>
                              <p className="text-sm text-gray-600">{alert.status}</p>
                            </div>
                          </div>
                          <Badge variant={alert.color.includes('red') ? 'destructive' : 'secondary'}>
                            View Log
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Revenue & Claims Snapshot */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Revenue & Claims Snapshot</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border">
                          <p className="text-sm text-gray-500">Claims Submitted</p>
                          <p className="text-3xl font-semibold mt-2">42</p>
                          <p className="text-xs text-emerald-600 mt-1">38 Approved • 4 Rejected</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border">
                          <p className="text-sm text-gray-500">Outstanding</p>
                          <p className="text-3xl font-semibold mt-2 text-amber-600">KES 67,890</p>
                        </div>
                      </div>
                      <div className="mt-6 text-xs text-gray-500">
                        Average Margin: <span className="font-medium text-emerald-600">31.4%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 3. Inventory Command Center */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" /> Inventory Intelligence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {inventoryHealth.map((item, i) => (
                        <div key={i} className="p-5 bg-gray-50 rounded-2xl">
                          <p className="text-sm text-gray-600">{item.label}</p>
                          <p className="text-4xl font-semibold mt-3">{item.count}</p>
                          {item.value && <p className="text-sm text-gray-500 mt-1">Value at risk: {item.value}</p>}
                          <Badge className="mt-4" variant={item.risk === 'High' ? 'destructive' : 'secondary'}>
                            {item.risk} Risk
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-6">
                      {quickActions.slice(0, 2).map((action, i) => (
                        <Button key={i} variant="outline" className="flex-1 text-sm">
                          {action}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 4. Clinical Oversight + Staff Monitor */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle>Clinical & Dispensing Oversight</CardTitle></CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span>Prescriptions Dispensed Today</span>
                        <span className="font-medium">97</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Generic Substitution Rate</span>
                        <span className="font-medium text-emerald-600">68%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Drug Interaction Alerts</span>
                        <span className="font-medium text-amber-600">3</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Staff & Operations Monitor</CardTitle></CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span>Active Pharmacists Logged In</span>
                        <span className="font-medium">7 / 9</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Dispensing per Pharmacist</span>
                        <span className="font-medium">14</span>
                      </div>
                      <div className="text-amber-600 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> 2 price overrides today
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 5. Alerts & Audit Readiness */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Alerts & Audit Readiness
                      <Button variant="outline" size="sm">View Full History</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { color: "bg-red-100 text-red-700", text: "🔴 2 Open Audit Findings" },
                        { color: "bg-amber-100 text-amber-700", text: "🟠 Near Expiry Alert (9 items)" },
                        { color: "bg-blue-100 text-blue-700", text: "🔵 System Sync: Online" },
                      ].map((alert, i) => (
                        <div key={i} className={`px-5 py-3 rounded-2xl text-sm font-medium ${alert.color}`}>
                          {alert.text}
                        </div>
                      ))}
                    </div>
                    <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700">
                      Generate Full PPB Compliance Report (PDF)
                    </Button>
                  </CardContent>
                </Card>

              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}