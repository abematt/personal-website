"use client";
import { Projects } from "@/components/sections/projects";
import { WorkExperience } from "@/components/sections/work-experience";
import { useRef } from "react";
import { motion } from "framer-motion";
import { heroData } from "@/components/data/hero";
import { highlightTechTerms } from "@/components/utils/highlight-tech";
import React from "react";

export default function Home() {
  const projectSectionRef = useRef<HTMLDivElement | null>(null);
  const experienceSectionRef = useRef<HTMLDivElement | null>(null);

  // Handle button click to scroll to sections
  const handleScrollToProjects = () => {
    if (projectSectionRef.current) {
      projectSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToExperience = () => {
    if (experienceSectionRef.current) {
      experienceSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="space-y-16">
      {/* Hero Section */}
      <section className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-6">{heroData.greeting}</h1>
          <div className="space-y-4 text-lg text-zinc-400">
            <p>{heroData.tagline}</p>
            
            {heroData.bio.map((paragraph, index) => (
              <p key={index}>{highlightTechTerms(paragraph)}</p>
            ))}
            
            {/* Hobbies section with emojis */}
            <div className="flex flex-wrap items-center gap-2 text-sm md:text-base">
              <span>In my free time, I enjoy</span>
              <div className="flex flex-wrap gap-2">
                {heroData.hobbies.map((hobby, index) => (
                  <span key={index} className="inline-flex items-center">
                    <span className="mr-1">{hobby.emoji}</span>
                    <span>{hobby.text}</span>
                    {index < heroData.hobbies.length - 1 && <span>,</span>}
                    {index === heroData.hobbies.length - 2 && <span> and</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-4 items-center mt-2">
              {heroData.socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 py-1.5 rounded-full transition-colors text-sm"
                >
                  <span className="">You can check out some of my mobile photography here:</span>
                  <span className="text-blue-400">@{social.username}</span>
                </a>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={handleScrollToExperience}
                className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm md:text-base transition-colors"
              >
                See Experience
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
              <button
                onClick={handleScrollToProjects}
                className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-200 text-sm md:text-base transition-colors"
              >
                See Projects
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Experience section */}
      <section ref={experienceSectionRef} className="pt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Work Experience</h2>
          <p className="font-light text-zinc-500 dark:text-zinc-400">
          </p>
        </div>
        <WorkExperience />
      </section>

      {/* Project section */}
      <section ref={projectSectionRef} className="pt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Projects</h2>
          <p className="font-light text-zinc-500 dark:text-zinc-400">
            A list of projects I&apos;ve worked on through coursework and personal initiatives
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <Projects />
        </div>
      </section>
    </main>
  );
}