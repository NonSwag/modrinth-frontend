import type { ReactNode } from "react";
import { Route } from "@/routes/discover.$category";
import { Field, FieldLabel } from "./ui/field";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "./ui/pagination";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

export function SearchOptions() {
	const { page, sort, limit } = Route.useSearch();
	const { category } = Route.useParams();
	const navigate = Route.useNavigate();

	return (
		<div className="flex p-1 m-1 justify-between">
			<div className="flex gap-3">
				<Field orientation="horizontal" className="w-max">
					<FieldLabel htmlFor="select-sorting-order">Sort by</FieldLabel>
					<Select
						value={sort ?? undefined}
						onValueChange={(e) => {
							navigate({
								search: (previous) => ({
									...previous,
									sort: e as string,
								}),
								replace: true,
							});
						}}
						defaultValue="relevance"
					>
						<SelectTrigger className="w-30" id="select-sorting-order">
							<SelectValue />
						</SelectTrigger>
						<SelectContent align="start">
							<SelectGroup>
								<SelectItem value="relevance">Relevance</SelectItem>
								<SelectItem value="downloads">Downloads</SelectItem>
								<SelectItem value="follows">Followers</SelectItem>
								<SelectItem value="newest">Date published</SelectItem>
								<SelectItem value="updated">Date updated</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</Field>

				<Field orientation="horizontal" className="w-max">
					<FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
					<Select
						value={limit?.toString() ?? undefined}
						onValueChange={(e) => {
							navigate({
								search: (previous) => ({
									...previous,
									limit: Number(e),
									page: undefined,
								}),
								replace: true,
							});
						}}
						defaultValue="25"
					>
						<SelectTrigger className="w-20" id="select-rows-per-page">
							<SelectValue />
						</SelectTrigger>
						<SelectContent align="start">
							<SelectGroup>
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="25">25</SelectItem>
								<SelectItem value="50">50</SelectItem>
								<SelectItem value="100">100</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</Field>
			</div>
			<div>
				<Pagination className="w-auto mx-0">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								to="/discover/$category"
								params={{
									category: category,
								}}
								search={(previous) => ({
									...previous,
									page:
										previous.page && previous.page > 1 ? previous.page - 1 : 1,
								})}
							/>
						</PaginationItem>
						{fillPaginationItems(category, page || 1)}
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
						<PaginationItem>
							<PaginationNext
								to="/discover/$category"
								params={{
									category: category,
								}}
								search={(previous) => ({
									...previous,
									page: previous.page ? previous.page + 1 : 2,
								})}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
}

function fillPaginationItems(category: string, page: number): ReactNode[] {
	const nodes = [];
	for (let i = 0; i < 3; i++) {
		nodes[i] = (
			<PaginationItem>
				<PaginationLink
					to="/discover/$category"
					params={{
						category: category,
					}}
					search={(previous) => ({
						...previous,
						page: page + i,
					})}
					isActive={page === page + i}
				>
					{page + i}
				</PaginationLink>
			</PaginationItem>
		);
	}
	return nodes;
}
