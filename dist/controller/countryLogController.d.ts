import { Request, Response } from "express";
export declare const createCountryLog: (req: Request, res: Response) => Promise<void>;
export declare const getCountryLogById: (req: Request, res: Response) => Promise<void>;
export declare const updateCountryLog: (req: Request, res: Response) => Promise<void>;
export declare const deleteCountryLog: (req: Request, res: Response) => Promise<void>;
export declare const getByPaging: (req: Request, res: Response) => Promise<void>;
