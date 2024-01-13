import Image from "next/image";
import { Projects } from "@/components/sections/projects";

export default function Home() {
  return (
    <main className="py-4">
      <section className="space-y-4 py-4">
        <p className="font-light text-muted-foreground">Hi!</p>
        <p className="font-light">
          I&apos;m a driven software engineer, continuously expanding my
          expertise across full-stack development and emerging tech like AI/ML.
        </p>
        <p className="font-light">
          I thrive collaborating cross-culturally and cross-domain while taking
          ownership of impactful projects.
        </p>
        <p className="font-light">
          My main tech stack is <span className="font-semibold">Python</span>,{" "}
          <span className="font-semibold">React</span>, and{" "}
          <span className="font-semibold">Javascript</span>.
        </p>
      </section>
      <section className="space-y-4 py-4">
        <div>
          <h1 className="text-lg font-semibold">Projects</h1>
            <h2 className="font-light text-zinc-500 dark:text-zinc-400">
              List of projects I&apos;ve worked on as part of course work and personal projects
            </h2>
        </div>
        {/* <HeadingText>Projects</HeadingText> */}
        <div className="flex flex-col items-end gap-4">
          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
            <Projects />
          </div>
        </div>
      </section>
    </main>
  );
}
