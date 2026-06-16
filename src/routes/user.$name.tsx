import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/$name")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/author/$name"!</div>;
}
