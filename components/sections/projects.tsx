"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { projectData } from "@/components/data/projects";
import { highlightTechTerms } from "@/components/utils/highlight-tech";

export function Projects() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Initialize video refs array based on project data length
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, projectData.length);
  }, []);

  // Play all videos when component mounts
  useEffect(() => {
    videoRefs.current.forEach(video => {
      if (video) {
        video.play().catch(e => {
          // Autoplay was prevented, we'll rely on the hover handler
          console.log("Autoplay prevented:", e);
        });
      }
    });
  }, []);

  return (
    <>
      {projectData.map((project, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex flex-col h-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30 transition-colors hover:bg-zinc-800/60 hover:border-zinc-700"
          onMouseEnter={() => setHoveredProject(index)}
          onMouseLeave={() => setHoveredProject(null)}
        >
          <div className="flex flex-col h-full">
            <div className="relative aspect-video overflow-hidden">
              {project.media.type === "image" && (
                <Image
                  src={project.media.src}
                  alt={project.media.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}

              {project.media.type === "gif" && (
                <Image
                  src={project.media.src}
                  alt={project.media.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized // Important for GIFs to animate
                />
              )}

              {project.media.type === "video" && (
                <video
                  ref={el => videoRefs.current[index] = el}
                  src={project.media.src}
                  poster={project.media.poster}
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>

            <div className="flex flex-col flex-grow p-4">
              <h3 className="text-lg font-medium text-zinc-200 mb-2 flex items-start">
                {project.repo}
              </h3>
              <p className="text-sm text-zinc-400 mb-4 flex-grow min-h-[80px]">
                {highlightTechTerms(project.description)}
              </p>

              <div className="flex items-center space-x-4 pt-4 mt-auto">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="View GitHub Repository"
                >
                  <Github className="w-4 h-4" />
                  <span className="text-xs">GitHub</span>
                </a>

                {project.website && (
                  <a
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="View Live Website"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-xs">Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
}
