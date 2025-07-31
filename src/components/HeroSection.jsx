import React, { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';

export default function HeroSection({ searchQuery, setSearchQuery, location, setLocation }) {
  const [salaryRange, setSalaryRange] = useState({ min: '', max: '' });
  const [experienceLevel, setExperienceLevel] = useState('');
  const [jobType, setJobType] = useState('');

  const applyFilters = () => {
    // Aquí puedes manejar la lógica para aplicar los filtros
    console.log('Aplicando filtros:', { salaryRange, experienceLevel, jobType });
  };

  return (
    <div className="relative z-50 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 overflow-visible">
      <div className="absolute inset-0 bg-blue-900/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Let's find your dream job
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Descubre los mejores trabajos remotos y presenciales de todo el mundo.
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
            {/* Experience Level Filter */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn m-1 text-white">
                Experience Level <ChevronDown className="w-4 h-4" />
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-white text-black rounded-box z-50 w-52 p-2 shadow-sm">
                {['Entry', 'Mid', 'Senior'].map(level => (
                  <li key={level}>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="experience"
                        value={level}
                        checked={experienceLevel === level}
                        onChange={() => setExperienceLevel(level)}
                        className="mr-2"
                      />
                      {level}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Job Types Filter */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn m-1 text-white">
                Job Types <ChevronDown className="w-4 h-4" />
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-white text-black rounded-box z-50 w-52 p-2 shadow-sm">
                {['Presencial', 'Híbrido', 'Remoto', "All"].map(type => (
                  <li key={type}>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value={type}
                        checked={jobType === type}
                        onChange={() => setJobType(type)}
                        className="mr-2"
                      />
                      {type}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Salary Filter */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn m-1 text-white">
                Salary <ChevronDown className="w-4 h-4" />
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-white text-black rounded-box z-50 w-52 p-2 shadow-sm">
                <li>
                  <h3 className="text-lg font-semibold">Select Salary Range</h3>
                  <input
                    type="number"
                    placeholder="Min"
                    value={salaryRange.min}
                    onChange={(e) => setSalaryRange({ ...salaryRange, min: e.target.value })}
                    className="border rounded-md p-2 mr-2"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={salaryRange.max}
                    onChange={(e) => setSalaryRange({ ...salaryRange, max: e.target.value })}
                    className="border rounded-md p-2"
                  />
                </li>
                <li>
                  <button onClick={applyFilters} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Apply Filter
                  </button>
                </li>
              </ul>
            </div>
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
