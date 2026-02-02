import { $Enums } from "@prisma/client";
type ProfileType = $Enums.ProfileType;
import {
  buildResumeRewritePrompt,
  buildResumeBulletsPrompt,
  buildCoverLetterPrompt,
  buildInterviewPackPrompt,
} from "./prompt-templates";

export function generateAllPrompts(args: {
  profileType: ProfileType;
  jobJson: unknown;
  candidateProfile?: unknown;
}) {
  const { profileType, jobJson, candidateProfile } = args;

  return [
    {
      type: "resume_rewrite",
      content: buildResumeRewritePrompt(profileType, jobJson, candidateProfile),
    },
    {
      type: "resume_bullets",
      content: buildResumeBulletsPrompt(profileType, jobJson, candidateProfile),
    },
    {
      type: "cover_letter",
      content: buildCoverLetterPrompt(profileType, jobJson, candidateProfile),
    },
    {
      type: "interview_pack",
      content: buildInterviewPackPrompt(profileType, jobJson, candidateProfile),
    },
  ];
}
