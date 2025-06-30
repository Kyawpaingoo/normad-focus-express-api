import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true

declare global {
  var prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

//const pool = new Pool({connectionString});
const adapter = new PrismaNeon({
  connectionString});
const prisma = global.prisma || new PrismaClient({ adapter } as any);

export default prisma;