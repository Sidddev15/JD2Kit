import OpenAI from 'openai';
import { env } from '@/lib/env';

export const aiClient = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});