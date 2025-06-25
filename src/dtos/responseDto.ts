
export type successResponseDto = {
    success: boolean;
    data: any;
    msg: string;
    token: string | null;
    pagination: any;
}

export type errorResponseDto = {
    success: boolean;
    error: string;
    status: number;
}