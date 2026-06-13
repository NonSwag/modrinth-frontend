import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div>
			<h1>FastRinth</h1>
			<p>
				Search <Link to="/discover/plugin">[Plugins]</Link>{" "}
				<Link to="/discover/mod">[Mods]</Link>
			</p>
		</div>
	);
}
