import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">JS</span>
              </div>
              <span className="font-semibold">JobSearch</span>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Discover the best remote jobs in the world. View a company's profile to learn about its mission, culture and values.
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm flex-1"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">For Job Seekers</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white">Browse Jobs</a></li>
              <li><a href="#" className="hover:text-white">Salary Tools</a></li>
              <li><a href="#" className="hover:text-white">Career Advice</a></li>
              <li><a href="#" className="hover:text-white">Company Profile</a></li>
              <li><a href="#" className="hover:text-white">Student Career Center</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white">Products</a></li>
              <li><a href="#" className="hover:text-white">Solutions</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Resources</a></li>
              <li><a href="#" className="hover:text-white">Help</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Helpful Resources</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white">Privacy Center</a></li>
              <li><a href="#" className="hover:text-white">Security Center</a></li>
              <li><a href="#" className="hover:text-white">Accessibility Center</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
} 