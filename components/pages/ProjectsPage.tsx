import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, CheckCircle, Archive, Clock, ListChecks, Users, Target, Building } from 'lucide-react';
import { EditProjectPage } from './EditProjectPage';

interface Project {
  id: number;
  title: string;
  thumbnail_url: string | null;
  description: string | null;
  status: string | null;
  pi: string | null;
  funding_agency: string | null;
  duration: string | null;
  objectives: string[];
  collaborators: string[];
}

type ViewMode = { mode: 'list' } | { mode: 'edit', id: number };

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<ViewMode>({ mode: 'list' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (view.mode === 'list') fetchProjects();
  }, [view.mode]);

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'Active': return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1"/>Active</Badge>;
      case 'Planning': return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1"/>Planning</Badge>;
      case 'Completed': return <Badge variant="outline"><Archive className="h-3 w-3 mr-1"/>Completed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;

  if (view.mode === 'edit') {
    return <EditProjectPage projectId={view.id} onBack={() => setView({ mode: 'list' })} />;
  }

  return (
    <div className="container px-4 sm:px-8 py-8 md:py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary">Projects</h1>
        <p className="text-lg sm:text-xl text-muted-foreground">Ongoing and completed research projects at CMSL.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="elegant-shadow text-center">
            <CardContent className="p-4 sm:p-6">
                <ListChecks className="h-6 sm:h-8 w-auto mx-auto text-primary mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-primary">{totalProjects}</div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Projects</p>
            </CardContent>
        </Card>
        <Card className="elegant-shadow text-center">
            <CardContent className="p-4 sm:p-6">
                <CheckCircle className="h-6 sm:h-8 w-auto mx-auto text-green-500 mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-green-500">{activeProjects}</div>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Projects</p>
            </CardContent>
        </Card>
        <Card className="elegant-shadow text-center">
            <CardContent className="p-4 sm:p-6">
                <Archive className="h-6 sm:h-8 w-auto mx-auto text-gray-500 mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-gray-500">{completedProjects}</div>
                <p className="text-xs sm:text-sm text-muted-foreground">Completed Projects</p>
            </CardContent>
        </Card>
      </div>

      {loading && <p className="text-center">Loading projects...</p>}
      
      {!loading && projects.length === 0 && (
        <Card><CardContent className="p-12 text-center text-muted-foreground"><p>등록된 프로젝트가 없습니다. 관리자 페이지에서 새 프로젝트를 추가해주세요.</p></CardContent></Card>
      )}

      <div className="space-y-6 sm:space-y-8">
        {projects.map((project) => (
          <Card key={project.id} className="elegant-shadow smooth-transition hover:shadow-lg relative overflow-hidden">
            <CardContent> {/* 반응형 CardContent의 기본 패딩 사용 */}
              <div className="flex flex-col h-full">
                
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 sm:gap-4 mb-4">
                  <div className="flex-grow pr-4 order-2 sm:order-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-primary">{project.title}</h2>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">{project.description}</p>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0 order-1 sm:order-2">
                    {getStatusBadge(project.status)}
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{project.duration}</p>
                  </div>
                </div>

                <div className="border-b"></div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-4">
                  {project.thumbnail_url && (
                    <div className="lg:col-span-3">
                      <img 
                        src={project.thumbnail_url} 
                        alt={project.title} 
                        className="w-full h-auto aspect-video object-cover rounded-md border"
                      />
                    </div>
                  )}
                  
                  <div className={`space-y-4 ${project.thumbnail_url ? 'lg:col-span-4' : 'lg:col-span-6'}`}>
                    <div>
                      <h4 className="font-semibold text-primary flex items-center gap-2"><Building className="h-4 w-4" />Project Info</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                        <li><strong>PI:</strong> {project.pi}</li>
                        <li><strong>Funding:</strong> {project.funding_agency}</li>
                      </ul>
                    </div>
                    {project.collaborators && project.collaborators.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-primary flex items-center gap-2"><Users className="h-4 w-4" />Collaborators</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.collaborators.map((collab, i) => <Badge key={i} variant="secondary">{collab}</Badge>)}
                        </div>
                      </div>
                    )}
                  </div>

                  {project.objectives && project.objectives.length > 0 && (
                    <div className={`${project.thumbnail_url ? 'lg:col-span-5' : 'lg:col-span-6'}`}>
                      <h4 className="font-semibold text-primary flex items-center gap-2"><Target className="h-4 w-4" />Research Objectives</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                        {project.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            {session && (
              <div className="absolute top-4 right-4 space-x-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setView({ mode: 'edit', id: project.id })}><Edit className="h-4 w-4" /></Button>
                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(project.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}