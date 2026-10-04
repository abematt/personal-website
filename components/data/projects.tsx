import type { ProjectLogoName } from "@/components/project-logo";

interface Project {
  name: string;
  github?: string;
  site?: string;
  tagline: string;
  logo: ProjectLogoName;
  hue: number;
}

export const projectData: Project[] = [
  {
    name: "Claude Chat Status",
    github: "https://github.com/abematt/claude-chat-status",
    tagline: "Menu bar app showing what each Claude Code chat is doing",
    logo: "chat",
    hue: 45,
  },
  {
    name: "Aladí Catalogue",
    site: "https://aladi.apps.abrahammathew.com",
    github: "https://github.com/abematt/aladi-catalogue",
    tagline: "Every English and Italian book in Barcelona's libraries",
    logo: "book",
    hue: 190,
  },
  {
    name: "Movie Chain",
    github: "https://github.com/abematt/movie-chain",
    tagline: "iOS game linking films through shared actors, in progress",
    logo: "film",
    hue: 320,
  },
];
