"use client";

import { motion } from "framer-motion";

interface Experience {
  company: string;
  logo: string;
  position: string;
  duration: string;
  location: string;
  achievements: string[];
}

const experiences: Experience[] = [
    {
      company: "Measure Protocol",
      logo: "📊",
      position: "Software Engineer",
      duration: "Apr 2024 - Present",
      location: "Austin, TX, USA",
      achievements: [
        "Dockerized 5 products, reducing developer setup time from one week to one day and improving onboarding efficiency",
        "Led the design and development of an OpenAI API-powered data entry automation tool using MUI DataGrid, Next.js, and TanStack Query, increasing QA efficiency by 85%",
        "Spearheaded the migration of a mobile app with 40,000 users to a full-stack web app using Next.js, SWR, shadcn/ui, and iron-session, reducing user acquisition costs and improving performance",
        "Developed an internal tool using SWR, Next.js, and shadcn/ui to automate user count tracking, reducing communication delays and improving reporting accuracy across departments"
      ]
    },
    {
      company: "SJSU International House",
      logo: "🏢",
      position: "Network Administrator / Resident Advisor",
      duration: "Aug 2022 - Dec 2023",
      location: "San Jose, CA, USA",
      achievements: [
        "Led community building initiatives for 60+ residents from 25+ countries",
        "Partnered with SJSU IT department to redesign the server room for quicker network issue resolution",
        "Managed $4,000 technology fund obtained through partnership with Rotary fund to purchase equipment"
      ]
    },
    {
      company: "Triassic Solutions Pvt. Ltd",
      logo: "💻",
      position: "Software Engineer",
      duration: "Jul 2019 - Feb 2021",
      location: "Thiruvananthapuram, Kerala, India",
      achievements: [
        "Handpicked out of 23 internal candidates to be part of a 6-person Machine Learning team",
        "Built a proof of concept application using AWS Textract, Amazon Medical Comprehend, SQS, SNS, Lambda, and S3 to reduce MRI report parse time by 80%, securing a client contract",
        "Designed scalable REST APIs framework with Django for Delivery service with 50+ vendors and hundreds of daily orders (Agile Development Cycle)",
        "Developed HIPAA-compliant web application to aid in diagnosis for medical professionals",
        "Implemented scalable asynchronous order processing with Celery to handle large CSV batches, replacing manual entry"
      ]
    }
  ];
export function WorkExperience() {
  return (
    <div className="space-y-8">
      {experiences.map((exp, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded bg-zinc-800 mr-4">
              <span className="text-2xl">{exp.logo}</span>
            </div>
            <div>
              <h3 className="text-xl font-medium text-zinc-200">{exp.position} @ <span className="text-blue-400">{exp.company}</span></h3>
              <p className="text-sm text-zinc-400">{exp.duration} • {exp.location}</p>
            </div>
          </div>
          
          <ul className="space-y-2 text-zinc-400">
            {exp.achievements.map((achievement, i) => (
              <li key={i} className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {achievement}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}