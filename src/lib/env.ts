import { createEnv } from "@t3-oss/env-nextjs";
import {z} from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default("development"),
    DATABASE_URL: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL, 
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  },
});