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
