import {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useContext,
	useState,
} from "react";

type CategoryContextType = {
	categories: string[];
	setCategories: Dispatch<SetStateAction<string[]>>;
};

const CategoryContext = createContext<CategoryContextType | undefined>(
	undefined,
);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
	const [categories, setCategories] = useState<string[]>([]);

	return (
		<CategoryContext.Provider value={{ categories, setCategories }}>
			{children}
		</CategoryContext.Provider>
	);
};

export const useCategory = () => {
	const context = useContext(CategoryContext);

	if (context === undefined) {
		throw new Error("useCategory must be used within a CategoryProvider");
	}

	return context;
};
