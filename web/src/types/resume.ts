export type RegionMode = "us" | "eu";

export type Bullet = {
  id: string;
  text: string;
  evidenceIds: string[];
};

export type ExperienceBlock = {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  location?: string;
  bullets: Bullet[];
};

export type EducationBlock = {
  id: string;
  school: string;
  degree: string;
  start: string;
  end: string;
  gpa?: string;
  achievements?: string[];
};

export type CertificationBlock = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
};

export type AchievementBlock = {
  id: string;
  title: string;
  description: string;
  date?: string;
};

export type RecommendationBlock = {
  id: string;
  recommenderName: string;
  recommenderRole: string;
  company: string;
  relationship: string;
  text: string;
};

export type EvidenceSource = {
  id: string;
  label: string;
  detail?: string;
  url?: string;
};

export type ResumeContent = {
  contact: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    links?: string[];
  };
  headline: string;
  summary: string;
  experience: ExperienceBlock[];
  education: EducationBlock[];
  certifications?: CertificationBlock[];
  achievements?: AchievementBlock[];
  recommendations?: RecommendationBlock[];
  skills: string[];
  evidence: EvidenceSource[];
};

export const emptyResumeContent = (): ResumeContent => ({
  contact: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    links: [],
  },
  headline: "",
  summary: "",
  experience: [],
  education: [],
  certifications: [],
  achievements: [],
  recommendations: [],
  skills: [],
  evidence: [],
});
