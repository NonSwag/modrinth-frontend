import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CategorySelector } from "@/components/category-selector";
import { Header } from "@/components/header";
import { ProjectCard } from "@/components/project-card";
import { Paginator, SearchOptions } from "@/components/search-options";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { fetchProjects } from "@/lib/routes";
import type { Project } from "@/lib/types";

export const Route = createFileRoute("/discover/$category")({
	validateSearch: (search) =>
		search as {
			search?: string;
			page?: number;
			limit?: number;
			sort?: string;
			categories?: string[];
		},
	component: RouteComponent,
});

function RouteComponent() {
	const { search, page, limit, sort, categories } = Route.useSearch();
	const navigate = Route.useNavigate();

	const { category } = Route.useParams();
	const [projects, setProjects] = useState<Project[]>();
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		async function updateProjects() {
			try {
				setLoading(true);
				const projects = await fetchProjects(
					category,
					page || 1,
					limit || 20,
					sort || "relevance",
					categories,
					search,
				);
				setProjects(projects);
			} finally {
				setLoading(false);
			}
		}

		updateProjects();
	}, [category, search, page, limit, sort, categories]);

	return (
		<div className="container mx-auto py-3 pb-10 w-[65%]">
			<Header />
			<div className="flex justify-start">
				<CategorySelector
					currentCategory={category}
					categories={categories || []}
				/>
				<div className="w-full">
					<InputGroup>
						<InputGroupAddon>
							<Search />
						</InputGroupAddon>
						<InputGroupInput
							defaultValue={search}
							placeholder={`Search ${category}s...`}
							className="border-none"
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
					</InputGroup>
					<SearchOptions />
					{loading ? (
						<Spinner />
					) : (
						<div className="flex flex-col gap-1">
							{projects?.map((project) => {
								return ProjectCard(project, category);
							})}
							<Paginator category={category} page={page} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
