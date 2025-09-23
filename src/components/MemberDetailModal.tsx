import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Mail, GraduationCap, Building, Award } from 'lucide-react';
import { Member } from '@/types'; // 1. 중앙 타입 파일에서 Member 타입을 가져옵니다.

// 2. 이 파일에 있던 기존 Member 타입 정의는 삭제합니다.

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
          <CardHeader className="flex flex-row items-start space-x-6">
            <img src={member.image_url} alt={member.name} className="w-32 h-32 rounded-lg object-cover border" />
            <div className="flex-1">
              <CardTitle className="text-3xl text-primary">{member.name}</CardTitle>
              <CardDescription className="text-lg">{member.position}</CardDescription>
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{member.email}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4"><X className="h-5 w-5" /></Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary flex items-center gap-2"><GraduationCap className="h-5 w-5" /> Research Focus</h4>
              <p className="text-muted-foreground">{member.research_focus}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-primary flex items-center gap-2"><Building className="h-5 w-5" /> Education</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {/* 3. education이 null일 경우를 대비해 || [] 추가 (사이트 멈춤 방지) */}
                  {(member.education || []).map((edu, i) => <li key={i}>{edu}</li>)}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-primary flex items-center gap-2"><Award className="h-5 w-5" /> Awards</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {/* 3. awards가 null일 경우를 대비해 || [] 추가 (사이트 멈춤 방지) */}
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