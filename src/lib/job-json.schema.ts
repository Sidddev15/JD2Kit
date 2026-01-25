import {z} from 'zod';

export const JobJsonSchema = z.object({
  company_name: z.string().nullable(),
  role_title: z.string().min(2),
  experience_years: z.string().regex(/^\d+\+?$/, "Must be like '3+' or '5+'").nullable(),
  location: z.string().nullable(),
  seniority_level: z.enum(["junior", "mid", "senior", "lead"]).nullable(),
  domain: z.string().nullable(),
  responsibilities: z.array(z.string()).min(3),
  must_have_skills: z.array(z.string()).min(5),
  good_to_have_skills: z.array(z.string()).optional(),
  tech_stack: z.array(z.string()).min(5),
  keywords_for_ats: z.array(z.string()).min(10),
});

export type JobJson = z.infer<typeof JobJsonSchema>;