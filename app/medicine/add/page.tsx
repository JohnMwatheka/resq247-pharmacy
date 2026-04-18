'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Save} from 'lucide-react';

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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AddMedicinePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    generic_name: '',
    brand_names: '',
    atc_code: '',
    ppb_registration: '',
    schedule: 'OTC',
    dosage_form: '',
    strength: '',
    unit_of_measure: 'Capsule',
    pack_sizes: '',
    storage_conditions: '',
    manufacturer: '',
    reorder_level: '',
    reorder_quantity: '',
    barcode_gtin: '',
    requires_prescription: false,
    controlled_substance: false,
    cold_chain_required: false,
    vat_exempt: true,
    is_active: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting Medicine Data:', formData);
    // TODO: Connect to your API here
    alert('Medicine added successfully! (Demo)');
    router.push('/medicine'); // Redirect back to Medicine list
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50">
        {/* Same Sidebar as Medicine Page */}
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
                      <SidebarMenuButton isActive={item.title === 'Medicine'} className="py-2 text-sm">
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

        {/* Main Content - Same Header Style */}
        <SidebarInset className="flex flex-col flex-1">
          <header className="h-14 bg-white border-b flex items-center px-6 justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <span className="text-xl">☀️</span>
                <h1 className="text-lg font-semibold">Hello, John Kamau!</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">JK</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
              {/* Back Button & Title */}
              <div className="flex items-center gap-4 mb-8">
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/medicine')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Medicine List
                </Button>
                <h2 className="text-3xl font-bold text-gray-900">Add New Medicine</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <Card>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="name">Medicine Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g. Amoxicillin 500mg Capsules"
                            required
                            className="mt-1.5"
                          />
                        </div>

                        <div>
                          <Label htmlFor="generic_name">Generic Name *</Label>
                          <Input
                            id="generic_name"
                            name="generic_name"
                            value={formData.generic_name}
                            onChange={handleInputChange}
                            placeholder="e.g. Amoxicillin Trihydrate"
                            required
                            className="mt-1.5"
                          />
                        </div>

                        <div>
                          <Label htmlFor="ppb_registration">PPB Registration Number</Label>
                          <Input
                            id="ppb_registration"
                            name="ppb_registration"
                            value={formData.ppb_registration}
                            onChange={handleInputChange}
                            placeholder="PPB/DRUG/2019/001234"
                            className="mt-1.5"
                          />
                        </div>

                        <div>
                          <Label htmlFor="manufacturer">Manufacturer</Label>
                          <Input
                            id="manufacturer"
                            name="manufacturer"
                            value={formData.manufacturer}
                            onChange={handleInputChange}
                            placeholder="e.g. Shelys Pharmaceuticals"
                            className="mt-1.5"
                          />
                        </div>
                      </div>

                      {/* Classification & Details */}
                      <div className="space-y-6">
                        <div>
                          <Label>Schedule</Label>
                          <Select value={formData.schedule} onValueChange={(value) => setFormData(prev => ({ ...prev, schedule: value }))}>
                            <SelectTrigger className="mt-1.5">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OTC">OTC</SelectItem>
                              <SelectItem value="Prescription">Prescription Only</SelectItem>
                              <SelectItem value="Controlled">Controlled Substance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="dosage_form">Dosage Form</Label>
                            <Input
                              id="dosage_form"
                              name="dosage_form"
                              value={formData.dosage_form}
                              onChange={handleInputChange}
                              placeholder="Capsule / Tablet"
                              className="mt-1.5"
                            />
                          </div>
                          <div>
                            <Label htmlFor="strength">Strength</Label>
                            <Input
                              id="strength"
                              name="strength"
                              value={formData.strength}
                              onChange={handleInputChange}
                              placeholder="500mg"
                              className="mt-1.5"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="pack_sizes">Pack Sizes (comma separated)</Label>
                          <Input
                            id="pack_sizes"
                            name="pack_sizes"
                            value={formData.pack_sizes}
                            onChange={handleInputChange}
                            placeholder="8, 21, 100, 500"
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Storage & Reorder */}
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="storage_conditions">Storage Conditions</Label>
                        <Textarea
                          id="storage_conditions"
                          name="storage_conditions"
                          value={formData.storage_conditions}
                          onChange={handleInputChange}
                          placeholder="Below 25°C, in a dry place"
                          className="mt-1.5 h-24"
                        />
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="reorder_level">Reorder Level</Label>
                            <Input
                              id="reorder_level"
                              name="reorder_level"
                              type="number"
                              value={formData.reorder_level}
                              onChange={handleInputChange}
                              placeholder="100"
                              className="mt-1.5"
                            />
                          </div>
                          <div>
                            <Label htmlFor="reorder_quantity">Reorder Quantity</Label>
                            <Input
                              id="reorder_quantity"
                              name="reorder_quantity"
                              type="number"
                              value={formData.reorder_quantity}
                              onChange={handleInputChange}
                              placeholder="500"
                              className="mt-1.5"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="barcode_gtin">Barcode (GTIN)</Label>
                          <Input
                            id="barcode_gtin"
                            name="barcode_gtin"
                            value={formData.barcode_gtin}
                            onChange={handleInputChange}
                            placeholder="6009705526025"
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Switches */}
                    <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="flex items-center justify-between">
                        <Label>Requires Prescription</Label>
                        <Switch
                          checked={formData.requires_prescription}
                          onCheckedChange={handleSwitchChange('requires_prescription')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Controlled Substance</Label>
                        <Switch
                          checked={formData.controlled_substance}
                          onCheckedChange={handleSwitchChange('controlled_substance')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Cold Chain Required</Label>
                        <Switch
                          checked={formData.cold_chain_required}
                          onCheckedChange={handleSwitchChange('cold_chain_required')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>VAT Exempt</Label>
                        <Switch
                          checked={formData.vat_exempt}
                          onCheckedChange={handleSwitchChange('vat_exempt')}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.push('/medicine')}
                    className="px-8"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 px-10 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Medicine
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}