import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  status: 'Active' | 'Completed';
}

export function ProjectCard({ title, description, tags, status }: ProjectCardProps) {
  return (
    <Card className="elegant-shadow smooth-transition hover:shadow-lg h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant={status === 'Active' ? 'default' : 'secondary'} className="flex-shrink-0">
            {status}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
        <div>
          <h4 className="font-medium text-primary mb-3 text-sm">Key Technologies</h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <Badge key={i} variant="outline">{tag}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}