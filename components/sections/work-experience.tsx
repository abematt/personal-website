"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experiences } from "@/components/data/experience";
import { highlightTechTerms } from "@/components/utils/highlight-tech";

export function WorkExperience() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {experiences.map((exp, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`border rounded-xl p-6 transition-all duration-300 relative ${
            expanded === index
              ? "border-blue-500 bg-zinc-800/90 shadow-lg shadow-blue-500/10"
              : hovered === index
              ? "border-zinc-700 bg-zinc-800/60 shadow-md"
              : "border-zinc-800 bg-zinc-900/30"
          }`}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-lg mr-4 transition-colors duration-300 ${
                  expanded === index || hovered === index
                    ? "bg-blue-500/20"
                    : "bg-zinc-800"
                }`}
              >
                <span className="text-2xl">{exp.logo}</span>
              </div>
              <div>
                <h3 className="text-xl font-medium text-zinc-100">
                  {exp.position} <span className="text-zinc-400">@</span>{" "}
                  <a
                    href={exp.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`hover:text-blue-300 transition-colors ${
                      expanded === index || hovered === index
                        ? "text-blue-400"
                        : "text-zinc-300"
                    }`}
                  >
                    {exp.company}
                  </a>
                </h3>
                <p className="text-sm text-zinc-400">
                  {exp.duration} • {exp.location}
                </p>
              </div>
            </div>
            <button
              onClick={() => setExpanded(expanded === index ? null : index)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                expanded === index
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300"
              }`}
              aria-label={expanded === index ? "Minimize" : "Maximize"}
            >
              {expanded === index ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="4 14 10 14 10 20"></polyline>
                  <polyline points="20 10 14 10 14 4"></polyline>
                  <line x1="14" y1="10" x2="21" y2="3"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              )}
            </button>
          </div>

          <AnimatePresence>
            {expanded === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  transition: {
                    opacity: { duration: 0.3 },
                    height: { duration: 0.4 },
                  },
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  transition: {
                    opacity: { duration: 0.2 },
                    height: { duration: 0.3 },
                  },
                }}
              >
                <p className="mb-4 text-zinc-300 italic text-sm">
                  {highlightTechTerms(exp.description)}
                </p>

                <ul className="space-y-3">
                  {exp.achievements.map((achievement, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="flex items-start group"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-blue-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-zinc-300">{highlightTechTerms(achievement)}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
