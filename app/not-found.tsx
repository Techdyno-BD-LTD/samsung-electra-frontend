"use client";

import { FaSearch } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/70 backdrop-blur-md shadow-2xl border border-blue-200 p-8 text-center">
        
        {/* 404 Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
          <FaSearch className="text-3xl text-blue-600" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-blue-900">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-3 text-sm text-blue-700/80">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex justify-center gap-3">
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
          <button 
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
