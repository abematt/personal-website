"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink, Github } from "lucide-react";

interface Project {
  link: string;
  repo: string;
  website: string;
  description: string;
  language: string;
  languageColor: string;
}

// Mock data - you can replace this with your actual data later
export const projectData: Project[] = [
  {
    link: "https://github.com/abematt/youtube-analysis",
    repo: "Youtube Analysis",
    website: "",
    description: "A web application using HuggingFace.js to detect, analyze and classify sentiment of YouTube videos. Built with React and Node.js backend.",
    language: "Hugging.js",
    languageColor: "#fde047",
  },
  {
    link: "https://github.com/abematt/job-tracker-v2",
    repo: "Job Tracker",
    website: "",
    description: "App created in React, Express & MongoDB to track job applications. Features include resume parsing, interview scheduling, and application status tracking.",
    language: "Next.js",
    languageColor: "#4ade80",
  },
  {
    link: "https://github.com/abematt/CMPE-259-NLP-Final-Project-Presentation",
    repo: "Few Shot Learning with Atlas Models",
    website: "https://quiet-bubblegum-a79bb1.netlify.app",
    description: "Finetuning Atlas models with custom dataset and parameter tuning for improved NLP performance with limited training examples.",
    language: "Python",
    languageColor: "#0ea5e9"
  },
  {
    link: "https://github.com/abematt/272---HVAC-AnoML-Presentation",
    repo: "HVAC AnoML",
    website: "https://majestic-syrniki-4d8693.netlify.app/",
    description: "ML project for anomaly detection in HVAC systems. Uses time-series data to predict equipment failures before they occur.",
    language: "React",
    languageColor: "#4ade80",
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
            className="border-zinc-800 bg-zinc-900/30 flex flex-col justify-between transition-all duration-300 ease-out hover:scale-102 hover:bg-zinc-900/50 hover:shadow-lg h-full"
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-zinc-400" />
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
              <CardDescription className="text-sm font-light mt-3 text-zinc-400">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0">
              <Badge
                className="text-xs px-2 py-1 font-medium"
                style={{
                  backgroundColor: `${project.languageColor}20`, // 20% opacity of the language color
                  color: project.languageColor,
                  border: `1px solid ${project.languageColor}40` // 40% opacity border
                }}
              >
                {project.language}
              </Badge>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </>
  );
}