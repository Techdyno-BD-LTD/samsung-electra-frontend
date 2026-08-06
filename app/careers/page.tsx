'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoChevronForward } from 'react-icons/io5';
import JobCard from './_components/JobCard';
import ApplyModal from './_components/ApplyModal';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/features/toast/toastSlice';
import Skeleton from "@/components/common/Skeleton";

interface Job {
  id: string;
  job_title: string;
  job_type: string;
  vacancy: number;
  deadline: string;
  description: string;
  status: boolean;
}

interface CareersData {
  jobs: Job[];
  settings: {
    page_title: string;
    page_description: string;
    button_text: string;
  };
}

export default function CareersPage() {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<CareersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const res = await fetch('/api/careers');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (job: Job) => {
    if (!isAuthenticated) {
      dispatch(showToast({ message: 'Please login to apply for this job.', type: 'error' }));
      return;
    }
    setSelectedJob(job);
  };

  if (loading) {
    return (
      <div className="mx-auto px-4 lg:px-8 py-20 space-y-12 animate-in fade-in duration-500">
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/4 rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-[2.5rem]" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const settings = data?.settings || {
    page_title: 'Join Us at Electra International',
    page_description: 'Sumash Tech is hiring! We\'re a trusted name in Bangladesh for smartphones, laptops, and gadgets.',
    button_text: 'We\'re Hiring',
  };

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className=" mx-auto px-4 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <IoChevronForward className="text-xs" />
          <span className="text-gray-900 font-bold">Careers</span>
        </nav>
      </div>

      {/* Banner */}
      <div className=" mx-auto  mb-12">
        <div className="relative overflow-hidden  bg-[linear-gradient(90deg,_#0282FF_0%,_#9747FF_112.75%)] py-20 px-6 text-center text-white shadow-2xl">
          <div className="relative z-10 max-w-6xl mx-auto">
            <span className="inline-block border border-white/40 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-6">
              {settings.button_text}
            </span>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2 leading-tight drop-shadow-lg">
              {settings.page_title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed  mx-auto drop-shadow">
              {settings.page_description}
            </p>
          </div>

          {/* Decorative shapes */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
        </div>
      </div>

      {/* Job Listings */}
      <div className=" mx-auto px-4 lg:px-8 pb-24">
        <div className="space-y-4">
          {data?.jobs?.length ? (
            data.jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={handleApplyClick}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-xl text-gray-500 font-bold">No active job openings at the moment.</p>
              <p className="text-gray-400 mt-2">Check back later for new opportunities!</p>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {selectedJob && (
        <ApplyModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onSuccess={() => {
            setSelectedJob(null);
            fetchCareers();
          }}
        />
      )}
    </div>
  );
}
