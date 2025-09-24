import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { EditMemberPage } from './EditMemberPage';
import { EditAlumniPage } from './EditAlumniPage';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Session } from '@supabase/supabase-js';
import { EditPageContentForm } from './EditPageContentForm';
import { EditHomePageForm } from './EditHomePageForm';

interface AdminPage2Props {
  onNavigate: (page: string) => void;
}

export function AdminPage2({  onNavigate }: AdminPage2Props) {
  const [contentView, setContentView] = useState('members');
  const [editView, setEditView] = useState<{ type: string | null, id?: number, key?: string }>({ type: null });

  const [members, setMembers] = useState<any[]>([]);
  const [alumni, setAlumni] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('members').select('*').order('display_order');
    setMembers(data || []);
    setLoading(false);
  }, []);

  const fetchAlumni = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('alumni').select('*').order('created_at', { ascending: false });
    setAlumni(data || []);
    setLoading(false);
  }, []);
  
  const fetchPages = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('pages').select('page_key, content->>title as title');
    setPages(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (contentView === 'members') fetchMembers();
    if (contentView === 'alumni') fetchAlumni();
    if (contentView === 'pages') fetchPages();
  }, [contentView, fetchMembers, fetchAlumni, fetchPages]);

  const handleDeleteMember = async (id: number) => {
    if (window.confirm('정말로 이 멤버를 삭제하시겠습니까?')) {
      await supabase.from('members').delete().eq('id', id);
      fetchMembers();
    }
  };

  const handleDeleteAlumni = async (id: number) => {
    if (window.confirm('정말로 이 졸업생을 삭제하시겠습니까?')) {
      await supabase.from('alumni').delete().eq('id', id);
      fetchAlumni();
    }
  };

  const handleBackToList = () => {
    setEditView({ type: null });
    if (contentView === 'members') fetchMembers();
    if (contentView === 'alumni') fetchAlumni();
    if (contentView === 'pages') fetchPages();
  };

  if (editView.type === 'page' && editView.key === 'home') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EditHomePageForm onBack={handleBackToList} />
      </div>
    );
  }
  
  if (editView.type === 'page') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
         <EditPageContentForm pageKey={editView.key as string} onBack={handleBackToList} />
      </div>
    );
  }

  if (editView.type === 'member') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
         <EditMemberPage memberId={editView.id} onBack={handleBackToList} />
      </div>
    );
  }

  if (editView.type === 'alumni') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
         <EditAlumniPage alumniId={editView.id} onBack={handleBackToList} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>콘텐츠 관리</CardTitle>
              <CardDescription>홈페이지, 멤버, 졸업생 등 정적 콘텐츠를 관리합니다.</CardDescription>
            </div>
            <Button variant="link" onClick={() => onNavigate('/cmsl2004')}>← 게시물 관리 페이지로</Button>
          </div>
        </CardHeader>
        <CardContent>
          <ToggleGroup type="single" value={contentView} onValueChange={(v) => v && setContentView(v)} className="mb-6">
            <ToggleGroupItem value="members">Members</ToggleGroupItem>
            <ToggleGroupItem value="alumni">Alumni</ToggleGroupItem>
            <ToggleGroupItem value="pages">Page Contents</ToggleGroupItem>
          </ToggleGroup>

          {contentView === 'members' && (
             <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Members Management</h3>
                <Button onClick={() => setEditView({ type: 'member' })}>Add New Member</Button>
              </div>
              <div className="space-y-2">
                {loading ? <p>Loading members...</p> : members.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div><p className="font-semibold">{member.name} <span className="text-sm text-muted-foreground">({member.position})</span></p></div>
                    <div className="space-x-2"><Button variant="outline" size="sm" onClick={() => setEditView({ type: 'member', id: member.id })}>Edit</Button><Button variant="destructive" size="sm" onClick={() => handleDeleteMember(member.id)}>Delete</Button></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {contentView === 'alumni' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Alumni Management</h3>
                <Button onClick={() => setEditView({ type: 'alumni' })}>Add New Alumni</Button>
              </div>
              <div className="space-y-2">
                {loading ? <p>Loading alumni...</p> : alumni.map(alum => (
                  <div key={alum.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div><p className="font-semibold">{alum.name} <span className="text-sm text-muted-foreground">({alum.degree})</span></p></div>
                    <div className="space-x-2"><Button variant="outline" size="sm" onClick={() => setEditView({ type: 'alumni', id: alum.id })}>Edit</Button><Button variant="destructive" size="sm" onClick={() => handleDeleteAlumni(alum.id)}>Delete</Button></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {contentView === 'pages' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Page Content Management</h3>
              </div>
              <div className="space-y-2">
                {/* ⬇️ 이 부분을 수정합니다. 하드코딩된 'Home Page' 버튼을 삭제하고, DB에서 불러온 목록만 표시합니다. ⬇️ */}
                {loading ? <p>Loading pages...</p> : pages.map(page => (
                  <div key={page.page_key} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      {/* page_key가 'home'일 경우 'Home Page'로 표시합니다. */}
                      <p className="font-semibold">{page.page_key === 'home' ? 'Home Page' : (page.title || page.page_key)}</p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setEditView({ type: 'page', key: page.page_key })}>Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}