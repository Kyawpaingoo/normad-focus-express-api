import { Request, Response } from "express";
export declare const insertMeetingSchedule: (req: Request, res: Response) => Promise<void>;
export declare const getByID: (req: Request, res: Response) => Promise<void>;
export declare const generateICSContent: (req: Request, res: Response) => Promise<void>;
export declare const updateMeetingSchedule: (req: Request, res: Response) => Promise<void>;
export declare const getByPaging: (req: Request, res: Response) => Promise<void>;
export declare const softDeleteMeetingSchedule: (req: Request, res: Response) => Promise<void>;
export declare const hardDeleteMeetingSchedule: (req: Request, res: Response) => Promise<void>;
