import { PrismaService } from '../../database/prisma.service';
import { CountryLog } from '@prisma/client';
import { UpsertCountryLogDto } from './dto/upsert-country-log.dto';
import { PaginationResponse, sortDirection } from '../../common/types/pagination.types';
export declare class CountryLogService {
    private prisma;
    constructor(prisma: PrismaService);
    insert(data: UpsertCountryLogDto): Promise<CountryLog>;
    getById(id: number, userId: number): Promise<CountryLog>;
    update(id: number, userId: number, data: UpsertCountryLogDto): Promise<CountryLog>;
    hardDelete(id: number, userId: number): Promise<string>;
    getByPaging(page: number, pageSize: number, userId: number, sortDir: sortDirection, q?: string): Promise<PaginationResponse<CountryLog>>;
}
