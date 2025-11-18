import { Request, Response } from "express";
export declare const insertExpense: (req: Request, res: Response) => Promise<void>;
export declare const getByID: (req: Request, res: Response) => Promise<void>;
export declare const updateExpense: (req: Request, res: Response) => Promise<void>;
export declare const getByPaging: (req: Request, res: Response) => Promise<void>;
export declare const softDeleteExpense: (req: Request, res: Response) => Promise<void>;
export declare const hardDeleteExpense: (req: Request, res: Response) => Promise<void>;
