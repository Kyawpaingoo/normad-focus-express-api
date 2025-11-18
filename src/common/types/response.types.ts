export type SuccessResponseDto = {
  success: boolean;
  data: any;
  msg: string;
};

export type ErrorResponseDto = {
  success: boolean;
  error: string;
  status: number;
};

export const DataResponseDto = {
  Success: 'Success',
  Error: 'Error',
};
