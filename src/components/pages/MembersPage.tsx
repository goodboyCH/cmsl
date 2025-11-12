import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollAnimation } from '../ScrollAnimation';
import { MemberDetailModal } from '../MemberDetailModal';
import { Mail, GraduationCap, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Member {
  id: number;
  name: string;
  position: string;
  year: string;
  research_focus: string;
  email: string;
  image_url: string;
  education: string[];
  awards: string[];
}

export function MembersPage() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) console.error("Error fetching members:", error);
      else setMembers(data || []);
      setLoading(false);
    };
    fetchMembers();
  }, []);

  const getPositionColor = (position: string) => {
    if (position.includes('Research Professor')) return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
    if (position.includes('Postdoctoral')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (position.includes('Ph.D.')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    if (position.includes('M.S.')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
  };

  const groupedMembers = {
    'Research Professor': members.filter(m => m.position === 'Research Professor'),
    'Postdoctoral Researcher': members.filter(m => m.position === 'Postdoctoral Researcher'),
    'Ph.D. Student': members.filter(m => m.position === 'Ph.D. Student'),
    'M.S. Student': members.filter(m => m.position === 'M.S. Student'),
    'Undergraduate Student': members.filter(m => m.position === 'Undergraduate Student'),
  };

  const memberGroups = [
    { title: 'Research Professors', members: groupedMembers['Research Professor'] },
    { title: 'Postdoctoral Researchers', members: groupedMembers['Postdoctoral Researcher'] },
    { title: 'Ph.D. Students', members: groupedMembers['Ph.D. Student'] },
    { title: 'M.S. Students', members: groupedMembers['M.S. Student'] },
    { title: 'Undergraduate Students', members: groupedMembers['Undergraduate Student'] },
  ];
  
  const handleFilterClick = (position: string) => {
    setActiveFilter(activeFilter === position ? null : position);
  };

  const displayedGroups = activeFilter 
    ? memberGroups.filter(group => group.members.some(member => member.position === activeFilter))
    : memberGroups;

  if (loading) return <p className="text-center p-12">Loading members...</p>;

  return (
    <>
      {/* --- ⬇️ 페이지 전체 여백을 반응형으로 수정 ⬇️ --- */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-8 space-y-12">
        <ScrollAnimation>
          <div className="text-center space-y-4">
            {/* --- ⬇️ 타이틀 텍스트 크기를 반응형으로 수정 ⬇️ --- */}
            <h1 className="text-3xl font-bold text-primary sm:text-4xl">Our Team</h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Meet the talented researchers advancing computational materials science
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={100}>
          {/* --- ⬇️ 통계 카드 그리드를 반응형으로 수정 ⬇️ --- */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {Object.entries(groupedMembers).map(([position, membersList]) => membersList.length > 0 && (
              <Card 
                key={position} 
                className={`elegant-shadow text-center cursor-pointer transition-all duration-300 ${activeFilter === position ? 'ring-2 ring-primary' : 'hover:bg-muted/50'}`}
                onClick={() => handleFilterClick(position)}
              >
                <CardContent className="pt-4 sm:pt-6">
                  {/* --- ⬇️ 통계 숫자 크기를 반응형으로 수정 ⬇️ --- */}
                  <div className="text-2xl font-bold text-primary mb-1 sm:text-3xl sm:mb-2">{membersList.length}</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{position.replace(' Researcher', '').replace(' Student', '')}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollAnimation>

        {displayedGroups.map(group => group.members.length > 0 && (
          <ScrollAnimation key={group.title} delay={200}>
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-primary">{group.title}</h2>
              {/* --- ⬇️ 멤버 카드 그리드를 반응형으로 수정 ⬇️ --- */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {group.members.map((member) => (
                  <Card 
                    key={member.id}
                    className="elegant-shadow smooth-transition hover:shadow-lg cursor-pointer"
                    onClick={() => setSelectedMember(member)}
                  >
                    <CardContent className="p-4">
                       {/* --- ⬇️ 멤버 카드 내부 레이아웃을 반응형으로 수정 ⬇️ --- */}
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                        <img 
                          src={member.image_url} 
                          alt={member.name} 
                          className="w-32 h-40 sm:w-36 sm:h-48 rounded-md object-cover border flex-shrink-0"
                        />
                        <div className="flex flex-col justify-between h-full w-full">
                          <div>
                            <Badge className={`${getPositionColor(member.position)} mb-2`}>{member.position}</Badge>
                            {/* CardTitle이 자동으로 반응형 텍스트 크기를 가집니다. */}
                            <CardTitle>{member.name}</CardTitle>
                            <div className="flex items-center justify-center sm:justify-start gap-1 text-sm text-muted-foreground mt-1">
                              <Calendar className="h-4 w-4" />
                              {member.year}
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <h4 className="font-medium text-primary text-sm mb-1 flex items-center justify-center sm:justify-start gap-2">
                              <GraduationCap className="h-4 w-4" />
                              Research
                            </h4>
                            <p className="text-muted-foreground leading-snug text-sm">{member.research_focus}</p>
                          </div>

                          <div className="pt-3 border-t mt-3">
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <span>{member.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        ))}
      </div>

      <MemberDetailModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </>
  );
}