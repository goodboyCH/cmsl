import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { GraduationCap, Building2, BookOpen } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '../LanguageProvider'; // 1. import 추가

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

export function AlumniPage() {
  const { t } = useLanguage(); // 2. useLanguage 훅 사용
  // useState로 상태 관리 (MembersPage 스타일)
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect로 데이터 페칭
  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('alumni')
          .select('*')
          .order('graduation_year', { ascending: false });
        
        if (error) {
          console.error("Error fetching alumni:", error);
          setError(error.message);
        } else {
          setAlumni(data as Alumni[] || []);
        }
      } catch (err: any) {
        console.error("Unexpected error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  // 정렬 로직 (데이터가 로드된 후 렌더링 시 수행)
  const sortedAlumni = [...alumni].sort((a, b) => {
    const yearA = parseInt(a.graduation_year || '0');
    const yearB = parseInt(b.graduation_year || '0');
    
    if (yearB === yearA) {
        return (a.name || '').localeCompare(b.name || '');
    }
    return yearB - yearA;
  });

  if (loading) return <div className="text-center py-20 text-muted-foreground">Loading alumni data...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Failed to load alumni data.</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-10 text-center">
      <h1 className="text-4xl font-bold mb-4 text-primary">{t('alumni.header.title')}</h1>
        <p className="text-lg text-muted-foreground">
          {t('alumni.header.desc')}
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
      
      {!loading && sortedAlumni.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No alumni records found.
        </div>
      )}
    </div>
  );
}