"use client";

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
import jobtrackergif from "@/components/data/assets/jobtrackergif.gif"

interface Project {
  link: string;
  repo: string;
  website: string;
  description: string;
  language: string;
  languageColor: string;
  thumbnail: any; // Added thumbnail property
  tags: string[]; // Added tags property
}

// Updated data with thumbnails and tags
export const projectData: Project[] = [
  {
    link: "https://github.com/abematt/youtube-analysis",
    repo: "Youtube Analysis",
    website: "",
    description: "A web application using HuggingFace.js to detect, analyze and classify sentiment of YouTube videos. Built with React and Node.js backend.",
    language: "Hugging.js",
    languageColor: "#fde047",
    thumbnail: "/api/placeholder/400/250",
    tags: ["Sentiment Analysis", "NLP", "React", "Node.js"]
  },
  {
    link: "https://github.com/abematt/job-tracker-v2",
    repo: "Job Tracker",
    website: "",
    description: "App created in React, Express & MongoDB to track job applications. Features include resume parsing, interview scheduling, and application status tracking.",
    language: "Next.js",
    languageColor: "#4ade80",
    thumbnail:jobtrackergif,
    tags: ["Next.js", "MongoDB", "Resume Parsing", "Job Search"]
  },
  {
    link: "https://github.com/abematt/CMPE-259-NLP-Final-Project-Presentation",
    repo: "Few Shot Learning with Atlas Models",
    website: "https://quiet-bubblegum-a79bb1.netlify.app",
    description: "Finetuning Atlas models with custom dataset and parameter tuning for improved NLP performance with limited training examples.",
    language: "Python",
    languageColor: "#0ea5e9",
    thumbnail: "/api/placeholder/400/250",
    tags: ["NLP", "Few-Shot Learning", "Atlas Models", "Python"]
  },
  {
    link: "https://github.com/abematt/272---HVAC-AnoML-Presentation",
    repo: "HVAC AnoML",
    website: "https://majestic-syrniki-4d8693.netlify.app/",
    description: "ML project for anomaly detection in HVAC systems. Uses time-series data to predict equipment failures before they occur.",
    language: "React",
    languageColor: "#4ade80",
    thumbnail: "/api/placeholder/400/250",
    tags: ["ML", "Anomaly Detection", "Time Series", "React"]
  },
];

export function Projects() {
  return (
    <>
      {projectData.map((project, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card
            className="border-zinc-800 bg-zinc-900/30 flex flex-col justify-between transition-all duration-300 ease-out hover:scale-105 hover:bg-zinc-900/50 hover:shadow-xl h-full overflow-hidden group"
          >
            {/* Thumbnail Section */}
            <div className="w-full relative overflow-hidden">
              <img
                src={project.thumbnail}
                alt={`${project.repo} thumbnail`}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/90 opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            
            <CardHeader className="relative z-10 mt-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-zinc-400 group-hover:text-zinc-100 transition-colors duration-200" />
                  <a
                    target="_blank"
                    href={project.link}
                    rel="noopener noreferrer"
                    aria-label={project.repo}
                  >
                    <CardTitle className="text-base hover:underline hover:text-blue-400 transition-colors duration-200">
                      {project.repo}
                    </CardTitle>
                  </a>
                </div>
                <a
                  target="_blank"
                  href={project.website || project.link}
                  rel="noopener noreferrer"
                  aria-label="Visit project's live url or repo"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
              <CardDescription className="text-sm font-light mt-3 text-zinc-400 group-hover:text-zinc-300 transition-colors duration-200">
                {project.description}
              </CardDescription>
            </CardHeader>
            
            <CardFooter className="flex flex-col items-start gap-3 pb-4">
              {/* Language Badge */}
              <Badge
                className="text-xs px-2 py-1 font-medium transition-all duration-300 group-hover:shadow-glow"
                style={{
                  backgroundColor: `${project.languageColor}20`, // 20% opacity of the language color
                  color: project.languageColor,
                  border: `1px solid ${project.languageColor}40`, // 40% opacity border
                }}
              >
                {project.language}
              </Badge>
              
              {/* Tags Section */}
              <div className="flex flex-wrap gap-2 mt-1">
                {project.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="text-xs px-2 py-1 rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/50 group-hover:bg-zinc-700/80 group-hover:text-zinc-300 transition-colors duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </>
  );
}