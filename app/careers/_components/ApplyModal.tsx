'use client';

import React, { useState, useRef } from 'react';
import { IoClose, IoCloudUploadOutline } from 'react-icons/io5';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/features/toast/toastSlice';

interface Job {
  id: string;
  job_title: string;
}

interface ApplyModalProps {
  job: Job;
  onClose: () => void;
  onSuccess: () => void;
}

const ApplyModal: React.FC<ApplyModalProps> = ({ job, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    info: '',
    availability: '',
    termsAgreed: false,
  });
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        dispatch(showToast({ message: 'Please upload a PDF file.', type: 'error' }));
        return;
      }
      setResume(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAgreed) {
      dispatch(showToast({ message: 'Please agree to the terms and conditions.', type: 'error' }));
      return;
    }
    if (!resume) {
      dispatch(showToast({ message: 'Please upload your resume.', type: 'error' }));
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload Resume
      const uploadFormData = new FormData();
      uploadFormData.append('resume', resume);

      const uploadRes = await fetch('/api/careers/upload-resume', {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        throw new Error(uploadData.message || 'Failed to upload resume');
      }

      const resumeUploadId = uploadData.data.upload_id;

      // 2. Submit Application
      const applicationRes = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          job_id: job.id,
          name: formData.name,
          email: formData.email,
          info: formData.info,
          availability: formData.availability,
          resume_upload_id: resumeUploadId,
        }),
      });

      const applicationData = await applicationRes.json();
      if (applicationData.success) {
        dispatch(showToast({ 
          message: 'Application submitted successfully!', 
          type: 'success',
          productName: job.job_title,
          actionLabel: 'Close',
          actionLink: '/careers'
        }));
        onSuccess();
      } else {
        throw new Error(applicationData.message || 'Failed to submit application');
      }
    } catch (error: any) {
      dispatch(showToast({ message: error.message || 'Something went wrong', type: 'error' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
        >
          <IoClose size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply for Position</h2>
          <p className="text-gray-600 mb-8 font-medium">{job.job_title}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Join Availability</label>
              <input 
                type="text" 
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                required
                placeholder="e.g. within 15 days, 1 month etc"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Why should we hire you?</label>
              <textarea 
                name="info"
                value={formData.info}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Tell us about yourself and your experience"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Resume / CV (PDF Only)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <IoCloudUploadOutline className="text-4xl text-gray-400 mb-2" />
                <p className="text-gray-600 font-semibold">{resume ? resume.name : 'Click to upload your resume'}</p>
                <p className="text-gray-400 text-sm mt-1">Maximum file size 2MB</p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                name="termsAgreed"
                checked={formData.termsAgreed}
                onChange={handleChange}
                id="terms"
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 font-medium">
                I agree to the <span className="text-blue-600 cursor-pointer hover:underline">Terms & Conditions</span> and confirm that the information provided is accurate and I agree with the job description.
              </label>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2185D5] hover:bg-[#1c74ba] active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;
