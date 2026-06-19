import { Link, useLocation } from "@tanstack/react-router";
import { Wrench } from "lucide-react";

const pages = [
	{ name: "Mods", slug: "mod" },
	{ name: "Resource Packs", slug: "resourcepack" },
	{ name: "Data Packs", slug: "datapack" },
	{ name: "Shaders", slug: "shader" },
	{ name: "Modpacks", slug: "modpack" },
	{ name: "Plugin", slug: "plugin" },
];

export function Header() {
	const location = useLocation();
	const path = location.pathname.substring("/discover/".length);
	return (
		<div className="pt-3">
			<Link to={"/"} className="flex mx-1 text-2xl font-bold gap-2">
				<Wrench className="self-center" /> fastrinth
			</Link>
			<div className="border my-3 mx-1 p-2 size-max *:px-4 bg-card">
				{pages.map((page) => {
					return (
						<Link
							key={page.slug}
							className={`${path === page.slug ? "underline" : ""}`}
							to="/discover/$category"
							params={{ category: page.slug }}
							search={(previous) => ({
								...previous,
								page: 1,
							})}
						>
							{page.name}
						</Link>
					);
				})}
			</div>
		</div>
	);
}
