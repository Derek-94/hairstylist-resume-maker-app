export type CareerLevel = 'newcomer' | 'junior' | 'mid' | 'senior';

export const CAREER_LABELS: Record<CareerLevel, string> = {
  newcomer: '신입',
  junior: '경력 1~3년',
  mid: '경력 3~5년',
  senior: '경력 5년 이상',
};

export const EDUCATION_OPTIONS = ['고졸', '전문대졸', '대졸', '재학중', '기타'] as const;
export type Education = (typeof EDUCATION_OPTIONS)[number] | '';

export interface PortfolioItem {
  uri: string;
  width: number;
  height: number;
}

export interface ResumeData {
  name: string;
  birthDate: string;
  gender: '남' | '여' | '';
  phone: string;
  email: string;
  address: string;
  education: Education;
  availableStartDate: string;
  profileImageUri: string | null;
  skills: string[];
  careerLevel: CareerLevel | null;
  careerDetail: string;
  certifications: string;
  portfolio: PortfolioItem[];
  introduction: string;
}
