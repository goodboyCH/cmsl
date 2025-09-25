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

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error("Error fetching members:", error);
      } else {
        setMembers(data || []);
      }
      setLoading(false);
    };
    fetchMembers();
  }, []);

  const getPositionColor = (position: string) => {
    if (position.includes('Postdoctoral')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (position.includes('Ph.D.')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    if (position.includes('M.S.')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
  };

  const groupedMembers = {
    postdocs: members.filter(m => m.position === 'Postdoctoral Researcher'),
    phds: members.filter(m => m.position === 'Ph.D. Student'),
    ms: members.filter(m => m.position === 'M.S. Student'),
    undergrads: members.filter(m => m.position === 'Undergraduate Student'),
  };

  const memberGroups = [
    { title: 'Postdoctoral Researchers', members: groupedMembers.postdocs },
    { title: 'Ph.D. Students', members: groupedMembers.phds },
    { title: 'M.S. Students', members: groupedMembers.ms },
    { title: 'Undergraduate Students', members: groupedMembers.undergrads },
  ];

  if (loading) {
    return <p className="text-center p-12">Loading members...</p>;
  }

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-8 space-y-12">
        <ScrollAnimation>
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">Our Team</h1>
            <p className="text-xl text-muted-foreground">
              Meet the talented researchers advancing computational materials science
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={100}>
          <div className="grid md:grid-cols-4 gap-6">
            {memberGroups.map(group => group.members.length > 0 && (
              <Card key={group.title} className="elegant-shadow text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">{group.members.length}</div>
                  <p className="text-muted-foreground">{group.title.replace(' Researchers', '').replace(' Students', '')}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollAnimation>

        {memberGroups.map(group => group.members.length > 0 && (
          <ScrollAnimation key={group.title} delay={200}>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary">{group.title}</h2>
              {/* 한 줄에 2개의 카드를 표시하도록 그리드 설정 */}
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                {group.members.map((member) => (
                  <Card 
                    key={member.id}
                    className="elegant-shadow smooth-transition hover:shadow-lg cursor-pointer"
                    onClick={() => setSelectedMember(member)}
                  >
                    {/* ⬇️ 여기가 완전히 새로 구성된 카드 레이아웃입니다. ⬇️ */}
                    <CardContent className="p-4">
                      <div className="flex items-center gap-6">
                        {/* 1. 프로필 이미지 */}
                        <img 
                          src={member.image_url} 
                          alt={member.name} 
                          className="w-36 h-48 rounded-md object-cover border flex-shrink-0" // 3:4 비율 (w-24 h-32)
                        />
                        {/* 2. 텍스트 정보 전체 영역 */}
                        <div className="flex flex-col justify-between h-full w-full">
                          {/* 2a. 상단 정보 (이름, 직책, 기간) */}
                          <div>
                            <Badge className={`${getPositionColor(member.position)} mb-2`}>
                              {member.position}
                            </Badge>
                            <CardTitle className="text-xl">{member.name}</CardTitle>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <Calendar className="h-4 w-4" />
                              {member.year}
                            </div>
                          </div>
                          
                          {/* 2b. 중간 정보 (Research) */}
                          <div className="mt-3">
                            <h4 className="font-medium text-primary text-sm mb-1 flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              Research
                            </h4>
                            <p className="text-muted-foreground leading-snug text-sm">
                              {member.research_focus}
                            </p>
                          </div>

                          {/* 2c. 하단 정보 (이메일) */}
                          <div className="pt-3 border-t mt-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <span>{member.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    {/* ⬆️ 카드 레이아웃 끝 ⬆️ */}
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