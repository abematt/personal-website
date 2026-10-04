import Link from "next/link";
import { heroData } from "@/components/data/hero";
import { projectData } from "@/components/data/projects";
import { experiences } from "@/components/data/experience";
import { ContributionGraph } from "@/components/contribution-graph";
import { ProjectLogo } from "@/components/project-logo";
import { GitHubIcon, GlobeIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
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

// Each section sits in a softly bordered panel with a faint highlight on its top edge.
const panelClass =
  "flex flex-col gap-3.5 rounded-2xl border border-line bg-panel p-4 shadow-panel sm:p-5";
const rowClass = "flex flex-wrap justify-between gap-x-4 gap-y-1 py-2.5";
const rowsClass = "-my-2.5 divide-y divide-line";
const dateClass = "font-mono text-[13px] text-ink-muted";

export default async function Home() {
  const [contributions, posts] = await Promise.all([
    getContributions(heroData.githubLogin),
    getPosts().catch((error) => {
      console.error("Error fetching posts:", error);
      return [];
    }),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-[600px] flex-col gap-5 pb-20 pt-12 text-[15px] leading-relaxed md:pt-20">
      <header className="mb-8 flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-tile-line bg-tile text-[13px] font-medium text-ink-muted">
            {heroData.initials}
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold tracking-tight text-ink-strong">{heroData.name}</h1>
            <p className="text-sm text-ink-muted">
              {heroData.role} · {heroData.location}
            </p>
          </div>
          <ThemeToggle />
        </div>
        <p className="text-ink [text-wrap:pretty]">
          I build full-stack web apps and AI tools at{" "}
          <a
            href="https://measureprotocol.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-line-strong text-ink-strong transition-colors hover:border-ink-subtle"
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
                className="text-ink-muted transition-colors hover:text-ink-strong"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-ink-muted transition-colors hover:text-ink-strong"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>
      </header>

      {contributions && (
        <section className={panelClass}>
          <ContributionGraph contributions={contributions} />
        </section>
      )}

      <section className={panelClass}>
        <h2 className="text-sm font-medium text-ink-muted">Projects</h2>
        {/* Negative margin lets the hover background bleed past the column edge while text stays aligned. */}
        <div className="-mx-3 -mb-3 -mt-1 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {projectData.map((project) => {
            const links = [
              { label: "Website", href: project.site, icon: <GlobeIcon /> },
              { label: "GitHub", href: project.github, icon: <GitHubIcon /> },
            ].filter((link) => link.href) as { label: string; href: string; icon: React.ReactNode }[];

            return (
              <div
                key={project.name}
                className="group relative flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-hover"
              >
                <ProjectLogo name={project.logo} hue={project.hue} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-start justify-between gap-2">
                    {/* The name link stretches over the whole tile; the icons sit above it. */}
                    <a
                      href={links[0].href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-ink-strong after:absolute after:inset-0 after:rounded-xl"
                    >
                      {project.name}
                    </a>
                    <div className="relative -mr-1 -mt-0.5 flex shrink-0">
                      {links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.name} ${link.label}`}
                          title={link.label}
                          className="rounded-md p-1 text-ink-subtle transition-colors hover:text-ink-strong"
                        >
                          {link.icon}
                        </a>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm leading-snug text-ink-muted">{project.tagline}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className={panelClass}>
        <h2 className="text-sm font-medium text-ink-muted">Work</h2>
        <div className={rowsClass}>
          {experiences.map((job) => (
            <div key={job.company} className={rowClass}>
              <span>
                {job.position},{" "}
                <a
                  href={job.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-muted transition-colors hover:text-ink-strong"
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
        <section className={panelClass}>
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium text-ink-muted">Writing</h2>
            <Link href="/blog" className="text-[13px] text-ink-muted transition-colors hover:text-ink-strong">
              All posts →
            </Link>
          </div>
          <div className={rowsClass}>
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className={`${rowClass} transition-colors hover:text-ink-strong`}
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
