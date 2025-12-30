export interface Member {
  id: number;
  name: string;
  name_ko?: string;
  position: string;
  position_ko?: string;
  year: string;
  research_focus: string;
  research_focus_ko?: string;
  email: string;
  image_url: string;
  education: string[];
  education_ko?: string[];
  awards: string[];
  awards_ko?: string[];
  display_order?: number;
}

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
