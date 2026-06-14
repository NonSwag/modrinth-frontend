import type { Category, GameVersion, Loader, Project, Response } from "./types";

export async function fetchCategories(): Promise<Category[]> {
	const response = await fetch("https://api.modrinth.com/v2/tag/category");
	const categories = (await response.json()) as Category[];
	return categories;
}

export async function fetchLoaders(): Promise<Loader[]> {
	const response = await fetch("https://api.modrinth.com/v2/tag/loader");
	const loaders = (await response.json()) as Loader[];
	return loaders;
}

export async function fetchGameVersions(): Promise<GameVersion[]> {
	const response = await fetch("https://api.modrinth.com/v2/tag/game_version");
	const versions = (await response.json()) as GameVersion[];
	return versions;
}

export async function fetchProjectTypes(): Promise<string[]> {
	const response = await fetch("https://api.modrinth.com/v2/tag/project_type");
	const types = (await response.json()) as string[];
	return types;
}

export async function fetchProjects(
	category: string,
	page: number,
	limit: number,
	categories: string[],
	query?: string,
	sort?: string,
): Promise<Project[]> {
	const offset = limit * (page - 1);
	const categoryFilter = categories.map((category) => {
		return `["categories:${category}"]`;
	});
	const filter = categoryFilter.length > 0 ? `,${categoryFilter}` : "";
	const facets = `[["project_type:${category}"]${filter}]`;
	console.log(facets);

	if (!query) query = "";

	const response = await fetch(
		`https://api.modrinth.com/v2/search
		?query=${query}
		&facets=${facets}
		&offset=${offset}
		&index=${sort}
		&limit=${limit}`,
	);
	const rsp = (await response.json()) as Response;
	return rsp.hits;
}
