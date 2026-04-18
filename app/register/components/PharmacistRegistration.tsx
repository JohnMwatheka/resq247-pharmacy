/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Image from 'next/image';

export type PharmacistFormData = {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  nationalId: string;
  ppbRegistrationType: 'Pharmacist' | 'PharmTech' | 'Reps';
  ppbRegistrationNumber: string;
  ppbPracticingLicense: string;
  yearsOfExperience: string;
  streetAddress: string;
  poBox: string;
  postalCode: string;
  city: string;
  password: string;
  consentGiven: boolean;
};

interface PharmacistRegistrationProps {
  onSubmit: (data: PharmacistFormData, passportPhoto: any | null, uploadedDocuments: any[]) => Promise<void>;
  onBack?: () => void;           // ← Add this
}

const steps = [
  { id: 1, title: "Personal Information" },
  { id: 2, title: "PPB Details" },
  { id: 3, title: "Address" },
  { id: 4, title: "Qualifications" },
  { id: 5, title: "Documents" },
  { id: 6, title: "Password" },
  { id: 7, title: "Declaration" },
];

export default function PharmacistRegistration({ onSubmit, onBack }: PharmacistRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PharmacistFormData>({
  fullName: '',
  phone: '',
  email: '',
  dateOfBirth: '',
  gender: 'Male',
  nationalId: '',                    // ← Added with empty string
  ppbRegistrationType: 'Pharmacist',
  ppbRegistrationNumber: '',
  ppbPracticingLicense: '',
  yearsOfExperience: '',
  streetAddress: '',
  poBox: '',
  postalCode: '',
  city: '',
  password: '',
  consentGiven: false,
});

  const [passportPhoto, setPassportPhoto] = useState<any>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
    }

    if (currentStep === 2) {
      if (!formData.ppbRegistrationNumber.trim()) newErrors.ppbRegistrationNumber = "PPB Registration Number is required";
      if (!formData.ppbPracticingLicense.trim()) newErrors.ppbPracticingLicense = "PPB Practicing License is required";
    }

    if (currentStep === 3) {
      if (!formData.streetAddress.trim()) newErrors.streetAddress = "Street address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    }

    if (currentStep === 6) {
      if (!formData.password || formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    }

    if (currentStep === 7) {
      if (!formData.consentGiven) newErrors.consentGiven = "You must agree to the declaration";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep() && currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

      const goBackToSelection = () => {
        if (onBack) {
          onBack();                    // This will return to selection screen cleanly
        } else {
          window.history.back();
        }
      };

  const handlePassportPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPassportPhoto({
        name: file.name,
        url: URL.createObjectURL(file),
        file,
      });
    }
  };

  const removePassportPhoto = () => setPassportPhoto(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newDocs = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }));
    setUploadedDocuments(prev => [...prev, ...newDocs]);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData, passportPhoto, uploadedDocuments);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-linear-to-br from-white to-white">
      <div className="w-full max-w-6xl">

        {/* ====================== DESKTOP LAYOUT ====================== */}
          <div className="hidden lg:grid lg:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden min-h-170">
            
            {/* Left Branding Panel */}
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

            {/* Right Side - Form */}
            <div className="p-12 flex flex-col">
              <button
                onClick={goBackToSelection}           // ← Changed
                className="flex items-center gap-2 text-gray-500 hover:text-blue-950 transition-colors text-sm font-medium self-start mb-8"
              >
                <ArrowLeft size={18} />
                Back to Selection
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 flex items-center justify-center bg-blue-100 text-blue-600 rounded-2xl">
                    <User size={32} strokeWidth={2.25} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold text-blue-950">Pharmacist</h2>
                    <p className="text-gray-600">Step {currentStep} of 7</p>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between mb-10">
                  {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                          step.id < currentStep
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : step.id === currentStep
                            ? 'border-blue-600 text-blue-600'
                            : 'border-gray-300 text-gray-400'
                        }`}
                      >
                        {step.id < currentStep ? <Check size={18} /> : step.id}
                      </div>
                      <span className={`text-xs mt-3 font-medium text-center ${step.id === currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                            placeholder="John Doe"
                          />
                          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                              placeholder="+254 712 345 678"
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                              placeholder="john@example.com"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                            <input
                              type="date"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleInputChange}
                              className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                            />
                            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600 bg-white"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">National ID *</label>
                          <input
                            type="text"
                            name="nationalId"
                            value={formData.nationalId}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                            placeholder="12345678"
                          />
                          {errors.nationalId && <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: PPB Details */}
                    {currentStep === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">PPB Registration Type *</label>
                          <select
                            name="ppbRegistrationType"
                            value={formData.ppbRegistrationType}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600 bg-white"
                          >
                            <option value="Pharmacist">Pharmacist</option>
                            <option value="PharmTech">Pharmaceutical Technologist</option>
                            <option value="Reps">Medical Representative</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">PPB Registration Number *</label>
                            <input
                              type="text"
                              name="ppbRegistrationNumber"
                              value={formData.ppbRegistrationNumber}
                              onChange={handleInputChange}
                              className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                              placeholder="00456"
                            />
                            {errors.ppbRegistrationNumber && <p className="text-red-500 text-sm mt-1">{errors.ppbRegistrationNumber}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">PPB Practicing License *</label>
                            <input
                              type="text"
                              name="ppbPracticingLicense"
                              value={formData.ppbPracticingLicense}
                              onChange={handleInputChange}
                              className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                              placeholder="PPB/2020/00789"
                            />
                            {errors.ppbPracticingLicense && <p className="text-red-500 text-sm mt-1">{errors.ppbPracticingLicense}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                          <input
                            type="number"
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                            placeholder="5"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Address */}
                    {currentStep === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                          <input
                            type="text"
                            name="streetAddress"
                            value={formData.streetAddress}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                            placeholder="123 Example Street, Estate"
                          />
                          {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                              placeholder="Nairobi"
                            />
                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                            <input
                              type="text"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                              placeholder="00100"
                            />
                            {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">P.O. Box (Optional)</label>
                          <input
                            type="text"
                            name="poBox"
                            value={formData.poBox}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                            placeholder="P.O. Box 12345"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Qualifications */}
                    {currentStep === 4 && (
                      <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-4">Academic Qualifications</h3>
                          <p className="text-sm text-gray-600 mb-6">Add your academic qualifications (you can add multiple)</p>

                          {/* For simplicity, we'll show a placeholder. You can expand with useFieldArray later if needed */}
                          <div className="border border-gray-200 p-6 rounded-2xl bg-gray-50 text-center py-12">
                            <p className="text-gray-500">Qualifications section coming soon (you can add dynamic fields here)</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 5: Documents */}
                    {currentStep === 5 && (
                      <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">Passport Photo</label>
                          <div className="border-2 border-dashed border-blue-400 bg-blue-50 rounded-3xl p-12 text-center hover:border-blue-600 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              capture
                              onChange={handlePassportPhotoUpload}
                              className="hidden"
                              id="passport-photo"
                            />
                            <label htmlFor="passport-photo" className="cursor-pointer block">
                              <div className="text-6xl mb-4">📸</div>
                              <p className="font-semibold text-xl text-blue-700">Take Passport Photo</p>
                              <p className="text-blue-600 mt-2">Tap here to open camera</p>
                            </label>
                          </div>
                          {passportPhoto && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl flex justify-between items-center">
                              <p className="text-green-700">✅ Passport photo uploaded successfully</p>
                              <button type="button" onClick={removePassportPhoto} className="text-red-600 text-sm font-medium">Remove</button>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">Supporting Documents</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-blue-400 transition-colors">
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="doc-upload"
                            />
                            <label htmlFor="doc-upload" className="cursor-pointer block">
                              <div className="text-5xl mb-4">📎</div>
                              <p className="font-medium text-lg">Upload Documents</p>
                              <p className="text-sm text-gray-500">PPB License, Certificates, National ID, etc.</p>
                            </label>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 6: Password */}
                    {currentStep === 6 && (
                      <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Create Password *</label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                            placeholder="Minimum 6 characters"
                          />
                          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 7: Declaration */}
                    {currentStep === 7 && (
                      <motion.div key="step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl">
                          <label className="flex items-start gap-4 cursor-pointer">
                            <input
                              type="checkbox"
                              name="consentGiven"
                              checked={formData.consentGiven}
                              onChange={handleInputChange}
                              className="mt-1 w-5 h-5 accent-blue-600"
                            />
                            <span className="text-sm leading-relaxed text-gray-700">
                              I hereby declare that all the information provided is true and correct. I accept full responsibility for any false information and agree to ResQ247 terms and conditions.
                            </span>
                          </label>
                          {errors.consentGiven && <p className="text-red-500 text-sm mt-3">{errors.consentGiven}</p>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Desktop Navigation Buttons */}
                  <div className="flex gap-4 mt-10">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 py-4 border border-gray-300 hover:border-gray-400 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all"
                      >
                        <ChevronLeft size={20} /> Previous
                      </button>
                    )}

                    {currentStep < 7 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 py-4 bg-blue-950 hover:bg-blue-900 text-white rounded-2xl font-medium flex items-center justify-center gap-2 transition-all"
                      >
                        Continue <ChevronRight size={20} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-4 bg-blue-950 hover:bg-blue-900 disabled:bg-blue-400 text-white rounded-2xl font-medium transition-all"
                      >
                        {isSubmitting ? "Submitting Registration..." : "Submit Registration"}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

        {/* Mobile Layout - Simplified */}
        {/* ====================== MOBILE LAYOUT ====================== */}
<div className="lg:hidden bg-white shadow-2xl rounded-2xl overflow-hidden">
  <div className="p-8">
    {/* Header */}
    <div className="flex justify-center mb-6">
      <Image 
        src="/logo.png" 
        alt="ResQ247 Logo" 
        width={140} 
        height={140} 
        className="object-contain" 
        priority 
      />
    </div>

    <div className="flex items-center gap-3 mb-6">
      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
        <User size={28} />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Pharmacist Registration</h1>
        <p className="text-sm text-gray-600">Step {currentStep} of 7</p>
      </div>
    </div>

    {/* Mobile Progress Indicators */}
    <div className="flex justify-between mb-8 px-2">
      {steps.map((step) => (
        <div key={step.id} className="flex flex-col items-center">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-medium ${
              step.id < currentStep 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : step.id === currentStep 
                ? 'border-blue-600 text-blue-600' 
                : 'border-gray-300 text-gray-400'
            }`}
          >
            {step.id < currentStep ? <Check size={16} /> : step.id}
          </div>
        </div>
      ))}
    </div>

    <form onSubmit={handleSubmit}>
      <AnimatePresence mode="wait">
        
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <motion.div 
            key="mstep1" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                placeholder="John Doe"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                placeholder="+254 712 345 678"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">National ID *</label>
              <input
                type="text"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                placeholder="12345678"
              />
              {errors.nationalId && <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>}
            </div>
          </motion.div>
        )}

        {/* Step 2: PPB Details */}
        {currentStep === 2 && (
          <motion.div key="mstep2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PPB Registration Type *</label>
              <select
                name="ppbRegistrationType"
                value={formData.ppbRegistrationType}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600 bg-white"
              >
                <option value="Pharmacist">Pharmacist</option>
                <option value="PharmTech">Pharmaceutical Technologist</option>
                <option value="Reps">Medical Representative</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PPB Registration Number *</label>
              <input
                type="text"
                name="ppbRegistrationNumber"
                value={formData.ppbRegistrationNumber}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                placeholder="00456"
              />
              {errors.ppbRegistrationNumber && <p className="text-red-500 text-sm mt-1">{errors.ppbRegistrationNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PPB Practicing License *</label>
              <input
                type="text"
                name="ppbPracticingLicense"
                value={formData.ppbPracticingLicense}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                placeholder="PPB/2020/00789"
              />
              {errors.ppbPracticingLicense && <p className="text-red-500 text-sm mt-1">{errors.ppbPracticingLicense}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                placeholder="5"
              />
            </div>
          </motion.div>
        )}

        {/* Step 3: Address */}
        {currentStep === 3 && (
          <motion.div key="mstep3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                placeholder="123 Example Street"
              />
              {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                  placeholder="Nairobi"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                  placeholder="00100"
                />
                {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">P.O. Box (Optional)</label>
              <input
                type="text"
                name="poBox"
                value={formData.poBox}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                placeholder="P.O. Box 12345"
              />
            </div>
          </motion.div>
        )}

        {/* Step 4: Qualifications (Simplified for mobile) */}
        {currentStep === 4 && (
          <motion.div key="mstep4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 py-8 text-center">
            <p className="text-gray-600">Academic Qualifications section</p>
            <p className="text-sm text-gray-500">This will be expanded in the next update</p>
          </motion.div>
        )}

        {/* Step 5: Documents */}
        {currentStep === 5 && (
          <motion.div key="mstep5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Passport Photo</label>
              <div className="border-2 border-dashed border-blue-400 bg-blue-50 rounded-3xl p-10 text-center">
                <input
                  type="file"
                  accept="image/*"
                  capture
                  onChange={handlePassportPhotoUpload}
                  className="hidden"
                  id="passport-mobile"
                />
                <label htmlFor="passport-mobile" className="cursor-pointer block">
                  <div className="text-5xl mb-4">📸</div>
                  <p className="font-semibold text-blue-700">Take Passport Photo</p>
                </label>
              </div>
              {passportPhoto && <p className="text-green-600 text-center mt-3">✅ Passport photo uploaded</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Supporting Documents</label>
              <div className="border-2 border-dashed border-gray-300 rounded-3xl p-10 text-center">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="docs-mobile"
                />
                <label htmlFor="docs-mobile" className="cursor-pointer block">
                  <div className="text-5xl mb-4">📎</div>
                  <p className="font-medium">Upload Documents</p>
                  <p className="text-sm text-gray-500">PPB License, Certificates, etc.</p>
                </label>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 6: Password */}
        {currentStep === 6 && (
          <motion.div key="mstep6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Create Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                placeholder="Minimum 6 characters"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
          </motion.div>
        )}

        {/* Step 7: Declaration */}
        {currentStep === 7 && (
          <motion.div key="mstep7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="consentGiven"
                  checked={formData.consentGiven}
                  onChange={handleInputChange}
                  className="mt-1 w-5 h-5 accent-blue-600"
                />
                <span className="text-sm leading-relaxed text-gray-700">
                  I hereby declare that all the information provided is true and correct. 
                  I accept full responsibility and agree to ResQ247 terms and conditions.
                </span>
              </label>
              {errors.consentGiven && <p className="text-red-500 text-sm mt-3">{errors.consentGiven}</p>}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ====================== MOBILE NAVIGATION ====================== */}
      <div className="flex gap-4 mt-10">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 py-4 border border-gray-300 hover:border-gray-400 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all"
          >
            <ChevronLeft size={20} /> Previous
          </button>
        )}

        {currentStep < 7 ? (
          <button
            type="button"
            onClick={nextStep}
            className="flex-1 py-4 bg-blue-950 hover:bg-blue-900 text-white rounded-2xl font-medium flex items-center justify-center gap-2 transition-all"
          >
            Continue <ChevronRight size={20} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-4 bg-blue-950 hover:bg-blue-900 disabled:bg-blue-400 text-white rounded-2xl font-medium transition-all"
          >
            {isSubmitting ? "Submitting..." : "Submit Registration"}
          </button>
        )}
      </div>
    </form>

    <button
      onClick={goBackToSelection}           // ← Changed
      className="mt-8 w-full text-gray-500 hover:text-blue-950 font-medium flex items-center justify-center gap-2"
    >
      <ArrowLeft size={18} /> Back to Selection
    </button>
  </div>
</div>
      </div>
    </main>
  );
}