import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import JobList from '../components/JobList';
import JobDetails from '../components/JobDetails';
import BottomCTA from '../components/BottomCTA';

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const jobs = [
    {
      id: 1,
      title: "Senior Product Manager",
      company: "Stack Technologies, LLC",
      location: "New York (Remote)",
      timePosted: "1 hour ago",
      applicants: "794 applicants",
      salary: "$120,000 - $170,000 / Yearly",
      employees: "1-10 employees",
      type: "Full Time",
      level: "Senior Level",
      isRemote: true,
      logo: "🚀",
      description: "At Snapfront, we believe that the future of work is remote. We specialize in helping our highly-skilled, global specialist talent community around the world connect with innovative companies looking great talent quickly and cost-effectively.",
      responsibilities: [
        "Creating user-centered designs by understanding business requirements, and user feedback",
        "Creating user flows, wireframes, prototypes and mockups",
        "Translating requirements into style guides, design systems, design patterns and attractive user interfaces",
        "Designing UI elements such as input controls, navigational components and informational components"
      ]
    },
    {
      id: 2,
      title: "Product Manager", 
      company: "Praxis",
      location: "Remote",
      timePosted: "2 hours ago",
      applicants: "324 applicants",
      salary: "$90,000 - $130,000 / Yearly",
      employees: "50-100 employees",
      type: "Full Time",
      level: "Junior Level",
      isRemote: true,
      logo: "📱",
      description: "Join our dynamic team to build the next generation of products that will transform how people work and collaborate."
    },
    {
      id: 3,
      title: "UI Designer",
      company: "Design Pro LLC - Telegram Messenger Inc.",
      location: "San Francisco",
      timePosted: "3 hours ago",
      applicants: "156 applicants",
      salary: "$70,000 - $95,000 / Yearly", 
      employees: "100+ employees",
      type: "Part Time",
      level: "Senior Level",
      isRemote: false,
      logo: "🎨",
      description: "Create beautiful and intuitive user interfaces for our messaging platform used by millions worldwide."
    },
    {
      id: 4,
      title: "Marketing Manager",
      company: "Praxis Inc",
      location: "Remote",
      timePosted: "4 hours ago",
      applicants: "89 applicants",
      salary: "$60,000 - $85,000 / Yearly",
      employees: "20-50 employees", 
      type: "Full Time",
      level: "Junior Level",
      isRemote: true,
      logo: "📊",
      description: "Lead marketing initiatives and drive growth through innovative campaigns and strategies."
    }
  ];

  const currentJob = jobs[selectedJob];

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={location}
        setLocation={setLocation}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <JobList jobs={jobs} selectedJob={selectedJob} setSelectedJob={setSelectedJob} />
          <JobDetails job={currentJob} />
        </div>
      </div>
      <BottomCTA />
    </div>
  );
}