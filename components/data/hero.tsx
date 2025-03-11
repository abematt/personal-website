interface HeroContent {
  greeting: string;
  tagline: string;
  bio: string[];
  hobbies: {
    text: string;
    emoji: string;
  }[];
  socialLinks: {
    platform: string;
    username: string;
    link: string;
    emoji: string;
    description: string;
  }[];
  interests: string;
}

export const heroData: HeroContent = {
  greeting: "Hi, I'm Abraham 👋",
  tagline: "A Software engineer who enjoys building things and collaborating across different domains.",
  bio: [
    "Ever since I made my first quiz game in C++ as a kid, I haven't looked back. I graduated with a Master's Degree in Software Engineering from San Jose State University in 2023. With about 3+ years of work experience, I'm always looking to learn new ways to build and problems to solve!",
    "I have a keen interest in AI/ML and am always evolving my full-stack expertise. My specialties are React and Python, but I'm comfortable across the entire stack.",
  ],
  hobbies: [
    { text: "reading", emoji: "📚" },
    { text: "running", emoji: "🏃‍♂️" },
    { text: "photography", emoji: "📸" }
  ],
  socialLinks: [
    {
      platform: "You can check out some my recent mobile photography here",
      username: "light.onstuff",
      link: "https://www.instagram.com/light.onstuff/",
      emoji: "📸",
      description: "Mobile photography"
    }
  ],
  interests: "AI/ML, Full-stack development, Cloud architecture"
}; 