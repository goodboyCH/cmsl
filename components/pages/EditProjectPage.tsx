import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabaseClient';

const sanitizeForStorage = (filename: string) => {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '');
};

interface EditProjectPageProps { projectId: number; onBack: () => void; }

export function EditProjectPage({ projectId, onBack }: EditProjectPageProps) {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectData, setProjectData] = useState({
    status: 'Active',
    pi: '',
    funding_agency: '',
    duration: '',
    objectives: '',
    collaborators: ''
  });
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      const { data } = await supabase.from('projects').select('*').eq('id', projectId).single();
      if (data) {
        setTitle(data.title || '');
        setDescription(data.description || '');
        setExistingThumbnailUrl(data.thumbnail_url);
        setProjectData({
          status: data.status || 'Active',
          pi: data.pi || '',
          funding_agency: data.funding_agency || '',
          duration: data.duration || '',
          objectives: (data.objectives || []).join('\n'),
          collaborators: (data.collaborators || []).join('\n')
        });
      }
      setLoading(false);
    };
    fetchProject();
  }, [projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setProjectData(prev => ({ ...prev, status: value }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setNewThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      let finalThumbnailUrl = existingThumbnailUrl;
      if (newThumbnail) {
        if (existingThumbnailUrl) {
          const oldPath = existingThumbnailUrl.substring(existingThumbnailUrl.indexOf('public/'));
          await supabase.storage.from('project-thumbnails').remove([oldPath]);
        }
        const thumbPath = `public/project-thumbnails/${Date.now()}_${sanitizeForStorage(newThumbnail.name)}`;
        const { error: uploadError } = await supabase.storage.from('project-thumbnails').upload(thumbPath, newThumbnail);
        if (uploadError) throw uploadError;
        finalThumbnailUrl = supabase.storage.from('project-thumbnails').getPublicUrl(thumbPath).data.publicUrl;
      }
      
      const finalUpdateData = {
        title,
        description,
        thumbnail_url: finalThumbnailUrl,
        ...projectData,
        objectives: projectData.objectives.split('\n').filter(line => line.trim() !== ''),
        collaborators: projectData.collaborators.split('\n').filter(line => line.trim() !== ''),
      };

      const { error } = await supabase.from('projects').update(finalUpdateData).eq('id', projectId);
      if (error) throw error;
      
      setMessage('성공적으로 수정되었습니다.');
      setTimeout(onBack, 1000);
    } catch (err: any) {
      setMessage(`오류: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center p-8">Loading project data...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>프로젝트 수정</CardTitle>
          <CardDescription>프로젝트 정보를 수정하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2"><Label htmlFor="title">프로젝트 제목 (Title)</Label><Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="thumbnail-input">썸네일 이미지</Label>{existingThumbnailUrl && <img src={existingThumbnailUrl} alt="Current thumbnail" className="rounded-md border max-w-xs my-2" />}<Input id="thumbnail-input" type="file" accept="image/*" onChange={handleThumbnailChange} /></div>
            <div className="space-y-2"><Label htmlFor="description">요약 설명 (Description)</Label><Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>상태 (Status)</Label><Select value={projectData.status} onValueChange={handleStatusChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Completed">Completed</SelectItem><SelectItem value="Planning">Planning</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="duration">기간 (Duration)</Label><Input id="duration" name="duration" value={projectData.duration} onChange={handleChange} /></div>
              <div className="space-y-2"><Label htmlFor="pi">PI</Label><Input id="pi" name="pi" value={projectData.pi} onChange={handleChange} /></div>
              <div className="space-y-2"><Label htmlFor="funding_agency">Funding Agency</Label><Input id="funding_agency" name="funding_agency" value={projectData.funding_agency} onChange={handleChange} /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="objectives">Research Objectives (한 줄에 하나씩)</Label><Textarea id="objectives" name="objectives" value={projectData.objectives} onChange={handleChange} rows={4} /></div>
            <div className="space-y-2"><Label htmlFor="collaborators">Collaborators (한 줄에 하나씩)</Label><Textarea id="collaborators" name="collaborators" value={projectData.collaborators} onChange={handleChange} rows={3} /></div>

            <div className="flex justify-between items-center mt-8">
              <Button type="submit" disabled={loading}>{loading ? '수정 중...' : '수정 완료'}</Button>
              <Button type="button" variant="outline" onClick={onBack}>취소</Button>
            </div>
            {message && <p className="text-sm pt-2">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}