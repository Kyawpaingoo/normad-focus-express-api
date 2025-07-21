export type PaginationResponse<T> ={
    totalCount: number;
    totalPage: number;
    results: T[] | [];
    page: number,
    pageSize: number,
    hasNextPage: boolean,
    hasPrevPage: boolean,
    additionalData?: string;
}

export type sortDirection = "asc" | "desc";

export type ViewMode = 'list' | 'board';

export type InfiniteScrollResponse<T> = {
    results: T[] | [],
    nextCursor: string | null,
    hasNextPage: boolean,
    totalCount?: number,
    additionalData?: string
}

export type KanbanResponse<T> = {
    columns: Record<string, {
        title: string;
        items: T[];
        totalCount: number;
    }>,
    totalCount: number;
    addtionalData?: string;
}

export type FlexibleResponse<T> = InfiniteScrollResponse<T> | KanbanResponse<T>;