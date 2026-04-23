import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { v7 as uuidv7 } from 'uuid';

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString: connectionString })
const prisma = new PrismaClient({ adapter })

export const generateUUID = () => {
  return uuidv7()
}

export default prisma;
