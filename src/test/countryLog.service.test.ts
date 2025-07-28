import { PrismaClient, CountryLog, Prisma } from '@prisma/client';
import * as CountryLogService from '../service/countryLogService';
import { type upsertCountryLog } from '../dtos/countryLogDto';
import { PaginationResponse } from '../utils/pagination';

const prisma = new PrismaClient();

describe('CountryLogService (Integration Tests)', () => {
  const getInsertDto = (): upsertCountryLog => ({
    user_id: 1,
    country_name: 'Thailand',
    entry_date: new Date('2025-07-01'),
    visa_limit_days: 100,
    exit_date: new Date('2025-10-10'),
    visa_type: 'Education Visa',
    notify_at: new Date('2025-09-20')
  });

  const getUpdateDto = (): upsertCountryLog => ({
    user_id: 1,
    country_name: 'Thailand',
    entry_date: new Date('2025-07-01'),
    visa_limit_days: 90,
    exit_date: new Date('2025-10-10'),
    visa_type: 'Education Visa',
    notify_at: new Date('2025-09-20')
  });

  let insertedLog: CountryLog;

  beforeEach(async () => {
    await prisma.countryLog.deleteMany();

    insertedLog = await prisma.countryLog.create({
      data: {
        user_id: 1,
        country_name: 'Thailand',
        entry_date: new Date('2025-07-01'),
        visa_limit_days: 100,
        exit_date: new Date('2025-10-10'),
        visa_type: 'Education Visa',
        notify_at: new Date('2025-09-20')
      },
    });
  });

  afterAll(async () => {
    await prisma.countryLog.deleteMany();
    await prisma.$disconnect();
  });

  test('should insert country log successfully', async () => {
    const dto = getInsertDto();

    const result = await CountryLogService.insert(dto);

    expect(result.user_id).toBe(insertedLog.user_id);
    expect(result.country_name).toBe(insertedLog.country_name)
  });

  test('should get country log by ID successfully', async () => {
    const result = await CountryLogService.getById(insertedLog.id, 1);

    expect(result.id).toBe(insertedLog.id);
    expect(result.user_id).toBe(insertedLog.user_id);
  });

  test('should throw when country log not found', async () => {
    await expect(CountryLogService.getById(9999, 1)).rejects.toThrow('Country log not found');
  });

  test('should update country log successfully', async () => {
    const dto = getUpdateDto();

    const result = await CountryLogService.update(insertedLog.id, 1, dto);

    expect(result.country_name).toBe(dto.country_name);
    expect(result.visa_type).toBe(dto.visa_type);
  });

  test('should hard delete country log successfully', async () => {
    const result = await CountryLogService.hardDelete(insertedLog.id, 1);

    expect(result).toBe('Country Log deleted successfully');

    const deleted = await prisma.countryLog.findUnique({
      where: { id: insertedLog.id },
    });
    expect(deleted).toBeNull();
  });

  test('should return paginated country logs', async () => {
    const result = await CountryLogService.getByPaging(1, 10, 1, 'asc');

    expect(result.results.length).toBeGreaterThan(0);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
  });

  test('should return empty results when no logs found', async () => {
    await prisma.countryLog.deleteMany();

    const result = await CountryLogService.getByPaging(1, 10, 1, 'asc');

    expect(result.results).toEqual([]);
    expect(result.totalCount).toBe(0);
  });
});
