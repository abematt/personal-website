interface Project {
  link: string;
  repo: string;
  website: string;
  description: string;
  media: {
    type: "image" | "gif" | "video";
    src: string;
    alt: string;
    poster?: string;
  };
}

export const projectData: Project[] = [
  {
    link: "https://github.com/abematt/youtube-analysis",
    repo: "Youtube Analysis",
    website: "",
    description: "A web application using HuggingFace.js to detect,analyze and classify sentiment of youtube videos",
    media: {
      type: "gif",
      src: "/assets/youtubesentiment.gif",
      alt: "Youtube Analysis demo",
    },
  },
  {
    link: "https://github.com/abematt/job-tracker-v2",
    repo: "Job Tracker",
    website: "",
    description: "App created in React,Express & MongoDB to track job applications",
    media: {
      type: "gif",
      src: "/assets/jobtrackergif.gif",
      alt: "Job Tracker demo",
      poster: "/projects/job-tracker-poster.jpg",
    },
  },
  {
    link: "https://github.com/abematt/CMPE-259-NLP-Final-Project-Presentation",
    repo: "Few Shot Learning with Atlas",
    website: "https://quiet-bubblegum-a79bb1.netlify.app",
    description:
      "Finetuning Atlas models with custom dataset and parameter tuning for improved NLP performance with limited training examples.",
    media: {
      type: "video",
      src: "/assets/fewshot.webm",
      alt: "Few Shot Learning with Atlas Models",
    },
  },
  {
    link: "https://github.com/abematt/272---HVAC-AnoML-Presentation",
    repo: "HVAC AnoML",
    website: "https://majestic-syrniki-4d8693.netlify.app/",
    description: "Presentation for CMPE 272 class created in React",
    media: {
      type: "video",
      src: "/assets/hvac.webm",
      alt: "ML project for anomaly detection in HVAC systems",
    },
  },
]; 