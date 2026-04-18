/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Image from 'next/image';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Swal from 'sweetalert2';

export type PharmacyFacilityFormData = {
  facilityName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  countryCode: string;
  registrationType: 'wholesale' | 'retail' | 'hospital' | 'manufacturer';
  registrationNo: string;
  licenseNumber: string;
  yearOfEstablishment: string;
  county: string;
  address: string;
  latitude: string;
  longitude: string;
  consentGiven: boolean;        // ← Ensure this is boolean (not optional)
};

interface PharmacyFacilityRegistrationProps {
  onSubmit: (data: PharmacyFacilityFormData, documents: any[]) => Promise<void>;
  onBack?: () => void;                    // New prop to go back to selection
}

const steps = [
  { id: 1, title: "Basic Information" },
  { id: 2, title: "Registration Details" },
  { id: 3, title: "Location & Address" },
  { id: 4, title: "Documents" },
  { id: 5, title: "Review & Submit" },
];


export default function PharmacyFacilityRegistration({ 
  onSubmit, 
  onBack 
}: PharmacyFacilityRegistrationProps) {
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PharmacyFacilityFormData>({
  facilityName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  countryCode: '+254',
  registrationType: 'retail',
  registrationNo: '',
  licenseNumber: '',
  yearOfEstablishment: '',
  county: '',
  address: '',
  latitude: '',
  longitude: '',
  consentGiven: false,           // ← This fixes the warning
});

  const [documents] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // 0-100
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;

  setFormData(prev => ({ ...prev, [name]: value }));

  // Real-time password strength
  if (name === 'password') {
    const strength = calculatePasswordStrength(value);
    setPasswordStrength(strength);
  }

  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
};

