interface Project {
  link: string;
  repo: string;
  website: string;
  description: string;
  language: string;
  languageColor: string;
}

export const data: Project[] = [
  {
    link: "https://github.com/abematt/youtube-analysis",
    repo: "Youtube Analysis",
    website: " https://main--effervescent-bombolone-b2ac4f.netlify.app/",
    description: "A web application using HuggingFace.js to detect,analyze and classify sentiment of youtube videos",
    language: "Hugging.js",
    languageColor: "#fde047",
  },
  {
    link: "https://github.com/abematt/Job-Application-Tracker",
    repo: "Job Tracker",
    website: "",
    description: "App created in Next.js with MongoDB to track job applications",
    language: "Next.js",
    languageColor: "#4ade80",
  },
  {
    link: "",
    repo: "Few Shot Learning with Atlas Models",
    website: "",
    description: "Finetuning Atlas models with custom dataset and parameter tuning",
    language: "Python",
    languageColor: "#0ea5e9"
  },
  {
    link: "https://github.com/abematt/272---HVAC-AnoML-Presentation",
    repo: "HVAC AnoML Presentation",
    website: "https://majestic-syrniki-4d8693.netlify.app/",
    description: "Presentation for CMPE 272 class created in React",
    language: "React",
    languageColor: "#4ade80",
  },
];
