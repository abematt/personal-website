interface HeroLink {
  label: string;
  href: string;
  external?: boolean;
}

interface HeroContent {
  name: string;
  initials: string;
  role: string;
  location: string;
  githubLogin: string;
  links: HeroLink[];
}

export const heroData: HeroContent = {
  name: "Abraham Mathew",
  initials: "AM",
  role: "Software Engineer",
  location: "Barcelona",
  githubLogin: "abematt",
  links: [
    { label: "GitHub", href: "https://github.com/abematt", external: true },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/abe-mathew-se/", external: true },
    { label: "Email", href: "mailto:abrahammathew.contact@gmail.com" },
    {
      label: "Resume",
      href: "/resume.pdf",
      external: true,
    },
    { label: "Blog", href: "/blog" },
    { label: "Photos", href: "https://www.instagram.com/light.onstuff/", external: true },
  ],
};