const calculatePasswordStrength = (password: string): number => {
  let score = 0;
  if (password.length >= 8) score += 25;
  if (/[A-Z]/.test(password)) score += 25;
  if (/[a-z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;
  return Math.min(100, score);
};

  const validateStep = (): boolean => {
  const newErrors: Record<string, string> = {};

  if (currentStep === 1) {
    if (!formData.facilityName.trim()) newErrors.facilityName = "Facility name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
  }

  if (currentStep === 2) {
    if (!formData.registrationNo.trim()) newErrors.registrationNo = "Registration number is required";
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "License number is required";
    if (!formData.yearOfEstablishment) newErrors.yearOfEstablishment = "Year of establishment is required";
  }

  if (currentStep === 3) {
    if (!formData.county) newErrors.county = "County is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.latitude.trim()) newErrors.latitude = "Latitude is required";
    if (!formData.longitude.trim()) newErrors.longitude = "Longitude is required";
  }

  if (currentStep === 4) {
  const hasRegistrationCert = uploadedDocuments.some(doc => doc.type === 'REGISTRATION_CERT');
  const hasPracticeLicense = uploadedDocuments.some(doc => doc.type === 'PRACTICE_LICENSE');

  if (!hasRegistrationCert) newErrors.registrationCert = "Registration Certificate is required";
  if (!hasPracticeLicense) newErrors.practiceLicense = "Practice License is required";
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

  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);

const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
  const file = e.target.files?.[0];
  if (file) {
    const newDoc = {
      type,
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    };
    setUploadedDocuments(prev => [...prev, newDoc]);
  }
};

const getFileName = (type: string) => {
  const doc = uploadedDocuments.find(d => d.type === type);
  return doc ? doc.name : null;
};

const areDocumentsComplete = (): boolean => {
  const hasRegistrationCert = uploadedDocuments.some(doc => doc.type === 'REGISTRATION_CERT');
  const hasPracticeLicense = uploadedDocuments.some(doc => doc.type === 'PRACTICE_LICENSE');
  return hasRegistrationCert && hasPracticeLicense;
};

const removeDocument = (index: number) => {
  setUploadedDocuments(prev => prev.filter((_, i) => i !== index));
};

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateStep()) return;

  setIsSubmitting(true);

  try {
    await onSubmit(formData, documents);

    // Success notification with SweetAlert2
    Swal.fire({
      title: "Registration Submitted Successfully!",
      text: "Your pharmacy facility registration has been received. Our admin team will review it and contact you soon.",
      icon: "success",
      confirmButtonText: "Go to Login",
      confirmButtonColor: "#1e3a8a",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirect to login page
        window.location.href = "/login";   // ← Change this if your login route is different (e.g. "/auth/login")
      }
    });

  } catch (error) {
    console.error("Submission error:", error);
    
    Swal.fire({
      title: "Submission Failed",
      text: "Something went wrong while submitting your registration. Please try again.",
      icon: "error",
      confirmButtonText: "Try Again",
      confirmButtonColor: "#1e3a8a",
    });
  } finally {
    setIsSubmitting(false);
  }
};
    const detectLocation = () => {
    setIsDetectingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setIsDetectingLocation(false);
      },
      (error) => {
        let message = "Failed to detect location.";
        if (error.code === 1) message = "Location access was denied.";
        else if (error.code === 2) message = "Location information is unavailable.";
        else if (error.code === 3) message = "Location request timed out.";
        
        setLocationError(message);
        setIsDetectingLocation(false);
      }
    );
  };

  const kenyaCounties = [
    "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu", "Garissa",
    "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi",
    "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos",
    "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a",
    "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri",
    "Samburu", "Siaya", "Taita Taveta", "Tana River", "Tharaka Nithi", "Trans Nzoia",
    "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
  ];

  const goBackToSelection = () => {
    if (onBack) {
      onBack();                    // Preferred way - controlled by parent
    } else {
      window.history.back();       // Fallback
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
              onClick={goBackToSelection}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-950 transition-colors text-sm font-medium self-start mb-8"
            >
              <ArrowLeft size={18} />
              Back to Selection
            </button>

            <div className="flex-1">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 flex items-center justify-center bg-blue-100 text-blue-600 rounded-2xl">
                  <Building2 size={32} strokeWidth={2.25} />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-blue-950">Facility Registration</h2>
                  <p className="text-gray-600">Step {currentStep} of {steps.length}</p>
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
                  {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        {/* Facility Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Facility Name *</label>
                          <input
                            type="text"
                            name="facilityName"
                            value={formData.facilityName}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                            placeholder="e.g. MediCare Pharmacy Ltd"
                          />
                          {errors.facilityName && <p className="text-red-500 text-sm mt-1">{errors.facilityName}</p>}
                        </div>

                        {/* Phone Number - Full Row */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                          <PhoneInput
                            international
                            defaultCountry="KE"
                            value={formData.phoneNumber}
                            onChange={(value) => setFormData(prev => ({ ...prev, phoneNumber: value || '' }))}
                            className="custom-phone-input w-full"
                            placeholder="Enter phone number"
                            numberInputProps={{
                              className: "w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                            }}
                          />
                          {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                        </div>

                        {/* Email Address */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                            placeholder="facility@example.com"
                          />
                          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Password Section */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600 pr-12"
                              placeholder="Minimum 8 characters"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 font-medium text-sm"
                            >
                              {showPassword ? "Hide" : "Show"}
                            </button>
                          </div>

                          {formData.password && (
                            <div className="mt-3">
                              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-300 ${
                                    passwordStrength < 40 ? 'bg-red-500' :
                                    passwordStrength < 70 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${passwordStrength}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-xs mt-1">
                                <span className={passwordStrength < 40 ? 'text-red-500' : passwordStrength < 70 ? 'text-yellow-500' : 'text-green-500'}>
                                  {passwordStrength < 40 ? 'Weak' : passwordStrength < 70 ? 'Medium' : 'Strong'}
                                </span>
                                <span className="text-gray-500">8+ • A-Z • a-z • 0-9 • Symbol</span>
                              </div>
                            </div>
                          )}
                          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                          />
                          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>
                      </motion.div>
                    )}

                  {/* Step 2: Registration Details */}
                  {currentStep === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Registration Type</label>
                        <select name="registrationType" value={formData.registrationType} onChange={handleInputChange}
                          className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600 bg-white">
                          <option value="retail">Retail Outlet</option>
                          <option value="wholesale">Wholesale</option>
                          <option value="hospital">Hospital Pharmacy</option>
                          <option value="manufacturer">Manufacturer</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                          <input type="text" name="registrationNo" value={formData.registrationNo} onChange={handleInputChange}
                            className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600" placeholder="PPB/REG/XXXX" />
                          {errors.registrationNo && <p className="text-red-500 text-sm mt-1">{errors.registrationNo}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                          <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange}
                            className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600" placeholder="PPB/LIC/XXXX" />
                          {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year of Establishment</label>
                        <input type="number" name="yearOfEstablishment" value={formData.yearOfEstablishment} onChange={handleInputChange}
                          className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600" placeholder="2015" min="1900" max={new Date().getFullYear()} />
                        {errors.yearOfEstablishment && <p className="text-red-500 text-sm mt-1">{errors.yearOfEstablishment}</p>}
                      </div>
                    </motion.div>
                  )}


                  {/* Step 3: Location & Address - Desktop */}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">County *</label>
                        <select
                          name="county"
                          value={formData.county}
                          onChange={handleInputChange}
                          className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600 bg-white"
                        >
                          <option value="">Select County</option>
                          {kenyaCounties.map((county) => (
                            <option key={county} value={county}>{county}</option>
                          ))}
                        </select>
                        {errors.county && <p className="text-red-500 text-sm mt-1">{errors.county}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address *</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600 resize-y"
                          placeholder="Plot 45, Along Ngong Road, Opposite ABC Mall, Nairobi"
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                      </div>

                      {/* Auto Detect Location Button */}
                      <div>
                        <button
                          type="button"
                          onClick={detectLocation}
                          disabled={isDetectingLocation}
                          className="w-full py-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                        >
                          {isDetectingLocation ? "Detecting location..." : "Auto Detect Current Location"}
                        </button>
                        {locationError && <p className="text-red-500 text-sm mt-2 text-center">{locationError}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
                          <input
                            type="text"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                            placeholder="-1.2921"
                          />
                          {errors.latitude && <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
                          <input
                            type="text"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                            placeholder="36.8219"
                          />
                          {errors.longitude && <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Documents */}
                                    {/* Step 4: Documents - Desktop */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Document Uploads</h3>
                      <p className="text-sm text-gray-600">Please upload the following required documents</p>

                      {/* Registration Certificate */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Registration Certificate *
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer bg-white border border-gray-300 hover:border-blue-600 px-6 py-3.5 rounded-2xl flex-1 text-center transition-colors">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleDocumentUpload(e, 'REGISTRATION_CERT')}
                              className="hidden"
                            />
                            <span className="text-gray-700 font-medium">Choose File</span>
                          </label>
                          <div className="flex-1 px-5 py-3.5 border border-gray-200 rounded-2xl text-gray-500 text-sm truncate">
                            {getFileName('REGISTRATION_CERT') || "No file chosen"}
                          </div>
                        </div>
                        {errors.registrationCert && <p className="text-red-500 text-sm mt-1">{errors.registrationCert}</p>}
                      </div>

                      {/* Practice License */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Practice License *
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer bg-white border border-gray-300 hover:border-blue-600 px-6 py-3.5 rounded-2xl flex-1 text-center transition-colors">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleDocumentUpload(e, 'PRACTICE_LICENSE')}
                              className="hidden"
                            />
                            <span className="text-gray-700 font-medium">Choose File</span>
                          </label>
                          <div className="flex-1 px-5 py-3.5 border border-gray-200 rounded-2xl text-gray-500 text-sm truncate">
                            {getFileName('PRACTICE_LICENSE') || "No file chosen"}
                          </div>
                        </div>
                        {errors.practiceLicense && <p className="text-red-500 text-sm mt-1">{errors.practiceLicense}</p>}
                      </div>

                      {/* Uploaded Files Preview */}
                      {uploadedDocuments.length > 0 && (
                        <div className="mt-6">
                          <p className="text-sm font-medium text-gray-700 mb-3">Uploaded Files</p>
                          <div className="space-y-3">
                            {uploadedDocuments.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 px-5 py-3 rounded-2xl">
                                <div className="flex items-center gap-3">
                                  <span className="text-blue-600">📄</span>
                                  <div>
                                    <p className="text-sm font-medium text-gray-800 truncate max-w-xs">{doc.name}</p>
                                    <p className="text-xs text-gray-500">{doc.type}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeDocument(index)}
                                  className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                  {/* Step 5: Review & Submit - Desktop */}
                    {currentStep === 5 && (
                      <motion.div
                        key="step5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">Review Your Information</h3>
                          <p className="text-sm text-gray-600">Please carefully review all details before final submission</p>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-3xl space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-sm">
                            <div>
                              <p className="font-medium text-gray-500 mb-1">Facility Name</p>
                              <p className="font-semibold text-gray-900">{formData.facilityName || "—"}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-500 mb-1">Email Address</p>
                              <p className="text-gray-900">{formData.email || "—"}</p>
                            </div>

                            <div>
                              <p className="font-medium text-gray-500 mb-1">Phone Number</p>
                              <p className="text-gray-900">
                                 {formData.phoneNumber || "—"}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-500 mb-1">Registration Type</p>
                              <p className="capitalize text-gray-900">{formData.registrationType}</p>
                            </div>

                            <div>
                              <p className="font-medium text-gray-500 mb-1">Registration Number</p>
                              <p className="text-gray-900">{formData.registrationNo || "—"}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-500 mb-1">License Number</p>
                              <p className="text-gray-900">{formData.licenseNumber || "—"}</p>
                            </div>

                            <div className="md:col-span-2">
                              <p className="font-medium text-gray-500 mb-1">Physical Address</p>
                              <p className="text-gray-900">{formData.address || "—"}</p>
                            </div>

                            <div>
                              <p className="font-medium text-gray-500 mb-1">County</p>
                              <p className="text-gray-900">{formData.county || "—"}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-500 mb-1">Coordinates</p>
                              <p className="text-gray-900">
                                {formData.latitude && formData.longitude 
                                  ? `${formData.latitude}, ${formData.longitude}` 
                                  : "—"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              name="consentGiven"
                              checked={formData.consentGiven}     // Now safe
                              onChange={handleInputChange}
                              className="mt-1 w-5 h-5 accent-blue-600"
                            />
                            <span className="text-sm leading-relaxed text-gray-700">
                              I confirm that all information provided is accurate and complete. 
                              I accept full responsibility for any inaccuracies.
                            </span>
                          </label>
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>

                
                {/* Desktop Navigation */}
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

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 py-4 bg-blue-950 hover:bg-blue-900 text-white rounded-2xl font-medium flex items-center justify-center gap-2 transition-all"
                    >
                      Continue <ChevronRight size={20} />
                    </button>
                  ) : currentStep === 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!areDocumentsComplete()}
                      className="flex-1 py-4 bg-blue-950 hover:bg-blue-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-2xl font-medium flex items-center justify-center gap-2 transition-all"
                    >
                      Continue to Review <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.consentGiven}
                      className="flex-1 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-2xl font-medium transition-all"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ====================== MOBILE LAYOUT ====================== */}
        <div className="lg:hidden bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <Image src="/logo.png" alt="ResQ247 Logo" width={140} height={140} className="object-contain" priority />
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                <Building2 size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-950">Pharmacy Facility</h1>
                <p className="text-sm text-gray-600">Step {currentStep} of {steps.length}</p>
              </div>
            </div>

            {/* Mobile Progress */}
            <div className="flex justify-between mb-8 px-2">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-medium ${
                    step.id < currentStep ? 'bg-blue-600 border-blue-600 text-white' :
                    step.id === currentStep ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-400'
                  }`}>
                    {step.id < currentStep ? <Check size={16} /> : step.id}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* Step 1 - Mobile */}
                  {currentStep === 1 && (
                    <motion.div 
                      key="mstep1" 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }} 
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Facility Name *</label>
                        <input
                          type="text"
                          name="facilityName"
                          value={formData.facilityName}
                          onChange={handleInputChange}
                          className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                          placeholder="e.g. MediCare Pharmacy Ltd"
                        />
                        {errors.facilityName && <p className="text-red-500 text-sm mt-1">{errors.facilityName}</p>}
                      </div>

                      {/* Phone - Full width on mobile */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                        <PhoneInput
                          international
                          defaultCountry="KE"
                          value={formData.phoneNumber}
                          onChange={(value) => setFormData(prev => ({ ...prev, phoneNumber: value || '' }))}
                          className="custom-phone-input w-full"
                          placeholder="Enter phone number"
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                          placeholder="facility@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600 pr-12"
                            placeholder="Minimum 8 characters"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm font-medium"
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>

                        {formData.password && (
                          <div className="mt-3">
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  passwordStrength < 40 ? 'bg-red-500' : passwordStrength < 70 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${passwordStrength}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                      </div>
                    </motion.div>
                  )}

                {currentStep === 2 && (
                  <motion.div key="mstep2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                    {/* Step 2 fields - same as desktop */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration Type</label>
                      <select name="registrationType" value={formData.registrationType} onChange={handleInputChange}
                        className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600 bg-white">
                        <option value="retail">Retail Outlet</option>
                        <option value="wholesale">Wholesale</option>
                        <option value="hospital">Hospital Pharmacy</option>
                        <option value="manufacturer">Manufacturer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                      <input type="text" name="registrationNo" value={formData.registrationNo} onChange={handleInputChange}
                        className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600" placeholder="PPB/REG/XXXX" />
                      {errors.registrationNo && <p className="text-red-500 text-sm mt-1">{errors.registrationNo}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                      <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange}
                        className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600" placeholder="PPB/LIC/XXXX" />
                      {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year of Establishment</label>
                      <input type="number" name="yearOfEstablishment" value={formData.yearOfEstablishment} onChange={handleInputChange}
                        className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600" placeholder="2015" />
                      {errors.yearOfEstablishment && <p className="text-red-500 text-sm mt-1">{errors.yearOfEstablishment}</p>}
                    </div>
                  </motion.div>
                )}

                {/* Step 3 - Mobile */}
                {currentStep === 3 && (
                  <motion.div 
                    key="mstep3" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">County *</label>
                      <select
                        name="county"
                        value={formData.county}
                        onChange={handleInputChange}
                        className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600 bg-white"
                      >
                        <option value="">Select County</option>
                        {kenyaCounties.map((county) => (
                          <option key={county} value={county}>{county}</option>
                        ))}
                      </select>
                      {errors.county && <p className="text-red-500 text-sm mt-1">{errors.county}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address *</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600 resize-y"
                        placeholder="Plot 45, Along Ngong Road, Nairobi"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    {/* Auto Detect Location Button */}
                    <div>
                      <button
                        type="button"
                        onClick={detectLocation}
                        disabled={isDetectingLocation}
                        className="w-full py-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                      >
                        {isDetectingLocation ? "Detecting location..." : "Auto Detect Current Location"}
                      </button>
                      {locationError && <p className="text-red-500 text-sm mt-2 text-center">{locationError}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
                        <input
                          type="text"
                          name="latitude"
                          value={formData.latitude}
                          onChange={handleInputChange}
                          className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                          placeholder="-1.2921"
                        />
                        {errors.latitude && <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
                        <input
                          type="text"
                          name="longitude"
                          value={formData.longitude}
                          onChange={handleInputChange}
                          className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                          placeholder="36.8219"
                        />
                        {errors.longitude && <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4 - Mobile */}
                  {currentStep === 4 && (
                    <motion.div 
                      key="mstep4" 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }} 
                      className="space-y-8"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Document Uploads</h3>
                      <p className="text-sm text-gray-600">Please upload the following required documents</p>

                      {/* Registration Certificate */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Registration Certificate *
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer bg-white border border-gray-300 hover:border-blue-600 px-6 py-3.5 rounded-2xl flex-1 text-center transition-colors">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleDocumentUpload(e, 'REGISTRATION_CERT')}
                              className="hidden"
                            />
                            <span className="text-gray-700 font-medium">Choose File</span>
                          </label>
                          <div className="flex-1 px-5 py-3.5 border border-gray-200 rounded-2xl text-gray-500 text-sm truncate">
                            {getFileName('REGISTRATION_CERT') || "No file chosen"}
                          </div>
                        </div>
                        {errors.registrationCert && <p className="text-red-500 text-sm mt-1">{errors.registrationCert}</p>}
                      </div>

                      {/* Practice License */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Practice License *
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer bg-white border border-gray-300 hover:border-blue-600 px-6 py-3.5 rounded-2xl flex-1 text-center transition-colors">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleDocumentUpload(e, 'PRACTICE_LICENSE')}
                              className="hidden"
                            />
                            <span className="text-gray-700 font-medium">Choose File</span>
                          </label>
                          <div className="flex-1 px-5 py-3.5 border border-gray-200 rounded-2xl text-gray-500 text-sm truncate">
                            {getFileName('PRACTICE_LICENSE') || "No file chosen"}
                          </div>
                        </div>
                        {errors.practiceLicense && <p className="text-red-500 text-sm mt-1">{errors.practiceLicense}</p>}
                      </div>

                      {/* Uploaded Files Preview */}
                      {uploadedDocuments.length > 0 && (
                        <div className="mt-6">
                          <p className="text-sm font-medium text-gray-700 mb-3">Uploaded Files</p>
                          <div className="space-y-3">
                            {uploadedDocuments.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 px-5 py-3 rounded-2xl">
                                <div className="flex items-center gap-3">
                                  <span className="text-blue-600">📄</span>
                                  <div>
                                    <p className="text-sm font-medium text-gray-800 truncate max-w-xs">{doc.name}</p>
                                    <p className="text-xs text-gray-500">{doc.type}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeDocument(index)}
                                  className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 5: Review & Submit - Mobile */}
{currentStep === 5 && (
  <motion.div 
    key="mstep5" 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }} 
    className="space-y-8"
  >
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-1">Review Your Information</h3>
      <p className="text-sm text-gray-600">Please review all details before submitting</p>
    </div>

    <div className="bg-gray-50 p-6 rounded-3xl space-y-6 text-sm">
      <div>
        <p className="font-medium text-gray-500">Facility Name</p>
        <p className="font-semibold mt-1">{formData.facilityName || "—"}</p>
      </div>

      <div>
        <p className="font-medium text-gray-500">Email Address</p>
        <p className="mt-1">{formData.email || "—"}</p>
      </div>

      <div>
        <p className="font-medium text-gray-500">Phone Number</p>
        <p className="mt-1">
           {formData.phoneNumber || "—"}
        </p>
      </div>

      <div>
        <p className="font-medium text-gray-500">Registration Type</p>
        <p className="capitalize mt-1">{formData.registrationType}</p>
      </div>

      <div>
        <p className="font-medium text-gray-500">Registration Number</p>
        <p className="mt-1">{formData.registrationNo || "—"}</p>
      </div>

      <div>
        <p className="font-medium text-gray-500">License Number</p>
        <p className="mt-1">{formData.licenseNumber || "—"}</p>
      </div>

      <div>
        <p className="font-medium text-gray-500">Physical Address</p>
        <p className="mt-1">{formData.address || "—"}</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="font-medium text-gray-500">County</p>
          <p className="mt-1">{formData.county || "—"}</p>
        </div>
        <div>
          <p className="font-medium text-gray-500">Coordinates</p>
          <p className="mt-1">
            {formData.latitude && formData.longitude 
              ? `${formData.latitude}, ${formData.longitude}` 
              : "—"}
          </p>
        </div>
      </div>
    </div>

    <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl">
  <label className="flex items-start gap-3 cursor-pointer">
  <input
    type="checkbox"
    name="consentGiven"
    checked={formData.consentGiven}     // Now safe
    onChange={handleInputChange}
    className="mt-1 w-5 h-5 accent-blue-600"
  />
  <span className="text-sm leading-relaxed text-gray-700">
    I confirm that all information provided is accurate and complete. 
    I accept full responsibility for any inaccuracies.
  </span>
</label>
</div>
  </motion.div>
)}
              </AnimatePresence>

             
            {/* Mobile Navigation */}
              {/* Mobile Navigation */}
<div className="flex gap-4 mt-10">
  {currentStep > 1 && (
    <button
      type="button"
      onClick={prevStep}
      className="flex-1 py-4 border border-gray-300 rounded-2xl font-medium flex items-center justify-center gap-2"
    >
      <ChevronLeft size={20} /> Previous
    </button>
  )}

  {currentStep < 4 ? (
    <button
      type="button"
      onClick={nextStep}
      className="flex-1 py-4 bg-blue-950 hover:bg-blue-900 text-white rounded-2xl font-medium flex items-center justify-center gap-2"
    >
      Continue <ChevronRight size={20} />
    </button>
  ) : currentStep === 4 ? (
    <button
      type="button"
      onClick={nextStep}
      disabled={!areDocumentsComplete()}
      className="flex-1 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-2xl font-medium flex items-center justify-center gap-2"
    >
      Continue to Review
    </button>
  ) : (
    <button
      type="submit"
      disabled={isSubmitting || !formData.consentGiven}
      className="flex-1 py-4 bg-blue-950 hover:bg-blue-900 disabled:bg-gray-400 text-white rounded-2xl font-medium"
    >
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  )}
</div>
            </form>

            <button
              onClick={goBackToSelection}
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