import { PrismaClient, MeetingSchedule, Prisma } from '@prisma/client';
import * as MeetingService from '../service/meetingScheduleService';
import { type upsertMeetingSchdeuleDto } from '../dtos/meetingScheduleDto';

const prisma = new PrismaClient();

describe('MeetingScheduleService (Integration Tests)', () => {
  const getInsertDto = (): upsertMeetingSchdeuleDto => ({
    user_id: 1,
    title: 'Test Meeting',
    description: 'Test Description',
    start_time: new Date('2025-08-01T10:00:00'),
    end_time: new Date('2025-08-01T11:00:00'),
  });

  const getUpdateDto = (): upsertMeetingSchdeuleDto => ({
    user_id: 1,
    title: 'Updated Meeting',
    description: 'Updated Description',
    start_time: new Date('2025-08-01T12:00:00'),
    end_time: new Date('2025-08-01T13:00:00'),
  });

  let insertedMeeting: MeetingSchedule;

  beforeEach(async () => {
    await prisma.meetingSchedule.deleteMany();

    insertedMeeting = await prisma.meetingSchedule.create({
      data: {
        user_id: 1,
        title: 'Test Meeting',
        description: 'Test Description',
        start_time: new Date('2025-08-01T10:00:00'),
        end_time: new Date('2025-08-01T11:00:00'),
        created_at: new Date(),
        is_deleted: false,
      },
    });
  });

  afterAll(async () => {
    await prisma.meetingSchedule.deleteMany();
    await prisma.$disconnect();
  });

  test('should insert meeting schedule successfully', async () => {
    const dto = getInsertDto();

    const result = await MeetingService.insert(dto);

    expect(result).toMatchObject({
      title: dto.title,
      description: dto.description,
    });
    expect(result.user_id).toBe(dto.user_id);
  });

  test('should get meeting by id and user_id', async () => {
    const result = await MeetingService.getById(insertedMeeting.id, 1);

    expect(result.id).toBe(insertedMeeting.id);
    expect(result.title).toBe(insertedMeeting.title);
  });

  test('should update meeting schedule successfully', async () => {
    const dto = getUpdateDto();

    const result = await MeetingService.update(insertedMeeting.id, 1, dto);

    expect(result.title).toBe(dto.title);
    expect(result.description).toBe(dto.description);
  });

  test('should generate ICS string', async () => {
    const ics = await MeetingService.generateICS(insertedMeeting);

    expect(typeof ics).toBe('string');
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain(`SUMMARY:${insertedMeeting.title}`);
  });

  test('should soft delete meeting', async () => {
    const result = await MeetingService.softDelete(insertedMeeting.id, 1);

    expect(result).toBe('Meeting Schedule deleted successfully');

    const check = await prisma.meetingSchedule.findUnique({ where: { id: insertedMeeting.id } });
    expect(check?.is_deleted).toBe(true);
  });

  test('should hard delete meeting', async () => {
    const result = await MeetingService.hardDelete(insertedMeeting.id, 1);

    expect(result).toBe('Meeting Schedule deleted successfully');

    const check = await prisma.meetingSchedule.findUnique({ where: { id: insertedMeeting.id } });
    expect(check).toBeNull();
  });

  test('should return paginated meeting schedules', async () => {
    const result = await MeetingService.getbyPaging(1, 10, 1, 'asc');

    expect(result).toHaveProperty('results');
    expect(result.results.length).toBeGreaterThan(0);
    expect(result.results[0].user_id).toBe(1);
  });

  test('should return empty results when no meeting schedules found', async () => {
    await prisma.meetingSchedule.deleteMany();

    const result = await MeetingService.getbyPaging(1, 10, 1, 'asc');

    expect(result.results).toEqual([]);
    expect(result.totalCount).toBe(0);
  });
});
