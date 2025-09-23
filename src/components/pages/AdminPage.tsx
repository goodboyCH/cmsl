import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabaseClient';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { X } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const sanitizeForStorage = (filename: string) => {
  const cleaned = filename.replace(/[^a-zA-Z0-9._-]/g, '');
  if (cleaned.indexOf('.') === -1) {
    const extension = filename.split('.').pop();
    return `${cleaned}.${extension}`;
  }
  return cleaned;
};

export function AdminPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [postType, setPostType] = useState<'notice' | 'gallery' | 'publication' | 'project'>('notice');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Administrator');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const quillRef = useRef<ReactQuill>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [pubData, setPubData] = useState({ year: new Date().getFullYear(), authors: '', journal: '', doi_link: '', is_featured: false });
  const [pubImage, setPubImage] = useState<File | null>(null);
  const [projectData, setProjectData] = useState({ status: 'Active', pi: '', funding_agency: '', duration: '', objectives: '', collaborators: '' });
  const [projectThumbnail, setProjectThumbnail] = useState<File | null>(null);

  const resetForm = () => {
    setTitle(''); setContent(''); setAuthor('Administrator'); setThumbnail(null); setAttachments([]); setPubImage(null);
    setPubData({ year: new Date().getFullYear(), authors: '', journal: '', doi_link: '', is_featured: false });
    setProjectData({ status: 'Active', pi: '', funding_agency: '', duration: '', objectives: '', collaborators: '' });
    setProjectThumbnail(null);
    const thumbInput = document.getElementById('thumbnail-input') as HTMLInputElement; if (thumbInput) thumbInput.value = '';
    const attachInput = document.getElementById('attachment-input') as HTMLInputElement; if (attachInput) attachInput.value = '';
    const pubImageInput = document.getElementById('pub-image-input') as HTMLInputElement; if (pubImageInput) pubImageInput.value = '';
    const projectThumbnailInput = document.getElementById('project-thumbnail-input') as HTMLInputElement; if (projectThumbnailInput) projectThumbnailInput.value = '';
  };
  const handlePubDataChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { name, value, type } = e.target; setPubData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value, 10) || 0 : value })); };
  const handleProjectDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { const { name, value } = e.target; setProjectData(prev => ({ ...prev, [name]: value })); };
  const handleProjectStatusChange = (value: string) => { setProjectData(prev => ({ ...prev, status: value })); };
  const handleProjectThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) setProjectThumbnail(e.target.files[0]); };
  const handlePubImageChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) setPubImage(e.target.files[0]); };
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) setThumbnail(e.target.files[0]); };
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) setAttachments(Array.from(e.target.files)); };
  const removeAttachment = (index: number) => { setAttachments(attachments.filter((_, i) => i !== index)); };

  const imageHandler = useCallback(() => {
    const input = document.createElement('input'); input.setAttribute('type', 'file'); input.setAttribute('accept', 'image/*'); input.click();
    input.onchange = async () => {
      if (input.files && input.files.length > 0) {
        const file = input.files[0]; setLoading(true); setMessage('이미지 업로드 중...');
        const filePath = `public/images/${Date.now()}_${sanitizeForStorage(file.name)}`;
        const { error: uploadError } = await supabase.storage.from('notice-attachments').upload(filePath, file);
        if (uploadError) { setMessage(`이미지 업로드 오류: ${uploadError.message}`); setLoading(false); return; }
        const { data: urlData } = supabase.storage.from('notice-attachments').getPublicUrl(filePath);
        const editor = quillRef.current?.getEditor();
        if (editor) { const range = editor.getSelection(true); editor.insertEmbed(range.index, 'image', urlData.publicUrl); }
        setMessage('이미지 업로드 완료.'); setLoading(false);
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: { container: [
        [{ 'header': [1, 2, 3, false] }], ['bold', 'italic', 'underline', 'strike'], [{'align': []}],
        [{'list': 'ordered'}, {'list': 'bullet'}], ['link', 'image'], ['clean']
      ], handlers: { image: imageHandler },
    },
    imageResize: { parchment: Quill.import('parchment'), modules: ['Resize', 'DisplaySize'] }
  }), [imageHandler]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMessage('');
    try {
      if (postType === 'notice') {
        let uploadedAttachments = [];
        for (const file of attachments) {
          const filePath = `public/files/${Date.now()}_${sanitizeForStorage(file.name)}`;
          const { error } = await supabase.storage.from('notice-attachments').upload(filePath, file);
          if (error) throw error;
          const { data: urlData } = supabase.storage.from('notice-attachments').getPublicUrl(filePath);
          uploadedAttachments.push({ name: file.name, url: urlData.publicUrl });
        }
        await supabase.from('notices').insert([{ title, content, author, attachments: uploadedAttachments }]);
      } else if (postType === 'gallery') {
        if (!thumbnail) throw new Error('대표 이미지는 필수입니다.');
        const thumbPath = `public/gallery/thumbnails/${Date.now()}_${sanitizeForStorage(thumbnail.name)}`;
        const { error } = await supabase.storage.from('notice-attachments').upload(thumbPath, thumbnail);
        if (error) throw error;
        const { data: thumbUrlData } = supabase.storage.from('notice-attachments').getPublicUrl(thumbPath);
        await supabase.from('gallery').insert([{ title, content, author, thumbnail_url: thumbUrlData.publicUrl }]);
      } else if (postType === 'publication') {
        let imageUrl = null;
        if (pubImage) {
          const imagePath = `public/publication-images/${Date.now()}_${sanitizeForStorage(pubImage.name)}`;
          const { error } = await supabase.storage.from('publication-images').upload(imagePath, pubImage);
          if (error) throw error;
          const { data: imageUrlData } = supabase.storage.from('publication-images').getPublicUrl(imagePath);
          imageUrl = imageUrlData.publicUrl;
        }
        await supabase.from('publications').insert([{ title, abstract: content, image_url: imageUrl, ...pubData }]);
      } else if (postType === 'project') {
        let thumbnailUrl = null;
        if (projectThumbnail) {
          const thumbPath = `public/project-thumbnails/${Date.now()}_${sanitizeForStorage(projectThumbnail.name)}`;
          const { error: thumbError } = await supabase.storage.from('project-thumbnails').upload(thumbPath, projectThumbnail);
          if (thumbError) throw thumbError;
          thumbnailUrl = supabase.storage.from('project-thumbnails').getPublicUrl(thumbPath).data.publicUrl;
        }
        const finalProjectData = {
          title: title, description: content, thumbnail_url: thumbnailUrl, status: projectData.status,
          pi: projectData.pi, funding_agency: projectData.funding_agency, duration: projectData.duration,
          objectives: projectData.objectives.split('\n').filter(line => line.trim() !== ''),
          collaborators: projectData.collaborators.split('\n').filter(line => line.trim() !== ''),
        };
        const { error } = await supabase.from('projects').insert([finalProjectData]);
        if (error) throw error;
      }
      setMessage('게시물이 성공적으로 등록되었습니다!');
      resetForm();
    } catch (err: any) { setMessage(`오류 발생: ${err.message}`); } 
    finally { setLoading(false); }
  };
  
  const handleLogout = async () => { await supabase.auth.signOut(); window.location.reload(); };

  const renderPostForm = () => {
    if (postType === 'publication') {
      return (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="title">제목 (Title)</Label><Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required /></div><div className="space-y-2"><Label htmlFor="authors">저자 (Authors)</Label><Input id="authors" name="authors" value={pubData.authors} onChange={handlePubDataChange} required /></div><div className="space-y-2"><Label htmlFor="journal">학술지 (Journal)</Label><Input id="journal" name="journal" value={pubData.journal} onChange={handlePubDataChange} /></div><div className="space-y-2"><Label htmlFor="year">연도 (Year)</Label><Input id="year" name="year" type="number" value={pubData.year} onChange={handlePubDataChange} required /></div><div className="space-y-2"><Label htmlFor="doi_link">DOI 링크</Label><Input id="doi_link" name="doi_link" value={pubData.doi_link} onChange={handlePubDataChange} /></div></div>
          <div className="space-y-2"><Label>초록 (Abstract)</Label><Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} /></div>
          <div className="space-y-2"><Label htmlFor="pub-image-input">썸네일 이미지</Label><Input id="pub-image-input" type="file" accept="image/*" onChange={handlePubImageChange} /></div>
          <div className="flex items-center space-x-2 pt-2"><Checkbox id="is_featured" checked={pubData.is_featured} onCheckedChange={(checked) => setPubData(prev => ({ ...prev, is_featured: !!checked }))} /><Label htmlFor="is_featured">Featured Publication으로 지정</Label></div>
        </div>
      );
    }
    if (postType === 'project') {
      return (
        <div className="space-y-4">
          <div className="space-y-2"><Label htmlFor="title">프로젝트 제목 (Title)</Label><Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
          <div className="space-y-2"><Label htmlFor="project-thumbnail-input">썸네일 이미지</Label><Input id="project-thumbnail-input" type="file" accept="image/*" onChange={handleProjectThumbnailChange} /></div>
          <div className="space-y-2"><Label htmlFor="description">요약 설명 (Description)</Label><Textarea id="description" value={content} onChange={(e) => setContent(e.target.value)} /></div>
          <div className="grid md:grid-cols-2 gap-4"><div className="space-y-2"><Label>상태 (Status)</Label><Select value={projectData.status} onValueChange={handleProjectStatusChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Completed">Completed</SelectItem><SelectItem value="Planning">Planning</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label htmlFor="duration">기간 (Duration)</Label><Input id="duration" name="duration" value={projectData.duration} onChange={handleProjectDataChange} /></div><div className="space-y-2"><Label htmlFor="pi">PI</Label><Input id="pi" name="pi" value={projectData.pi} onChange={handleProjectDataChange} /></div><div className="space-y-2"><Label htmlFor="funding_agency">Funding Agency</Label><Input id="funding_agency" name="funding_agency" value={projectData.funding_agency} onChange={handleProjectDataChange} /></div></div>
          <div className="space-y-2"><Label htmlFor="objectives">Research Objectives (한 줄에 하나씩)</Label><Textarea id="objectives" name="objectives" value={projectData.objectives} onChange={handleProjectDataChange} rows={4} /></div>
          <div className="space-y-2"><Label htmlFor="collaborators">Collaborators (한 줄에 하나씩)</Label><Textarea id="collaborators" name="collaborators" value={projectData.collaborators} onChange={handleProjectDataChange} rows={3} /></div>
        </div>
      );
    }
    return (
      <>
        <div className="space-y-2"><Label htmlFor="title">제목</Label><Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
        <div className="space-y-2"><Label htmlFor="author">작성자</Label><Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required /></div>
        <div className="space-y-2"><Label>내용</Label><ReactQuill ref={quillRef} theme="snow" value={content} onChange={setContent} modules={modules} className="bg-background"/></div>
        {postType === 'gallery' && <div className="space-y-2"><Label htmlFor="thumbnail-input">대표 이미지 (필수)</Label><Input id="thumbnail-input" type="file" accept="image/*" onChange={handleThumbnailChange} required /></div>}
        {postType === 'notice' && <div className="space-y-2"><Label htmlFor="attachment-input">첨부파일</Label><Input id="attachment-input" type="file" multiple onChange={handleAttachmentChange} />
          {attachments.length > 0 && <div className="mt-2 space-y-2"><p className="text-sm font-medium">선택된 파일:</p><ul className="list-disc list-inside text-sm text-muted-foreground">{attachments.map((file, index) => (<li key={index} className="flex items-center justify-between"><span>{file.name}</span><Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeAttachment(index)}><X className="h-4 w-4" /></Button></li>))}</ul></div>}
        </div>}
      </>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>게시물 관리</CardTitle>
              <CardDescription>공지사항, 갤러리, 논문, 프로젝트를 등록합니다.</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="link" onClick={() => onNavigate('cmsl20042')}>콘텐츠 관리 페이지로 →</Button>
              <Button variant="outline" onClick={handleLogout}>로그아웃</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <ToggleGroup type="single" value={postType} onValueChange={(value) => { if (value) { setPostType(value as any); resetForm(); } }}>
              <ToggleGroupItem value="notice">공지사항</ToggleGroupItem>
              <ToggleGroupItem value="gallery">갤러리</ToggleGroupItem>
              <ToggleGroupItem value="publication">Publication</ToggleGroupItem>
              <ToggleGroupItem value="project">Project</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderPostForm()}
            <Button type="submit" disabled={loading} className="mt-8">{loading ? '제출 중...' : '게시물 등록'}</Button>
            {message && <p className="text-sm text-muted-foreground pt-2">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}