import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    DATABASE_URL: z.string().optional(),
    AI_MODEL: z.string().default("llama-3.1-70b-versatile"),

    AI_PROVIDER: z.enum(["groq", "openai", "gemini"]).default("groq"),

    // Providers (optional unless selected)
    GROQ_API_KEY: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
    GEMINI_API_KEY: z.string().optional(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    AI_MODEL: process.env.AI_MODEL,
    AI_PROVIDER: process.env.AI_PROVIDER,

    GROQ_API_KEY: process.env.GROQ_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
});
