import { useState } from "react";
import { fetchCategories } from "@/lib/routes";
import type { Category } from "@/lib/types";
import { useCategory } from "./category-context";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export function CategorySelector({
	currentCategory,
}: {
	currentCategory: string;
}) {
	const { categories, setCategories } = useCategory();
	const [availableCategories, setAvailableCategories] = useState<Category[]>();
	async function updateCategories() {
		const categories = await fetchCategories();
		setAvailableCategories(categories);
	}
	if (!availableCategories) updateCategories();

	return (
		<ToggleGroup
			multiple
			className="flex flex-col items-start gap-3"
			onValueChange={(value) => setCategories(value)}
			value={categories}
		>
			{availableCategories
				?.filter((category) => {
					return category.project_type === currentCategory;
				})
				.map((category) => {
					return (
						<ToggleGroupItem key={category.name} value={category.name}>
							<svg
								dangerouslySetInnerHTML={{ __html: category.icon }}
								className="text-primary size-4"
							></svg>
							<span className="capitalize">
								{category.name.replace("-", " ")}
							</span>
						</ToggleGroupItem>
					);
				})}
		</ToggleGroup>
	);
}
