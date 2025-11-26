// src/types.ts

// src/types.ts

export interface Member {
  id: number;
  name: string;
  name_ko?: string; // 추가됨
  position: string;
  position_ko?: string; // 추가됨
  year: string;
  research_focus: string;
  research_focus_ko?: string; // 추가됨
  email: string;
  image_url: string;
  education: string[];
  education_ko?: string[]; // 추가됨
  awards: string[];
  awards_ko?: string[]; // 추가됨
  display_order?: number;
}

// 앞으로 추가될 다른 타입들도 여기에 정의하면 좋습니다 (예: Alumni)
export interface Alumni {
  id: number;
  name: string;
  name_ko?: string;
  degree: string;
  thesis: string | null;
  current_position: string | null;
  current_position_ko?: string | null;
  achievements: string[] | null;
  graduation_year: string;
}