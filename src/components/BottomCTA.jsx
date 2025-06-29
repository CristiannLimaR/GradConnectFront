import React from 'react';
import { Play, User } from 'lucide-react';

export default function BottomCTA() {
  return (
    <div className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between">
          <div className="max-w-lg">
            <h2 className="text-3xl font-bold mb-4">
              Find your best opportunity today
            </h2>
            <p className="text-slate-300 mb-6">
              Set up personalized remote job search alerts and get notified by recruiters searching for your skills.
            </p>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium flex items-center">
                <Play className="w-4 h-4 mr-2" />
                Start My Journey
              </button>
              <button className="border border-slate-600 text-white px-6 py-3 rounded-md hover:bg-slate-700 font-medium">
                Explore More
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-80 h-64 bg-slate-700 rounded-lg flex items-center justify-center">
              <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 