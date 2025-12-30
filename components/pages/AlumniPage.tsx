'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { GraduationCap, Building2, BookOpen, Calendar } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '../LanguageProvider';
import { ScrollAnimation } from '../ScrollAnimation'; // ScrollAnimation 임포트

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
  const { t } = useLanguage();
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('alumni')
          .select('*')
          .order('graduation_year', { ascending: false });
        
        if (error) {
          setError(error.message);
        } else {
          setAlumni(data as Alumni[] || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  // 학위별 색상 지정
  const getDegreeColor = (degree: string) => {
    if (degree.includes('Ph.D.')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    if (degree.includes('M.S.')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
  };

  // 데이터 그룹화 및 정렬 (졸업연도 내림차순 -> 이름 오름차순)
  const sortLogic = (a: Alumni, b: Alumni) => {
    const yearA = parseInt(a.graduation_year || '0');
    const yearB = parseInt(b.graduation_year || '0');
    if (yearB !== yearA) return yearB - yearA;
    return (a.name || '').localeCompare(b.name || '');
  };

  const groupedAlumni = {
    'Ph.D.': alumni.filter(a => a.degree.includes('Ph.D.')).sort(sortLogic),
    'M.S.': alumni.filter(a => a.degree.includes('M.S.')).sort(sortLogic),
  };

  const alumniGroups = [
    { title: 'Doctoral Alumni (Ph.D.)', key: 'Ph.D.', members: groupedAlumni['Ph.D.'] },
    { title: 'Master\'s Alumni (M.S.)', key: 'M.S.', members: groupedAlumni['M.S.'] },
  ];

  const handleFilterClick = (degree: string) => {
    setActiveFilter(activeFilter === degree ? null : degree);
  };

  const displayedGroups = activeFilter 
    ? alumniGroups.filter(group => group.key === activeFilter)
    : alumniGroups;

  if (loading) return <div className="text-center py-20 text-muted-foreground">Loading alumni data...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Failed to load alumni data.</div>;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-12 space-y-12">
      {/* 헤더 섹션 */}
      <ScrollAnimation>
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-primary sm:text-4xl">{t('alumni.header.title')}</h1>
          <p className="text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
            {t('alumni.header.desc')}
          </p>
        </div>
      </ScrollAnimation>

      {/* 필터 통계 카드 */}
      <ScrollAnimation delay={100}>
        <div className="grid grid-cols-2 max-w-2xl mx-auto gap-4 sm:gap-6">
          {alumniGroups.map((group) => group.members.length > 0 && (
            <Card 
              key={group.key} 
              className={`elegant-shadow text-center cursor-pointer transition-all duration-300 ${activeFilter === group.key ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'}`}
              onClick={() => handleFilterClick(group.key)}
            >
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-1">{group.members.length}</div>
                <p className="text-sm font-medium text-muted-foreground">{group.key} Alumni</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollAnimation>

      {/* 졸업생 리스트 섹션 */}
      {displayedGroups.map(group => group.members.length > 0 && (
        <ScrollAnimation key={group.key} delay={200}>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-primary">{group.title}</h2>
              <div className="h-px bg-muted flex-grow" />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {group.members.map((person) => (
                <Card key={person.id} className="hover:shadow-lg transition-all duration-300 border-muted/60 flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="text-xl font-bold">{person.name}</CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getDegreeColor(person.degree)}>{person.degree}</Badge>
                          <span className="text-xs text-muted-foreground flex items-center bg-muted px-2 py-1 rounded-md">
                            <Calendar className="h-3 w-3 mr-1" />
                            Class of {person.graduation_year}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 flex-grow">
                    {/* 현재 직위 */}
                    {person.current_position && (
                      <div className="flex items-start gap-2 text-sm text-foreground/90 bg-primary/5 p-3 rounded-lg border border-primary/10">
                        <Building2 className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                        <span className="font-semibold">{person.current_position}</span>
                      </div>
                    )}
                    
                    {/* 논문 제목 */}
                    {person.thesis && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          <BookOpen className="h-3 w-3" />
                          Thesis
                        </div>
                        <p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-3" title={person.thesis}>
                          "{person.thesis}"
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ScrollAnimation>
      ))}

      {!loading && alumni.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No alumni records found.
        </div>
      )}
    </div>
  );
}