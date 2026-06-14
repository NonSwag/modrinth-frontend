import { Link } from "@tanstack/react-router";
import { Box } from "lucide-react";
import type { Project } from "@/lib/types";

export function ProjectCard(project: Project) {
	return (
		<Link
			key={project.slug}
			to={`/project/$slug`}
			params={{ slug: project.slug }}
			className="flex flex-col gap-3 p-4 bg-card hover:brightness-110 group"
		>
			<div className="size-20 *:size-20 border">
				{project.icon_url ? (
					<img src={project.icon_url} alt={project.title} />
				) : (
					<Box />
				)}
			</div>
			<div className="inline-flex items-baseline gap-2">
				<p className="font-bold hover:underline group-hover:underline">
					{project.title}{" "}
				</p>
				<small className="text-muted-foreground">
					by{" "}
					<Link
						className="hover:underline"
						to={`/author/$name`}
						params={{ name: project.author }}
					>
						{project.author}
					</Link>
				</small>
			</div>
			<p className="text-sm text-muted-foreground">{project.description}</p>
			<div className="flex flex-row flex-wrap gap-2">
				{project.categories?.map((category) => {
					return (
						<span key={category} className="border">
							{category}
						</span>
					);
				})}
			</div>
		</Link>
	);
}
