'use client';

import React from 'react';
import { IoSend } from 'react-icons/io5';

interface Job {
  id: string;
  job_title: string;
  job_type: string;
  vacancy: number;
  deadline: string;
  description: string;
  status: boolean;
}

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  const isDeadlinePassed = new Date(job.deadline) < new Date();

  return (
    <div className="bg-white border-b border-gray-200 py-8 first:pt-0 last:border-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{job.job_title}</h2>
          <div className="space-y-1 text-gray-600 font-medium">
            <p>Vacancy : {job.vacancy < 10 ? `0${job.vacancy}` : job.vacancy}</p>
            <p>Deadline : {new Date(job.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            <p>Job title : {job.job_type} (Physical, 8-hour shifts)</p>
          </div>
        </div>
        
        <div>
          {!job.status || isDeadlinePassed ? (
            <button 
              disabled
              className="bg-red-600 text-white px-10 py-3 rounded-md font-bold text-lg min-w-[160px] cursor-not-allowed"
            >
              Close
            </button>
          ) : (
            <button 
              onClick={() => onApply(job)}
              className="bg-[#2185D5] hover:bg-[#1c74ba] text-white px-8 py-3 rounded-md font-bold text-lg flex items-center gap-2 transition-colors min-w-[160px] justify-center"
            >
              Apply Now <IoSend className="text-xl" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
