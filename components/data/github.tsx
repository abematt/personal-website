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
    link: "https://github.com/abematt/job-tracker-v2",
    repo: "Job Tracker",
    website: "https://job-tracker-v2.netlify.app/",
    description: "App created in React,Express & MongoDB to track job applications",
    language: "Next.js",
    languageColor: "#4ade80",
  },
  {
    link: "https://github.com/abematt/CMPE-259-NLP-Final-Project-Presentation",
    repo: "Few Shot Learning with Atlas Models",
    website: "https://quiet-bubblegum-a79bb1.netlify.app",
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
