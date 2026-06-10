import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: Home });

function HelloWorld() {
	return <div className="hover:zoom-105 text-red-500">Hello</div>;
}

function Home() {
	return (
		<div className="p-8">
			<h1 className="text-4xl font-bold"> My Modrinth Clone :)</h1>
			<p className="mt-4 text-lg">Suck my dick to get started</p>
			<Link to="/sucker">Sucker</Link>
			<HelloWorld />
			<Button >test</Button>
		</div>
	);
}
