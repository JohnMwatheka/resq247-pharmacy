'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

const registerSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Please enter a valid email address'),
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  nationalId: z.string().optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  address: z.string().min(10, 'Please provide a complete address'),

  ppbRegistrationNumber: z.string().min(5, 'PPB Registration Number is required'),
  ppbPracticingLicense: z.string().min(5, 'PPB Practicing License is required'),
  licenseExpiryDate: z.string().min(1, 'License expiry date is required'),
  qualification: z.string().min(3, 'Qualification is required'),
  yearsOfExperience: z.number().min(0).default(0),

  password: z.string().min(6, 'Password must be at least 6 characters'),
  
  consentGiven: z.boolean().refine(val => val === true, 'You must agree to the declaration'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function PharmacistRegistration() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      yearsOfExperience: 0,
      consentGiven: false,
      password: '',
    },
    mode: 'onChange',
  });

  const validateCurrentStep = async (): Promise<boolean> => {
    let fieldsToValidate: (keyof RegisterForm)[] = [];

    switch (step) {
      case 1: fieldsToValidate = ['fullName', 'phone', 'email', 'dateOfBirth', 'gender']; break;
      case 2: fieldsToValidate = ['ppbRegistrationNumber', 'ppbPracticingLicense', 'licenseExpiryDate', 'qualification']; break;
      case 3: fieldsToValidate = ['address']; break;
      case 4: return true;
      case 5: fieldsToValidate = ['password']; break;
      case 6: fieldsToValidate = ['consentGiven']; break;
      default: return true;
    }

    return await form.trigger(fieldsToValidate);
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newDocs = files.map(file => ({
      type: file.name.toLowerCase().includes('license') ? 'PPB_LICENSE' : 'CERTIFICATE',
      name: file.name,
      url: URL.createObjectURL(file),
      file
    }));
    setUploadedDocuments(prev => [...prev, ...newDocs]);
  };

  const removeDocument = (index: number) => {
    setUploadedDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: RegisterForm) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const payload = {
        ...data,
        documents: uploadedDocuments.map(doc => ({
          type: doc.type,
          name: doc.name,
          url: doc.url
        }))
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Registration submitted successfully! Awaiting admin verification.' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Registration failed.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Pharmacist Registration</h1>

          <div className="mb-10">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Step {step} of 6</span>
              <span>ResQ247 Pharmacy Onboarding</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-600"
                animate={{ width: `${(step / 6) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-xl font-semibold">Personal Information</h2>

                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input {...form.register('fullName')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="John Kamau" />
                    {form.formState.errors.fullName && <p className="text-red-500 text-sm mt-1">{form.formState.errors.fullName.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number *</label>
                      <input {...form.register('phone')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="+2547XXXXXXXX" />
                      {form.formState.errors.phone && <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email Address *</label>
                      <input type="email" {...form.register('email')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="john@example.com" />
                      {form.formState.errors.email && <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                      <input type="date" {...form.register('dateOfBirth')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                      {form.formState.errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{form.formState.errors.dateOfBirth.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Gender *</label>
                      <select {...form.register('gender')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {form.formState.errors.gender && <p className="text-red-500 text-sm mt-1">{form.formState.errors.gender.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">National ID (Optional)</label>
                    <input {...form.register('nationalId')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="12345678" />
                  </div>
                </motion.div>
              )}

              {/* Step 2: PPB Details */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-xl font-semibold">PPB Professional Details</h2>

                  <div>
                    <label className="block text-sm font-medium mb-1">PPB Registration Number *</label>
                    <input {...form.register('ppbRegistrationNumber')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="PPB/2019/00456" />
                    {form.formState.errors.ppbRegistrationNumber && <p className="text-red-500 text-sm mt-1">{form.formState.errors.ppbRegistrationNumber.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">PPB Practicing License Number *</label>
                    <input {...form.register('ppbPracticingLicense')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="PPB/2020/00789" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">License Expiry Date *</label>
                      <input type="date" {...form.register('licenseExpiryDate')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Years of Experience</label>
                      <input 
                        type="number" 
                        {...form.register('yearsOfExperience', { valueAsNumber: true })} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" 
                        placeholder="5" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Qualification *</label>
                    <input {...form.register('qualification')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Bachelor of Pharmacy" />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Address */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-xl font-semibold">Residential Address</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Address *</label>
                    <textarea 
                      {...form.register('address')} 
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="House No, Street, Area, City, County"
                    />
                    {form.formState.errors.address && <p className="text-red-500 text-sm mt-1">{form.formState.errors.address.message}</p>}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Document Upload */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-xl font-semibold">Upload Supporting Documents</h2>
                  <p className="text-gray-600 mb-4">Upload clear scans or photos (PDF, JPG, PNG)</p>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-blue-400 transition-colors">
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
                      <p className="font-medium text-lg">Click to upload documents</p>
                      <p className="text-sm text-gray-500 mt-1">PPB License, Degree Certificate, National ID, etc.</p>
                    </label>
                  </div>

                  {uploadedDocuments.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <h3 className="font-medium">Uploaded Files ({uploadedDocuments.length})</h3>
                      {uploadedDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span>📄</span>
                            <div>
                              <p className="font-medium truncate max-w-xs">{doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.type}</p>
                            </div>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeDocument(index)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 5: Password */}
              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-xl font-semibold">Account Security</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Create Password *</label>
                    <input 
                      type="password"
                      {...form.register('password')} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Minimum 6 characters"
                    />
                    {form.formState.errors.password && <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>}
                  </div>
                </motion.div>
              )}

              {/* Step 6: Consent */}
              {step === 6 && (
                <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-xl font-semibold">Final Declaration</h2>
                  <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        {...form.register('consentGiven')}
                        className="mt-1 w-5 h-5 accent-blue-600"
                      />
                      <span className="text-sm leading-relaxed">
                        I hereby solemnly declare and warrant that all information provided by me during the registration process is true, accurate, complete, and not misleading in any material respect, to the best of my knowledge and belief; I acknowledge that such information shall be relied upon for medical assessment and service delivery, and I expressly accept that any false statement, misrepresentation, or omission of material facts may result in the suspension or termination of my access to the platform and its services; furthermore, I acknowledge and agree that the provision of false or misleading information may constitute an offense under the applicable laws of the Republic of Kenya, and I accept full legal responsibility including costs and liability,  including the possibility of investigation and prosecution in accordance with such laws.
                      </span>
                    </label>
                    {form.formState.errors.consentGiven && <p className="text-red-500 text-sm mt-3">{form.formState.errors.consentGiven.message}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-12 pt-6 border-t">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Previous
                </button>
              )}

              {step < 6 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-10 py-3 bg-blue-600 text-white rounded-lg ml-auto hover:bg-blue-700 transition-colors font-medium"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-12 py-3 bg-green-600 text-white rounded-lg ml-auto disabled:opacity-50 font-medium transition-colors"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Registration'}
                </button>
              )}
            </div>
          </form>

          {message && (
            <div className={`mt-8 p-5 rounded-xl text-center font-medium border ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}