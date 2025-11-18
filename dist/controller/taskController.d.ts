import { Request, Response } from "express";
export declare const createTask: (req: Request, res: Response) => Promise<void>;
export declare const getTaskByID: (req: Request, res: Response) => Promise<void>;
export declare const updateTask: (req: Request, res: Response) => Promise<void>;
export declare const getByView: (req: Request, res: Response) => Promise<void>;
export declare const softDeleteTask: (req: Request, res: Response) => Promise<void>;
export declare const hardDeleteTask: (req: Request, res: Response) => Promise<void>;
