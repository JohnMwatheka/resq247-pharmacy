/* eslint-disable @typescript-eslint/no-explicit-any */
// app/register/pharmacy/page.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, ArrowLeft } from 'lucide-react';
import PharmacistRegistration, { PharmacistFormData } from './components/PharmacistRegistration';
import PharmacyFacilityRegistration, { PharmacyFacilityFormData } from './components/PharmacyFacilityRegistration';
import Image from 'next/image';

export default function PharmacyRegistrationPage() {
  const [registrationType, setRegistrationType] = useState<'pharmacist' | 'pharmacy' | null>(null);

  const handlePharmacistSubmit = async (
    data: PharmacistFormData,
    passportPhoto: any | null,
    uploadedDocuments: any[]
  ) => {
    console.log('Pharmacist Registration Submitted:', { data, passportPhoto, uploadedDocuments });
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Registration submitted successfully! Awaiting admin verification.');
  };

  const handlePharmacySubmit = async (
    data: PharmacyFacilityFormData,
    documents: any[]
  ) => {
    console.log('Pharmacy Facility Registration Submitted:', { data, documents });
    await new Promise(resolve => setTimeout(resolve, 1800));
    alert('Pharmacy Facility registration submitted successfully! Awaiting admin verification.');
  };

  // Selection Screen
  if (!registrationType) {
    return (
      <main className="flex items-center justify-center min-h-screen p-4 bg-linear-to-br from-white to-white">
        <div className="w-full max-w-6xl">
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden min-h-155">
            
            {/* Left Side - Logo & Branding */}
            <div className="flex flex-col items-center justify-center p-12 bg-linear-to-tl from-blue-200 to-white">
              <div className="flex justify-center mb-8">
                <Image
                  src="/logo.png"
                  alt="ResQ247 Logo"
                  width={180}
                  height={180}
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-4xl font-bold text-blue-950 mb-3 text-center">
                Pharmacy Onboarding
              </h1>
              <p className="text-lg text-gray-600 text-center max-w-sm">
                Join ResQ247 and start serving patients across Kenya
              </p>
            </div>

            {/* Right Side - Selection Buttons */}
            <div className="flex flex-col items-center justify-center p-12">
              <div className="w-full max-w-md">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-semibold text-blue-950 mb-2">
                    Choose Registration Type
                  </h2>
                  <p className="text-gray-600">Select how you want to register</p>
                </div>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setRegistrationType('pharmacist')}
                    className="w-full group flex items-center gap-5 px-8 py-6 border border-gray-200 hover:border-blue-600 rounded-2xl transition-all hover:shadow-md"
                  >
                    <div className="w-14 h-14 flex items-center justify-center bg-blue-100 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <User size={32} strokeWidth={2.25} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xl text-gray-900">Individual Pharmacist</div>
                      <div className="text-sm text-gray-600">Pharmacist, PharmTech or Medical Representative</div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setRegistrationType('pharmacy')}
                    className="w-full group flex items-center gap-5 px-8 py-6 border border-gray-200 hover:border-blue-600 rounded-2xl transition-all hover:shadow-md"
                  >
                    <div className="w-14 h-14 flex items-center justify-center bg-blue-100 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Building2 size={32} strokeWidth={2.25} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xl text-gray-900">Pharmacy Facility</div>
                      <div className="text-sm text-gray-600">Dispensary, Wholesale, Retail or Hospital</div>
                    </div>
                  </motion.button>
                </div>

                <button
  onClick={() => window.history.back()}
  type="button"
  className="mt-10 mx-auto flex items-center justify-center gap-2 px-8 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
>
  <ArrowLeft size={18} />
  Back to Home
</button>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden bg-white shadow-2xl rounded-2xl overflow-hidden">
            <div className="p-8">
              <div className="flex justify-center mb-8">
                <Image
                  src="/logo.png"
                  alt="ResQ247 Logo"
                  width={140}
                  height={140}
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-3xl font-bold text-center text-blue-950 mb-2">Pharmacy Onboarding</h1>
              <p className="text-center text-gray-600 mb-10">Choose your registration type</p>

              <div className="space-y-4 max-w-md mx-auto">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setRegistrationType('pharmacist')}
                  className="w-full flex items-center gap-4 px-6 py-5 border border-gray-200 rounded-2xl active:border-blue-600"
                >
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <User size={28} />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Individual Pharmacist</div>
                    <div className="text-sm text-gray-600">Pharmacist, PharmTech, Rep</div>
                  </div>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setRegistrationType('pharmacy')}
                  className="w-full flex items-center gap-4 px-6 py-5 border border-gray-200 rounded-2xl active:border-blue-600"
                >
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <Building2 size={28} />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Pharmacy Facility</div>
                    <div className="text-sm text-gray-600">Dispensary, Wholesale or Outlet</div>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Form Rendering
  return (
    <AnimatePresence mode="wait">
      

      {registrationType === 'pharmacy' && (
        <PharmacyFacilityRegistration 
          key="pharmacy"
          onSubmit={handlePharmacySubmit}
          onBack={() => setRegistrationType(null)}   // Cleanly returns to selection screen
        />
      )}

      {registrationType === 'pharmacist' && (
        <PharmacistRegistration 
          key="pharmacist"
          onSubmit={handlePharmacistSubmit}
          onBack={() => setRegistrationType(null)}   // ← This returns cleanly to selection
        />
      )}
    </AnimatePresence>
  );
}