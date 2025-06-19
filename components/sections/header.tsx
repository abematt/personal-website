"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Github, Linkedin, FileDown, BookOpen } from "lucide-react";

export default function Navbar() {
  const resumeLink = `https://drive.google.com/uc?export=download&id=1xZub7bbE27EY-3VFCXyOJZEZttnCSo2w`;
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile on initial render and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on mount
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  const socialLinks = [
    {
      icon: <Github className="w-5 h-5" />,
      url: "https://github.com/abematt",
      tooltip: "GitHub"
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      url: "https://www.linkedin.com/in/abe-mathew-se/",
      tooltip: "LinkedIn"
    }
  ];

  return (
    <nav className="py-4 mb-8">
      <div className="flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <a href="/" className="font-semibold text-xl">
            {isMobile ? "AM" : "abrahammathew.com"}
          </a>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-3 md:space-x-4"
        >
          {/* Blog Link */}
          {isMobile ? (
            <a 
              href="/blog"
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
            </a>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href="/blog"
                    className="text-zinc-400 hover:text-zinc-200 transition-colors font-medium"
                  >
                    Blog
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Blog</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {/* Divider for visual separation */}
          <div className="hidden md:block w-px h-4 bg-zinc-600"></div>
          
          {socialLinks.map((link, index) => (
            isMobile ? (
              <a 
                key={index}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {link.icon}
              </a>
            ) : (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      {link.icon}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{link.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          ))}
          
          {isMobile ? (
            <a 
              href={resumeLink} 
              download="Abraham_Mathew_Resume" 
              target="_blank"
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <FileDown className="w-5 h-5" />
            </a>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href={resumeLink} 
                    download="Abraham_Mathew_Resume" 
                    target="_blank"
                    className="text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <FileDown className="w-5 h-5" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download Resume</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </motion.div>
      </div>
    </nav>
  );
}