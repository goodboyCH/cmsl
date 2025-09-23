import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, CheckCircle, Archive, Clock, ListChecks } from 'lucide-react';
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
    <div className="max-w-[1400px] mx-auto px-8 lg:px-20 py-8 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">Projects</h1>
        <p className="text-xl text-muted-foreground">Ongoing and completed research projects at CMSL.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="elegant-shadow text-center"><CardContent className="pt-6"><ListChecks className="h-8 w-8 mx-auto text-primary mb-2" /><div className="text-3xl font-bold text-primary">{totalProjects}</div><p className="text-sm text-muted-foreground">Total Projects</p></CardContent></Card>
        <Card className="elegant-shadow text-center"><CardContent className="pt-6"><CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" /><div className="text-3xl font-bold text-green-500">{activeProjects}</div><p className="text-sm text-muted-foreground">Active Projects</p></CardContent></Card>
        <Card className="elegant-shadow text-center"><CardContent className="pt-6"><Archive className="h-8 w-8 mx-auto text-gray-500 mb-2" /><div className="text-3xl font-bold text-gray-500">{completedProjects}</div><p className="text-sm text-muted-foreground">Completed Projects</p></CardContent></Card>
      </div>

      {loading && <p className="text-center">Loading projects...</p>}
      
      {!loading && projects.length === 0 && (
        <Card><CardContent className="p-12 text-center text-muted-foreground"><p>등록된 프로젝트가 없습니다. 관리자 페이지에서 새 프로젝트를 추가해주세요.</p></CardContent></Card>
      )}

      <div className="space-y-8">
        {projects.map((project) => (
          <Card key={project.id} className="elegant-shadow smooth-transition hover:shadow-lg relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col h-full">

                {/* ⬇️ 새로운 카드 레이아웃 시작 ⬇️ */}
                
                {/* 1. 상단부 (제목, 설명 / 상태, 기간) */}
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="flex-grow pr-4">
                    <h2 className="text-2xl font-bold text-primary">{project.title}</h2>
                    <p className="text-muted-foreground mt-1">{project.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {getStatusBadge(project.status)}
                    <p className="text-sm text-muted-foreground mt-1">{project.duration}</p>
                  </div>
                </div>

                {/* 2. 구분선 */}
                <div className="border-b my-4"></div>

                {/* 3. 하단부 (썸네일, 정보, 목표) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* 작은 썸네일 */}
                  <div className="md:col-span-3">
                    {project.thumbnail_url && (
                      <img 
                        src={project.thumbnail_url} 
                        alt={project.title} 
                        className="w-full h-auto aspect-video object-cover rounded-md border"
                      />
                    )}
                  </div>
                  
                  {/* Project Info & Collaborators */}
                  <div className="md:col-span-4 space-y-4">
                    <div>
                      <h4 className="font-semibold text-primary">Project Information</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                        <li><strong>PI:</strong> {project.pi}</li>
                        <li><strong>Funding:</strong> {project.funding_agency}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">Collaborators</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(project.collaborators || []).map((collab, i) => <Badge key={i} variant="secondary">{collab}</Badge>)}
                      </div>
                    </div>
                  </div>

                  {/* Research Objectives */}
                  <div className="md:col-span-5">
                    <h4 className="font-semibold text-primary">Research Objectives</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                      {(project.objectives || []).map((obj, i) => <li key={i}>{obj}</li>)}
                    </ul>
                  </div>
                </div>
                {/* ⬆️ 새로운 카드 레이아웃 종료 ⬆️ */}

              </div>
            </CardContent>
            {session && <div className="absolute bottom-4 right-4 space-x-2 z-10"><Button variant="outline" size="icon" onClick={() => setView({ mode: 'edit', id: project.id })}><Edit className="h-4 w-4" /></Button><Button variant="destructive" size="icon" onClick={() => handleDelete(project.id)}><Trash2 className="h-4 w-4" /></Button></div>}
          </Card>
        ))}
      </div>
    </div>
  );
}