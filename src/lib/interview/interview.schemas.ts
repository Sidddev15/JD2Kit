import { z } from "zod";

const topicSchema = z.object({
  title: z.string(),
  summary: z.string().optional(),
});

const questionSchema = z.object({
  question: z.string(),
  category: z.string().optional(),
});

const answerGuideSchema = z.object({
  question: z.string(),
  guide: z.string(),
});

const codingTaskSchema = z.object({
  prompt: z.string(),
  difficulty: z.string().optional(),
});

const systemDesignSchema = z.object({
  prompt: z.string(),
  focus: z.string().optional(),
});

export const InterviewPackSchema = z.object({
  topics: z.array(topicSchema).default([]),
  questions: z.array(questionSchema).default([]),
  answerGuides: z.array(answerGuideSchema).default([]),
  followUps: z.array(z.string()).default([]),
  codingTasks: z.array(codingTaskSchema).default([]),
  systemDesign: z.array(systemDesignSchema).default([]),
});

export type InterviewPack = z.infer<typeof InterviewPackSchema>;
