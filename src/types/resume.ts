export type CareerLevel =
  | 'staff_experienced'
  | 'staff_new'
  | 'designer_s'
  | 'designer_a'
  | 'designer_b'
  | 'designer_c'
  | 'designer_d';

export const CAREER_LABELS: Record<CareerLevel, string> = {
  staff_experienced: '헤어스탭 (경력 O)',
  staff_new: '헤어스탭 (경력 X)',
  designer_s: '디자이너 (상)',
  designer_a: '디자이너 (중상)',
  designer_b: '디자이너 (중)',
  designer_c: '디자이너 (중하)',
  designer_d: '디자이너 (하)',
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
  certifications: string;
  portfolio: PortfolioItem[];
  introduction: string;
}
