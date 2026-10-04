interface Experience {
  company: string;
  shortName?: string;
  companyUrl: string;
  position: string;
  duration: string;
}

// Details live in the resume; the homepage shows one row per job.
export const experiences: Experience[] = [
  {
    company: "Measure Protocol",
    companyUrl: "https://measureprotocol.com",
    position: "Software Engineer",
    duration: "Apr 2024 - Present",
  },
  {
    company: "SJSU International House",
    companyUrl: "https://www.sjsu.edu/ihouse/",
    position: "Resident Advisor",
    duration: "Aug 2022 - Dec 2023",
  },
  {
    company: "Triassic Solutions Pvt. Ltd",
    shortName: "Triassic Solutions",
    companyUrl: "https://www.linkedin.com/company/triassicsolutions/",
    position: "Software Engineer",
    duration: "Jul 2019 - Feb 2021",
  },
];
