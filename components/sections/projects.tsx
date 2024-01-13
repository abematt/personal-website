import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react"
import { data } from "@/components/data/github";

export function Projects() {
 

  return (
    <>
      {data.map((project, index) => (
        <Card key={index} className="border-zinc-800 bg-zinc-950 flex flex-col justify-between">
          <CardHeader>
            <div className="flex justify-between">
              <a
                target="_blank"
                href={project.link}
                rel="noopener noreferrer"
                aria-label={project.repo}
              >
                <CardTitle className="text-base hover:underline">
                  {project.repo}
                </CardTitle>
                </a>
                <a
                    target="_blank"
                    href={project.website || project.link}
                    rel="noopener noreferrer"
                    aria-label ="Visit project's live url or repo"
                >
                    <ExternalLink className="w-6 h-6 text-gray-400 hover:text-gray-500" />
                </a>
            </div>
            <CardDescription className="line-clamp-2 text-sm font-light">
              {project.description}
              </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <Badge
                style={{
                    backgroundColor: `${project.languageColor}`,
                    color: "black",
                }}
                >{project.language}</Badge>

          </CardFooter>
        </Card>
      ))}
    </>
  );
}
