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

export function getPaging<T>(page: number, pageSize: number, result: T[], addiontalData?: string): PaginationResponse<T> {
    
    const totalCount = result.length;
    const totalPage = Math.ceil(totalCount / pageSize);
    const dataList = result.slice((page - 1) * pageSize, page * pageSize);

    return {
        totalCount,
        totalPage,
        page,
        pageSize,
        hasNextPage: page < totalPage,
        hasPrevPage: page > 1,
        results: dataList,
        additionalData: addiontalData
    };
}