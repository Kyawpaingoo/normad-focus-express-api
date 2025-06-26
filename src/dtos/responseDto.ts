
export type successResponseDto = {
    success: boolean;
    data: any;
    msg: string;
}

export type errorResponseDto = {
    success: boolean;
    error: string;
    status: number;
}