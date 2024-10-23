"use client";
import { Projects } from "@/components/sections/projects";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/magnetic-button";

export default function Home() {
  const [isTextAnimationDone, setIsTextAnimationDone] = useState(false);
  const projectSectionRef = useRef<HTMLDivElement | null>(null); // Specify the type as HTMLDivElement

  // Split the intro text into multiple text blocks
  const introTextBlocks = [
    "Hi! I'm a Software Engineer currently based in San Francisco, CA.",
    "I'm always evolving my full-stack expertise and have a keen interest in AI/ML.",
    "I love taking ownership of projects that make an impact.",
    "My specialties are React and Python.",
  ];

  // Handle button click to scroll to the projects section
  const handleScrollToProjects = () => {
    if (projectSectionRef.current) {
      projectSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="space-y-12">
      <section className="text-left py-8">
        {/* Pass the introTextBlocks array to the TextGenerateEffect component */}
        <TextGenerateEffect
          textBlocks={introTextBlocks}
          onComplete={() => setIsTextAnimationDone(true)} // Trigger when text animation is done
        />

        {/* Show the button after the text animation is done
        {isTextAnimationDone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mt-8"
          >
            <MagneticButton onClick={handleScrollToProjects} />
          </motion.div>
        )} */}
      </section>

      {/* Project section to scroll to */}
      <section ref={projectSectionRef} className="">
        <div className="">
          <h1 className="text-lg font-semibold">Projects</h1>
          <h2 className="font-light text-zinc-500 dark:text-zinc-400">
            A list of projects I&apos;ve worked on through coursework and
            personal initiatives
          </h2>
        </div>
        <div className="flex items-center space-y-6 py-6">
          <div className="flex flex-col items-end gap-4">
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
              <Projects />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
