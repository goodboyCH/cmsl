import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  status: 'Active' | 'Completed';
  logo_url?: string;
  person_in_charge?: string;
}

export function ProjectCard({ 
  title, 
  description, 
  tags, 
  status, 
  logo_url, 
  person_in_charge 
}: ProjectCardProps) {
  
  return (
    <Card className="elegant-shadow smooth-transition hover:shadow-lg flex flex-col h-full bg-white border-muted/40">
      <CardHeader className="pb-3">
        {/* --- ⬇️ 2. 로고와 제목을 한 줄에 배치 + 로고 크기 확대 ⬇️ --- */}
        <div className="flex items-center gap-4 mb-2">
          {logo_url && (
            <div className="flex-shrink-0 bg-white p-1 rounded-md border border-gray-100">
              <img 
                src={logo_url} 
                alt={`${title} logo`} 
                className="h-12 w-auto object-contain" // h-12로 크기 확대
              />
            </div>
          )}
          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-lg font-bold text-primary leading-tight break-words">{title}</CardTitle>
              <Badge 
                variant={status === 'Active' ? 'default' : 'secondary'}
                className={`flex-shrink-0 ${status === 'Active' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
              >
                {status}
              </Badge>
            </div>
          </div>
        </div>
        {/* --- ⬆️ 수정 완료 ⬆️ --- */}
      </CardHeader>

      <CardContent className="flex-grow pb-4">
        {/* --- ⬇️ 2. 설명 텍스트 사이즈 축소 (text-sm -> text-xs) ⬇️ --- */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
          {description}
        </p>
        
        {person_in_charge && (
          <div className="flex items-center gap-2 mt-3 text-xs font-medium text-gray-500">
            <User className="h-3 w-3" />
            <span>{person_in_charge}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-200">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}