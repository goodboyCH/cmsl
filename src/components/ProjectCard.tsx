import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from 'lucide-react'; // 1. 담당자 아이콘 import

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  status: 'Active' | 'Completed';
  logo_url?: string; // 2. 협력체 로고 prop 추가
  person_in_charge?: string; // 3. 담당자 prop 추가
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
    // 4. 전체 카드 디자인 수정 (로고, 담당자 필드 추가)
    <Card className="elegant-shadow smooth-transition hover:shadow-lg flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          {/* 협력체 로고 (있을 경우에만) */}
          {logo_url ? (
            <img 
              src={logo_url} 
              alt={`${title} logo`} 
              className="h-10 max-w-[120px] object-contain flex-shrink-0"
            />
          ) : (
            <div /> // 로고가 없을 때 배지 정렬을 위한 빈 div
          )}
          {/* 상태 배지 */}
          <Badge 
            variant={status === 'Active' ? 'default' : 'secondary'}
            className={`ml-auto flex-shrink-0 ${status === 'Active' ? 'bg-primary' : ''}`}
          >
            {status}
          </Badge>
        </div>
        <CardTitle className="pt-4 text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{description}</p>
        
        {/* 담당자 (있을 경우에만) */}
        {person_in_charge && (
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{person_in_charge}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {/* 태그 (있을 경우에만) */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <h4 className="font-medium text-primary text-sm mr-2 sr-only">Key Tech:</h4>
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}