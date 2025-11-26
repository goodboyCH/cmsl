import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { GraduationCap, Building2, BookOpen } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// DB 스키마 타입 정의
interface Alumni {
  id: number;
  name: string;
  degree: string;
  thesis: string | null;
  current_position: string | null;
  achievements: string[] | null;
  graduation_year: string;
}

// [수정됨] export default -> export function으로 변경
export function AlumniPage() {
  // 데이터 불러오기
  const { data: alumni, isLoading, error } = useQuery({
    queryKey: ['alumni-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .order('graduation_year', { ascending: false });
      
      if (error) throw error;
      return data as Alumni[];
    },
  });

  // 정렬 로직 (연도 내림차순 -> 이름 오름차순)
  const sortedAlumni = [...(alumni || [])].sort((a, b) => {
    const yearA = parseInt(a.graduation_year || '0');
    const yearB = parseInt(b.graduation_year || '0');
    
    if (yearB === yearA) {
        return (a.name || '').localeCompare(b.name || '');
    }
    return yearB - yearA;
  });

  if (isLoading) return <div className="text-center py-20 text-muted-foreground">Loading alumni data...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Failed to load alumni data.</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">Alumni</h1>
        <p className="text-lg text-muted-foreground">
          Meet our distinguished graduates who are making an impact in their fields.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedAlumni.map((person) => (
          <Card key={person.id} className="hover:shadow-lg transition-all duration-300 border-muted/60">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <CardTitle className="text-xl font-bold">{person.name}</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="font-medium">{person.degree}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center bg-muted px-2 py-0.5 rounded-full">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      {person.graduation_year}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* 현재 직위 */}
              {person.current_position && (
                <div className="flex items-start gap-2 text-sm text-foreground/90">
                  <Building2 className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <span className="font-medium">{person.current_position}</span>
                </div>
              )}
              
              {/* 논문 제목 */}
              {person.thesis && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground group">
                  <BookOpen className="h-4 w-4 mt-0.5 shrink-0 group-hover:text-primary transition-colors" />
                  <span className="italic line-clamp-2" title={person.thesis}>
                    "{person.thesis}"
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {sortedAlumni.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No alumni records found.
        </div>
      )}
    </div>
  );
}