import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import JobList from "../components/JobList";
import JobDetails from "../components/JobDetails";
import BottomCTA from "../components/BottomCTA";
import { useOffer } from "../shared/hooks/useWOffer";

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const { offers, getWOffers } = useOffer();
  console.log(offers);

  useEffect(() => {
    getWOffers();
  }, []);

  const currentJob = offers[selectedJob];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={location}
        setLocation={setLocation}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <JobList
            jobs={offers}
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
          />
          <JobDetails job={currentJob} />
        </div>
      </div>
      <BottomCTA />
    </div>
  );
}
