import { Link } from "@tanstack/react-router";
import { Box, Download, Heart, History } from "lucide-react";
import type { Project } from "@/lib/types";

const rtf1 = new Intl.RelativeTimeFormat("en", { style: "long" });
const nf1 = new Intl.NumberFormat("en", {
	maximumFractionDigits: 2,
	notation: "compact",
});
const nfLong = new Intl.NumberFormat("en");

function lastUpdated(dateString: string): string {
	const date = new Date(dateString);
	return `Updated ${date.toDateString()} at ${date.toLocaleTimeString()}`;
}

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	const millisAgo = Date.now() - date.getTime();
	const seconds = Math.floor(millisAgo / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const weeks = Math.floor(days / 7);
	const months = Math.floor(weeks / 4);
	const years = Math.floor(months / 12);
	if (years >= 1) {
		return rtf1.format(-years, "years");
	} else if (months >= 1) {
		return rtf1.format(-months, "months");
	} else if (weeks >= 1) {
		return rtf1.format(-weeks, "weeks");
	} else if (days >= 1) {
		return rtf1.format(-days, "days");
	} else if (hours >= 1) {
		return rtf1.format(-hours, "hours");
	} else if (minutes >= 1) {
		return rtf1.format(-minutes, "minutes");
	}

	return "just now";
}

export function ProjectCard(project: Project) {
	return (
		<Link
			key={project.slug}
			to={`/project/$slug`}
			params={{ slug: project.slug }}
			className="flex flex-col gap-3 p-4 bg-card hover:brightness-110 group"
		>
			<div className="flex flex-row items-center gap-3">
				<div className="size-25 *:size-full border flex-none bg-secondary">
					{project.icon_url ? (
						<img src={project.icon_url} alt={project.title} />
					) : (
						<Box className="text-muted-foreground" />
					)}
				</div>
				<div className=" w-full">
					<div className="flex justify-between items-center">
						<div className="inline-flex items-baseline gap-2">
							<p className="font-bold hover:underline group-hover:underline">
								{project.title}{" "}
							</p>
							<small className="text-muted-foreground">
								by{" "}
								<Link
									className="hover:underline"
									to={
										project.organization ? `/organization/$name` : `/user/$name`
									}
									params={{
										name: project.organization
											? project.organization
											: project.author,
									}}
								>
									{project.organization ? project.organization : project.author}
								</Link>
							</small>
						</div>
						<div className="flex gap-3 *:gap-3 *:flex *:items-center">
							<span title={`${nfLong.format(project.downloads)} downloads`}>
								<Download /> {nf1.format(project.downloads)}
							</span>
							<span title={`${nfLong.format(project.follows)} followers`}>
								<Heart /> {nf1.format(project.follows)}
							</span>
							<span title={lastUpdated(project.date_modified)}>
								<History /> {formatDate(project.date_modified)}
							</span>
						</div>
					</div>
					<p className="text-sm text-muted-foreground py-2">
						{project.description}
					</p>
					<div className="flex flex-row flex-wrap gap-2">
						{project.categories?.map((category) => {
							return (
								<span key={category} className="border p-0.5">
									{category}
								</span>
							);
						})}
					</div>
				</div>
			</div>
		</Link>
	);
}
