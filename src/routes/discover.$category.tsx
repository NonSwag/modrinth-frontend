import { createFileRoute } from "@tanstack/react-router";
import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/discover/$category")({
	component: RouteComponent,
});

const PROJECTS_PER_PAGE = 10;

interface Response {
	hits: Project[];
}

interface Project {
	slug: string;
	title?: string;
	description?: string;
	categories?: string[];
	client_side?: string;
	server_side?: string;
	project_type: string;
	icon_url: string;
	color: number;
	project_id: string;
	author: string;
}

function RouteComponent() {
	const { category } = Route.useParams();
	const [projects, setProjects] = useState<Project[]>();
	const [page, setPage] = useState<number>(1);
	const [input, setInput] = useState<string>();

	function updatePage(page: number) {
		setPage(page);
		updateProjects();
	}

	async function updateProjects() {
		const projects = await getProjects(category, page - 1, input);
		setProjects(projects);
	}

	return (
		<div>
			<Input
				onChange={(e) => {
					setInput(e.target.value);
					updateProjects();
				}}
			/>
			<Button
				onClick={() => {
					if (page > 1) updatePage(page - 1);
				}}
			>
				Previous Page: {Math.max(page - 1, 0)}
			</Button>
			<Button
				onClick={() => {
					updatePage(page + 1);
				}}
			>
				Next Page: {page + 1}
			</Button>
			{projects?.map((project) => {
				return <p key={project.slug}>{project.title}</p>;
			})}
		</div>
	);
}

async function getProjects(
	category: string,
	page: number,
	query?: string,
): Promise<Project[]> {
	const offset = PROJECTS_PER_PAGE * page;
	const facets = `[["project_type:${category}"]]`;
	const response = await fetch(
		`https://api.modrinth.com/v2/search?query=${query}&facets=${facets}&offset=${offset}&limit=${PROJECTS_PER_PAGE}`,
	);
	const rsp = (await response.json()) as Response;
	return rsp.hits;
}
