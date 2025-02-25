"use client";
import { Projects } from "@/components/sections/projects";
import { WorkExperience } from "@/components/sections/work-experience";
import { useRef } from "react";
import { motion } from "framer-motion";

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
          <h1 className="text-5xl font-bold mb-6">Hi, I'm Abraham 👋</h1>
          <div className="space-y-4 text-lg text-zinc-400">
            <p>
              Software Engineer. I enjoy building things and collaborating across different domains
            </p>
            <p>
              Ever since I made my first quiz game in C as a kid, I haven't looked back. 
              I graduated with a Master's Degree in Software Engineering from San Jose State University in 2023.
              With about 3+ years of experience working as a Software Engineer, I'm always looking to learn new ways to build and problems to solve!
            </p>
            <p>
              I have a keen interest in AI/ML and am always evolving my full-stack expertise.
              My specialties are React and Python, but I'm comfortable across the entire stack.
            </p>
            <div className="pt-4">
              <button 
                onClick={handleScrollToExperience}
                className="text-blue-500 hover:text-blue-400 font-medium mr-6"
              >
                View Experience →
              </button>
              <button 
                onClick={handleScrollToProjects}
                className="text-blue-500 hover:text-blue-400 font-medium"
              >
                See Projects →
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
            I switch a lot of companies. It's mostly about the culture.
          </p>
        </div>
        <WorkExperience />
      </section>

      {/* Project section */}
      <section ref={projectSectionRef} className="pt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Projects</h2>
          <p className="font-light text-zinc-500 dark:text-zinc-400">
            A list of projects I've worked on through coursework and personal initiatives
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <Projects />
        </div>
      </section>
    </main>
  );
}