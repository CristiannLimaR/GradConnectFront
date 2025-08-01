import React from "react";
import { MapPin, DollarSign, Bookmark } from "lucide-react";

export default function JobList({ jobs, selectedJob, setSelectedJob }) {
  return (
    <div className="flex-1 max-w-md">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-600">Recommended jobs</span>
          <span className="text-sm text-blue-600 ml-2">{jobs.length}</span>
        </div>
        <div className="text-sm text-gray-500">
          Sort by: <span className="font-medium">Last updated</span>
        </div>
      </div>
      {jobs.map((job, index) => (
        <div className="space-y-4">
          <div
            key={index}
            onClick={() => setSelectedJob(index)}
            className={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md w-[300px] min-h-[201px] ${
              selectedJob === index
                ? "border-blue-500 shadow-md"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-blue-600">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
              <span>{job.time}</span>
              <span>•</span>
              <span>{job.applicationsCount}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  job.modality === "Full Time"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {job.modality}
              </span>
              {job.isRemote && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {job.location}
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
        </div>
      ))}
    </div>
  );
}
