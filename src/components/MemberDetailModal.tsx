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
        {/* --- ⬇️ 모바일 화면에서 모달이 잘리지 않도록 max-h와 overflow-y-auto 추가 ⬇️ --- */}
        <Card className="w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto elegant-shadow animate-in zoom-in-95">
          <CardHeader className="flex flex-col items-center space-y-4 p-4 text-center sm:flex-row sm:space-y-0 sm:space-x-8 sm:p-8 sm:text-left">
            <img src={member.image_url} alt={member.name} className="w-32 h-40 sm:w-40 sm:h-52 rounded-lg object-cover border flex-shrink-0" />
            <div className="flex-1 sm:pt-2">
              <CardTitle className="text-3xl sm:text-4xl text-primary">{member.name}</CardTitle>
              <CardDescription className="text-lg sm:text-xl mt-1">{member.position}</CardDescription>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-4 sm:mt-6 text-sm sm:text-base text-muted-foreground">
                <Mail className="h-5 w-5" />
                <span>{member.email}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2 sm:top-4 sm:right-4"><X className="h-5 w-5" /></Button>
          </CardHeader>
          {/* --- ⬇️ CardHeader와의 중복 여백을 제거하기 위해 pt-0 추가 ⬇️ --- */}
          <CardContent className="px-4 pb-6 sm:px-8 sm:pb-8 space-y-6 pt-0">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary flex items-center gap-2"><GraduationCap className="h-5 w-5" /> Research Focus</h4>
              <p className="text-muted-foreground">{member.research_focus}</p>
            </div>
             {/* --- ⬇️ 모바일에서 1열, md 이상에서 2열로 변경 ⬇️ --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-primary flex items-center gap-2"><Building className="h-5 w-5" /> Education</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {(member.education || []).map((edu, i) => <li key={i}>{edu}</li>)}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-primary flex items-center gap-2"><Award className="h-5 w-5" /> Experience/Awards</h4>
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