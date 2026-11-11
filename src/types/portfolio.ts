export type Profile = {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  education: string;
  experience: string;
};

export type Project = {
  name: string;
  description: string;
  stack: string[];
  status: string;
  repository?: string;
  demo?: string;
};

export type SkillGroups = Record<string, string[]>;
