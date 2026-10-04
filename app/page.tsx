import Link from "next/link";
import { heroData } from "@/components/data/hero";
import { projectData } from "@/components/data/projects";
import { experiences } from "@/components/data/experience";
import { ContributionGraph } from "@/components/contribution-graph";
import { ProjectLogo } from "@/components/project-logo";
import { getContributions } from "@/lib/github";
import { getPosts } from "@/lib/notion-posts";

export const revalidate = 300;

// "Apr 2024 - Present" -> "2024 – now"
function yearRange(duration: string) {
  const [start, end] = duration.split(" - ");
  const startYear = start.match(/\d{4}/)?.[0];
  const endYear = end === "Present" ? "now" : end?.match(/\d{4}/)?.[0];
  return `${startYear} – ${endYear}`;
}

function formatPostDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

const rowClass = "flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-zinc-900 py-2.5";
const dateClass = "font-mono text-[13px] text-zinc-400";

export default async function Home() {
  const [contributions, posts] = await Promise.all([
    getContributions(heroData.githubLogin),
    getPosts().catch((error) => {
      console.error("Error fetching posts:", error);
      return [];
    }),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-[600px] flex-col gap-16 pb-20 pt-12 text-[15px] leading-relaxed md:pt-20">
      <header className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-[13px] font-medium text-zinc-400">
            {heroData.initials}
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">{heroData.name}</h1>
            <p className="text-sm text-zinc-400">
              {heroData.role} · {heroData.location}
            </p>
          </div>
        </div>
        <p className="text-zinc-300 [text-wrap:pretty]">
          I build full-stack web apps and AI tools at{" "}
          <a
            href="https://measureprotocol.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-zinc-700 text-zinc-100 transition-colors hover:border-zinc-400"
          >
            Measure Protocol
          </a>
          , mostly in React and Python. Off the keyboard I read, run, and take photos on my phone.
        </p>
        <nav aria-label="Links" className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
          {heroData.links.map((link) =>
            link.external || !link.href.startsWith("/") ? (
              <a
                key={link.label}
                href={link.href}
                {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                className="text-zinc-400 transition-colors hover:text-zinc-100"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-zinc-400 transition-colors hover:text-zinc-100"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>
      </header>

      {contributions && (
        <section>
          <ContributionGraph contributions={contributions} />
        </section>
      )}

      <section className="flex flex-col gap-3.5">
        <h2 className="text-sm font-medium text-zinc-400">Projects</h2>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {projectData.map((project) => (
            <a
              key={project.name}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3.5 rounded-xl border border-zinc-900 bg-[#111114] p-4 transition-colors hover:border-zinc-700"
            >
              <ProjectLogo name={project.logo} hue={project.hue} />
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-zinc-100">{project.name}</span>
                <span className="text-sm leading-snug text-zinc-400">{project.tagline}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3.5">
        <h2 className="text-sm font-medium text-zinc-400">Work</h2>
        <div>
          {experiences.map((job) => (
            <div key={job.company} className={rowClass}>
              <span>
                {job.position},{" "}
                <a
                  href={job.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 transition-colors hover:text-zinc-100"
                >
                  {job.shortName ?? job.company}
                </a>
              </span>
              <span className={dateClass}>{yearRange(job.duration)}</span>
            </div>
          ))}
        </div>
      </section>

      {posts.length > 0 && (
        <section className="flex flex-col gap-3.5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium text-zinc-400">Writing</h2>
            <Link href="/blog" className="text-[13px] text-zinc-400 transition-colors hover:text-zinc-100">
              All posts →
            </Link>
          </div>
          <div>
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className={`${rowClass} transition-colors hover:text-white`}
              >
                <span>{post.title}</span>
                {post.date && (
                  <time dateTime={post.date} className={dateClass}>
                    {formatPostDate(post.date)}
                  </time>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
