import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Mail, GraduationCap, Building, Award } from 'lucide-react';
import { Member } from '@/types';

interface MemberDetailModalProps {
  member: Member | null;
  onClose: () => void;
}

export function MemberDetailModal({ member, onClose }: MemberDetailModalProps) {
  if (!member) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in-0"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <Card className="w-[90vw] max-w-2xl elegant-shadow animate-in zoom-in-95">
          {/* ⬇️ CardHeader의 패딩과 내부 간격을 조정합니다. ⬇️ */}
          <CardHeader className="flex flex-row items-start space-x-8 p-8">
            {/* ⬇️ 이미지 크기를 w-32 h-32에서 w-40 h-40으로 키웁니다. ⬇️ */}
            <img src={member.image_url} alt={member.name} className="w-42 h-56 rounded-lg object-cover border" />
            <div className="flex-1 pt-2">
              <CardTitle className="text-4xl text-primary">{member.name}</CardTitle>
              <CardDescription className="text-xl mt-1">{member.position}</CardDescription>
              <div className="flex items-center gap-2 mt-6 text-base text-muted-foreground">
                <Mail className="h-5 w-5" />
                <span>{member.email}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4"><X className="h-5 w-5" /></Button>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary flex items-center gap-2"><GraduationCap className="h-5 w-5" /> Research Focus</h4>
              <p className="text-muted-foreground">{member.research_focus}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <h4 className="font-semibold text-primary flex items-center gap-2"><Building className="h-5 w-5" /> Education</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {(member.education || []).map((edu, i) => <li key={i}>{edu}</li>)}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-primary flex items-center gap-2"><Award className="h-5 w-5" /> Awards</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {(member.awards || []).map((award, i) => <li key={i}>{award}</li>)}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}