import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div>
			<h1>FastRinth</h1>
			<p>
				Search{" "}
				<Link to="/discover/$category" params={{ category: "mod" }}>
					[Mods]
				</Link>{" "}
				<Link to="/discover/$category" params={{ category: "resourcepack" }}>
					[Resource Packs]
				</Link>{" "}
				<Link to="/discover/$category" params={{ category: "datapack" }}>
					[Data Packs]
				</Link>{" "}
				<Link to="/discover/$category" params={{ category: "shader" }}>
					[Shaders]
				</Link>{" "}
				<Link to="/discover/$category" params={{ category: "modpack" }}>
					[Modpacks]
				</Link>{" "}
				<Link to="/discover/$category" params={{ category: "plugin" }}>
					[Plugins]
				</Link>
			</p>
		</div>
	);
}
