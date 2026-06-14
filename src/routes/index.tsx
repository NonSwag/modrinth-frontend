import { createFileRoute, Link } from "@tanstack/react-router";
import { useCategory } from "../components/category-context";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { categories, setCategories } = useCategory();

	const addCategory = () => {
		setCategories((prev) => [
			...prev,
			{
				id: Date.now(),
				name: "New Category",
			},
		]);
	};

	return (
		<div>
			<h1>FastRinth</h1>
			<p>
				Search{" "}
				<Link to="/discover/$category" params={{ category: "plugin" }}>
					[Plugins]
				</Link>{" "}
				<Link to="/discover/$category" params={{ category: "mod" }}>
					[Mods]
				</Link>
			</p>

			{categories.map((category) => (
				<p key={category.id}>{category.name}</p>
			))}

			<button onClick={addCategory}>Add Category</button>
		</div>
	);
}
