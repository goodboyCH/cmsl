import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // 1. Select import 추가

interface EditPageContentFormProps {
  pageKey: string;
  onBack: () => void;
}

const sanitizeForStorage = (filename: string) => filename.replace(/[^a-zA-Z0-9._-]/g, '');

export function EditPageContentForm({ pageKey, onBack }: EditPageContentFormProps) {
  const [content, setContent] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [newImage, setNewImage] = useState<File | null>(null);

  const [textBlocks, setTextBlocks] = useState({
    education: '',
    experience: '',
    awards_and_honors: '',
    research_interests: ''
  });

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data } = await supabase.from('pages').select('content').eq('page_key', pageKey).single();
      
      if (data?.content) {
        setContent(data.content);
        if (pageKey === 'professor') {
          // ... (기존 교수님 텍스트 블록 로직)
        }
      } else {
        setContent({});
      }
      setLoading(false);
    };
    fetchContent();
  }, [pageKey]);

  // --- ⬇️ 2. 배열 관리를 위한 헬퍼 함수 3개 추가 ⬇️ ---
  const handleArrayItemChange = (arrayName: string, index: number, field: string, value: string) => {
    if (!content) return;
    const updatedItems = [...(content[arrayName] || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setContent(prev => (prev ? { ...prev, [arrayName]: updatedItems } : { [arrayName]: updatedItems }));
  };
  
  const addItemToArray = (arrayName: string, newItem: object) => {
    if (!content) return;
    const updatedItems = [...(content[arrayName] || []), newItem];
    setContent(prev => (prev ? { ...prev, [arrayName]: updatedItems } : { [arrayName]: updatedItems }));
  };
  
  const removeItemFromArray = (arrayName: string, indexToRemove: number) => {
    if (!content) return;
    const updatedItems = (content[arrayName] || []).filter((_: any, index: number) => index !== indexToRemove);
    setContent(prev => (prev ? { ...prev, [arrayName]: updatedItems } : { [arrayName]: updatedItems }));
  };
  // --- ⬆️ 헬퍼 함수 추가 완료 ⬆️ ---

  // (handleContentChange, handleContactChange, handleTextBlockChange, handleImageChange 핸들러는 그대로)
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContent(prev => (prev ? { ...prev, [name]: value } : { [name]: value }));
  };
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContent(prev => (prev ? { ...prev, contact: { ...prev.contact, [name]: value } } : {}));
  };
  const handleTextBlockChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTextBlocks(prev => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      let finalContent = { ...content };

      if (pageKey === 'professor') {
        // ... (기존 교수님 폼 저장 로직)
      }
      
      // 3. projects 배열의 'tags'를 문자열에서 배열로 변환
      // (다른 리서치 페이지 폼도 배열 관리를 할 수 있으므로)
      if (finalContent.projects) {
        finalContent.projects = finalContent.projects.map((proj: any) => ({
          ...proj,
          // 폼에서 'tags'가 string으로 관리되었다면 배열로 변환
          tags: typeof proj.tags === 'string' 
            ? proj.tags.split('\n').filter(line => line.trim() !== '') 
            : proj.tags // 이미 배열이면 (DB에서 불러온 초기값) 그대로 둠
        }));
      }

      const { error } = await supabase.from('pages').update({ content: finalContent }).eq('page_key', pageKey);
      if (error) throw error;
      setMessage('페이지 콘텐츠가 성공적으로 저장되었습니다.');
      setTimeout(onBack, 1500);
    } catch (err: any) {
      setMessage(`오류 발생: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center p-8">Loading page content...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>페이지 콘텐츠 수정</CardTitle>
        <CardDescription>'{pageKey}' 페이지의 내용을 수정합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {pageKey === 'professor' ? (
            // Professor 페이지 전용 폼
            <>
              {/* ... (기존 교수님 폼 UI) ... */}
            </>
          ) : (
            // --- ⬇️ 4. 리서치 페이지 폼을 Accordion으로 감싸기 ⬇️ ---
            <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>페이지 소개 (상단)</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="space-y-2"><Label>Main Title (h1)</Label><Input name="title" value={content?.title || ''} onChange={handleContentChange} /></div>
                  <div className="space-y-2"><Label>Subtitle (p)</Label><Input name="subtitle" value={content?.subtitle || ''} onChange={handleContentChange} /></div>
                  <div className="space-y-2"><Label>Main Paragraph 1</Label><Textarea name="main_paragraph_1" value={content?.main_paragraph_1 || ''} onChange={handleContentChange} rows={5} /></div>
                  <div className="space-y-2"><Label>Main Paragraph 2</Label><Textarea name="main_paragraph_2" value={content?.main_paragraph_2 || ''} onChange={handleContentChange} rows={5} /></div>
                  <div className="space-y-2"><Label>Main Image URL</Label><Input name="main_image_url" value={content?.main_image_url || ''} onChange={handleContentChange} placeholder="https://..."/></div>
                </AccordionContent>
              </AccordionItem>
              
              {/* --- ⬇️ 5. 프로젝트 카드 관리 섹션 추가 ⬇️ --- */}
              <AccordionItem value="item-2">
                <AccordionTrigger>프로젝트 카드 (하단)</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="space-y-2"><Label>Projects Section Title</Label><Input name="projects_title" value={content?.projects_title || ''} onChange={handleContentChange} /></div>
                  <div className="space-y-2"><Label>Projects Section Subtitle</Label><Input name="projects_subtitle" value={content?.projects_subtitle || ''} onChange={handleContentChange} /></div>
                  
                  {(content?.projects || []).map((project: any, index: number) => (
                    <div key={index} className="p-4 border rounded-md space-y-3 relative">
                      <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeItemFromArray('projects', index)}><Trash2 className="h-4 w-4"/></Button>
                      <div className="space-y-2"><Label>Project Title</Label><Input value={project.title} onChange={(e) => handleArrayItemChange('projects', index, 'title', e.target.value)} /></div>
                      <div className="space-y-2"><Label>Description</Label><Textarea value={project.description} onChange={(e) => handleArrayItemChange('projects', index, 'description', e.target.value)} rows={3} /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>담당자</Label><Input value={project.person_in_charge} onChange={(e) => handleArrayItemChange('projects', index, 'person_in_charge', e.target.value)} /></div>
                        <div className="space-y-2"><Label>로고 URL</Label><Input value={project.logo_url} onChange={(e) => handleArrayItemChange('projects', index, 'logo_url', e.target.value)} /></div>
                        <div className="space-y-2"><Label>Status</Label>
                          <Select value={project.status} onValueChange={(val) => handleArrayItemChange('projects', index, 'status', val)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2"><Label>Tags (한 줄에 하나씩)</Label><Textarea value={(project.tags || []).join('\n')} onChange={(e) => handleArrayItemChange('projects', index, 'tags', e.target.value)} rows={3} /></div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addItemToArray('projects', {
                    title: '', description: '', person_in_charge: '', logo_url: '', status: 'Active', tags: []
                  })}>Add Project Card</Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onBack}>취소</Button>
            <Button type="submit" disabled={loading}>{loading ? '저장 중...' : '콘텐츠 저장'}</Button>
          </div>
          {message && <p className="text-sm text-center pt-2">{message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}