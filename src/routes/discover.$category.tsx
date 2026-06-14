import { createFileRoute, Link } from "@tanstack/react-router";
import { Box } from "lucide-react";
import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type { Project, Response } from "@/lib/types";

export const Route = createFileRoute("/discover/$category")({
	validateSearch: (search) => ({
		search: (search.search as string) || undefined,
		page: Number(search.page) || undefined,
		limit: Number(search.limit) || undefined,
		sort: (search.sort as string) || "relevance",
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const { search, page, limit, sort } = Route.useSearch();
	const navigate = Route.useNavigate();

	const { category } = Route.useParams();
	const [projects, setProjects] = useState<Project[]>();
	const [loading, setLoading] = useState<boolean>(true);

	const sortItems = [
		{ label: "Relevance", value: "relevance" },
		{ label: "Downloads", value: "downloads" },
		{ label: "Followers", value: "follows" },
		{ label: "Date published", value: "newest" },
		{ label: "Date updated", value: "updated" },
	];

	useEffect(() => {
		const controller = new AbortController();
		async function updateProjects() {
			try {
				setLoading(true);
				const projects = await getProjects(
					category,
					page || 1,
					limit || 20,
					search,
					sort,
					controller.signal,
				);
				setProjects(projects);
				setLoading(false);
			} catch (error) {
				if (error instanceof DOMException && error.name === "AbortError")
					return;
				setLoading(false);
				throw error;
			}
		}

		updateProjects();
		return () => {
			controller.abort();
		};
	}, [category, search, page, limit, sort]);

	return (
		<div className="container mx-auto py-3">
			<Link to="/">Home</Link>
			<h1>Discover {category}</h1>
			<Input
				defaultValue={search}
				onChange={(e) => {
					navigate({
						search: (previous) => ({
							...previous,
							search: e.target.value === "" ? undefined : e.target.value,
							page: undefined,
						}),
						replace: true,
					});
				}}
			/>
			<Select
				value={sort}
				onValueChange={(e) => {
					navigate({
						search: (previous) => ({
							...previous,
							sort: e as string,
						}),
						replace: true,
					});
				}}
			>
				<SelectTrigger>
					Sort by: <SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{sortItems.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			<Button
				disabled={page ? page <= 1 : true}
				onClick={() => {
					navigate({
						search: (previous) => ({
							...previous,
							page: previous.page ? previous.page - 1 : 2,
						}),
						replace: true,
					});
				}}
			>
				Previous Page: {page ? Math.max(page - 1, 0) : 0}
			</Button>
			<Button
				onClick={() => {
					navigate({
						search: (previous) => ({
							...previous,
							page: previous.page ? previous.page + 1 : 2,
						}),
						replace: true,
					});
				}}
			>
				Next Page: {page ? page + 1 : 2}
			</Button>
			{loading ? (
				<Spinner />
			) : (
				<div className="flex flex-col gap-1">
					{projects?.map((project) => {
						return ProjectCard(project);
					})}
				</div>
			)}
		</div>
	);
}

async function getProjects(
	category: string,
	page: number,
	limit: number,
	query?: string,
	sort?: string,
	signal?: AbortSignal,
): Promise<Project[]> {
	const offset = limit * (page - 1);
	const facets = `[["project_type:${category}"]]`;

	if (!query) query = "";

	const response = await fetch(
		`https://api.modrinth.com/v2/search
		?query=${query}
		&facets=${facets}
		&offset=${offset}
		&index=${sort}
		&limit=${limit}`,
		{ signal },
	);
	const rsp = (await response.json()) as Response;
	return rsp.hits;
}
