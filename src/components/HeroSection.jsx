import React from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';

export default function HeroSection({ searchQuery, setSearchQuery, location, setLocation }) {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-900/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Let's find your dream job
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Discover the best remote and work from home jobs at top remote companies
          </p>
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col md:flex-row gap-2">
            <div className="flex items-center flex-1 px-4 py-2">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Job title or keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-gray-700"
              />
            </div>
            <div className="flex items-center flex-1 px-4 py-2 border-l border-gray-200">
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Country or time zone"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 outline-none text-gray-700"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Clear
              </button>
              <button className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 font-medium">
                Search
              </button>
            </div>
          </div>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mt-6">
            {['Experience Level', 'Company', 'Job types', 'Salary', 'Markets', 'Benefits'].map((filter) => (
              <button key={filter} className="flex items-center space-x-2 bg-white/10 backdrop-blur text-white px-4 py-2 rounded-md hover:bg-white/20 transition-colors">
                <span>{filter}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
        <div className="w-full h-full bg-gradient-to-l from-blue-600 to-transparent"></div>
      </div>
    </div>
  );
} 