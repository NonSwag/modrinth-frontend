import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sucker")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div className="bg-background">Hello "/sucker"!</div>;
}
