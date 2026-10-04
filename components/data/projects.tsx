import type { ProjectLogoName } from "@/components/project-logo";

interface Project {
  name: string;
  link: string;
  tagline: string;
  logo: ProjectLogoName;
  hue: number;
}

export const projectData: Project[] = [
  {
    name: "Claude Chat Status",
    link: "https://github.com/abematt/claude-chat-status",
    tagline: "Menu bar app that shows what every Claude Code chat is doing",
    logo: "chat",
    hue: 45,
  },
  {
    name: "Aladí Catalogue",
    link: "https://aladi.apps.abrahammathew.com",
    tagline: "Every English and Italian book in Barcelona's libraries, updated weekly",
    logo: "book",
    hue: 190,
  },
  {
    name: "Movie Chain",
    link: "https://github.com/abematt/movie-chain",
    tagline: "iOS game linking films through shared actors. In progress",
    logo: "film",
    hue: 320,
  },
];
