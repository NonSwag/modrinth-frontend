export interface Response {
	hits: Project[];
	offset: number;
	limit: number;
	total_hits: number;
}

export interface Project {
	slug: string;
	title?: string;
	description?: string;
	categories?: string[];
	client_side?: "required" | "optional" | "unsupported" | "unknown";
	server_side?: "required" | "optional" | "unsupported" | "unknown";
	project_type: "mod" | "modpack" | "resourcepack" | "shader";
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

export interface Category {
	icon: string;
	name: string;
	project_type: string;
	header: string;
}

export interface Loader {
	icon: string;
	name: string;
	supported_project_types: string[];
}

export interface GameVersion {
	version: string;
	version_type: "release" | "snapshot" | "alpha" | "beta";
	date: string;
	major: boolean;
}
