import React from 'react';
import { MapPin, DollarSign } from 'lucide-react';

export default function AppliedJobList({ jobs, selectedJob, setSelectedJob }) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
          <div
            key={job.id}
            onClick={() => setSelectedJob(index)}
            className={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md w-full min-h-[201px]`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg">
                  {job.logo}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
              <span>{job.timePosted}</span>
              <span>•</span>
              <span>{job.applicants}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                job.type === 'Full Time' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {job.type}
              </span>
              {job.isRemote && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Remote
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {job.level}
              </span>
              {job.status && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  job.status === 'aplicado' ? 'bg-green-200 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {job.status === 'aplicado' ? 'Aplicado' : 'Guardado'}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex items-center mb-1">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location}
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                {job.salary}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 