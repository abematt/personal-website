interface Experience {
  company: string;
  companyUrl: string;
  logo: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  achievements: string[];
}

export const experiences: Experience[] = [
  {
    company: "Measure Protocol",
    companyUrl: "https://measureprotocol.com",
    logo: "📊",
    position: "Software Engineer",
    duration: "Apr 2024 - Present",
    location: "Austin, TX, USA",
    description:
      "Rapidly prototyping web application features for improving user experience and improve user retention. Intermittently developing internal apps to improve productivity",
    achievements: [
      "Spearheaded the migration of a mobile app with 40,000 users to a full-stack web app using Next.js, SWR, shadcn/ui, and iron-session, reducing user acquisition costs and improving performance",
      "Engineered real-time logging and monitoring system using Winston and AWS CloudWatch for full-stack application in production, enabling status tracking, event logging, and automated alerts for optimal user experience",
      "Created end-to-end tests for application using Playwright and automated using Github actions",
      "Dockerized 5 products, reducing developer setup time from one week to one day and improving onboarding efficiency",
      "Led the design and development of an OpenAI API-powered data entry automation tool using MUI DataGrid, Next.js, and TanStack Query, increasing QA efficiency by 85%",
      "Developed an internal tool using SWR, Next.js, and shadcn/ui to automate user count tracking, reducing communication delays and improving reporting accuracy across departments",
    ],
  },
  {
    company: "SJSU International House",
    companyUrl: "https://www.sjsu.edu/ihouse/",
    logo: "🏢",
    position: "Resident Advisor",
    duration: "Aug 2022 - Dec 2023",
    location: "San Jose, CA, USA",
    description:
      "Working part-time as a Master's student gaining experience in multi-cultural leadership and problem solving",
    achievements: [
      "Led community building initiatives for 60+ residents from 25+ countries",
      "Partnered with SJSU IT department to redesign the server room for quicker network issue resolution",
      "Managed $4,000 technology fund obtained through partnership with Rotary fund to purchase equipment",
    ],
  },
  {
    company: "Triassic Solutions Pvt. Ltd",
    companyUrl: "https://www.linkedin.com/company/triassicsolutions/",
    logo: "💻",
    position: "Software Engineer",
    duration: "Jul 2019 - Feb 2021",
    location: "Thiruvananthapuram, Kerala, India",
    description:
      "Backend engineer working mainly with python and django for multiple web applications in various domains.",
    achievements: [
      "Handpicked out of 23 internal candidates to be part of a 6-person Machine Learning team",
      "Built a proof of concept application using AWS Textract, Amazon Medical Comprehend, SQS, SNS, Lambda, and S3 to reduce MRI report parse time by 80%, securing a client contract",
      "Designed scalable REST APIs framework with Django for Delivery service with 50+ vendors and hundreds of daily orders (Agile Development Cycle)",
      "Developed HIPAA-compliant web application to aid in diagnosis for medical professionals",
      "Implemented scalable asynchronous order processing with Celery to handle large CSV batches, replacing manual entry",
    ],
  },
]; 