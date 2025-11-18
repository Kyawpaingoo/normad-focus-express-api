import { CountryLog } from "@prisma/client";
import { upsertCountryLog } from "../dtos/countryLogDto";
import { PaginationResponse, sortDirection } from "src/utils/pagination";
export declare const insert: (data: upsertCountryLog) => Promise<CountryLog>;
export declare const getById: (id: number, userId: number) => Promise<CountryLog>;
export declare const update: (id: number, userId: number, data: upsertCountryLog) => Promise<CountryLog>;
export declare const hardDelete: (id: number, userId: number) => Promise<string>;
export declare const getByPaging: (page: number, pageSize: number, userId: number, sortDir: sortDirection, q?: string) => Promise<PaginationResponse<CountryLog>>;
