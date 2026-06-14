import { ArrowUp, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { fetchCategories } from "@/lib/routes";
import type { Category } from "@/lib/types";
import { useCategory } from "./category-context";
import { Button } from "./ui/button";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export function CategorySelector({
	currentCategory,
}: {
	currentCategory: string;
}) {
	const { categories, setCategories } = useCategory();
	const [showCategories, setShowCategories] = useState<boolean>(true);
	const [availableCategories, setAvailableCategories] = useState<Category[]>();
	async function updateCategories() {
		const categories = await fetchCategories();
		setAvailableCategories(categories);
	}
	if (!availableCategories) updateCategories();

	return (
		<div className="p-1 mx-1 border h-full ">
			<Button
				className="mx-auto justify-start"
				onClick={() => {
					setShowCategories(!showCategories);
				}}
			>
				{showCategories ? <ChevronUp /> : <ChevronDown />} Categories
			</Button>
			<ToggleGroup
				multiple
				className="flex flex-col m-2"
				onValueChange={(value) => setCategories(value)}
				value={categories}
				hidden={!showCategories}
			>
				{availableCategories
					?.filter((category) => {
						return (
							category.header === "categories" &&
							category.project_type === toProjectType(currentCategory)
						);
					})
					.filter((category) => {
						return category.name;
					})
					.map((category) => {
						return (
							<ToggleGroupItem
								className="w-full justify-start"
								key={category.name}
								value={category.name}
							>
								<div
									dangerouslySetInnerHTML={{ __html: category.icon }}
									className="text-primary size-4"
								></div>
								<span className="capitalize">
									{category.name.replace("-", " ")}
								</span>
							</ToggleGroupItem>
						);
					})}
			</ToggleGroup>
		</div>
	);
}

function toProjectType(category: string): string {
	switch (category) {
		case "modpack":
			return "modpack";
		case "mod":
		case "plugin":
		case "datapack":
			return "mod";
		case "resourcepack":
			return "resourcepack";
		case "shader":
			return "shader";
		default:
			throw new Error(
				`Unknown category "${category}", cannot convert to project type`,
			);
	}
}
