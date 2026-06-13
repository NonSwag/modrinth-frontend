import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
		<div>
			<Link to="/">Home</Link>
			<h1>Discover {category}</h1>
			<Input
				defaultValue={search}
				autoFocus
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
				<SelectTrigger className="w-full max-w-48">
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
				projects?.map((project) => {
					return (
						<div
							className="m-3 flex py-4 items-center bg-mauve-900 hover:brightness-110 w-full"
							key={project.slug}
						>
							<Link to={`/project/${project.slug}`}>
								<div>
									<div className="p-3">
										{project.icon_url ? (
											<img
												className="border border-bs-gray-800 size-16"
												src={project.icon_url}
												alt=""
											/>
										) : (
											<svg
												className="border border-bs-gray-800 size-16"
												stroke-linecap="round"
												stroke-linejoin="round"
												viewBox="0 0 103.4 103.4"
											>
												<path
													fill="none"
													stroke="#9a9a9a"
													stroke-width="5"
													d="M51.7 92.5V51.7L16.4 31.3l35.3 20.4L87 31.3 51.7 11 16.4 31.3v40.8l35.3 20.4L87 72V31.3L51.7 11"
												></path>
											</svg>
										)}
									</div>
									<div className="ml-3">
										<div className="inline-flex">
											<p className="font-bold hover:underline">
												{project.title}{" "}
											</p>
											<small className="text-gray-400">
												by{" "}
												<Link
													className="hover:underline"
													to={`/author/${project.author}`}
												>
													{project.author}
												</Link>
											</small>
										</div>
										<p className="text-sm self-baseline-last text-gray-400">
											{project.description}
										</p>
									</div>
								</div>
							</Link>
						</div>
					);
				})
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

interface Response {
	hits: Project[];
	offset: number;
	limit: number;
	total_hits: number;
}

interface Project {
	slug: string;
	title?: string;
	description?: string;
	categories?: string[];
	client_side?: string;
	server_side?: string;
	project_type: string;
	downloads: number;
	icon_url?: string;
	color?: number;
	project_id: string;
	author: string;
	display_categories: string[];
	versions: string[];
	follows: number;
	date_created: string;
	date_modified: string;
	latest_version?: string;
	license: string;
	gallery: string[];
	featured_gallery: string;
}
