import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 

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
        // 'projects'의 tags를 string으로 미리 변환
        const processedContent = { ...data.content };
        if (processedContent.projects) {
          processedContent.projects = processedContent.projects.map((proj: any) => ({
            ...proj,
            tags: (proj.tags || []).join('\n') // DB의 string[]을 폼의 string으로 변환
          }));
        }
        setContent(processedContent);
        
        if (pageKey === 'professor') {
          // (교수님 폼 데이터 로드 로직은 동일)
          setTextBlocks({
            education: (data.content.education || []).map((item: any) => `${item.period} | ${item.description}`).join('\n'),
            experience: (data.content.experience || []).map((item: any) => `${item.period} | ${item.description}`).join('\n'),
            awards_and_honors: (data.content.awards_and_honors || []).map((item: any) => `${item.period} | ${item.description}`).join('\n'),
            research_interests: (data.content.research_interests || []).join('\n')
          });
        }
      } else {
        setContent({});
      }
      setLoading(false);
    };
    fetchContent();
  }, [pageKey]);

  // (배열 관리 헬퍼 함수들은 변경 없음)
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

  // (다른 핸들러들은 변경 없음)
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

  // (handleSubmit은 변경 없음, 'projects' 태그 변환 로직 포함)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      let finalContent = { ...content };

      if (pageKey === 'professor') {
        // (교수님 폼 저장 로직은 동일)
        finalContent.education = textBlocks.education.split('\n').filter(line => line.includes('|')).map(line => ({ period: line.split('|')[0].trim(), description: line.split('|')[1].trim() }));
        finalContent.experience = textBlocks.experience.split('\n').filter(line => line.includes('|')).map(line => ({ period: line.split('|')[0].trim(), description: line.split('|')[1].trim() }));
        finalContent.awards_and_honors = textBlocks.awards_and_honors.split('\n').filter(line => line.includes('|')).map(line => ({ period: line.split('|')[0].trim(), description: line.split('|')[1].trim() }));
        finalContent.research_interests = textBlocks.research_interests.split('\n').filter(line => line.trim() !== '');
        
        if (newImage) {
          if (finalContent.profile_image_url) {
            const oldPath = finalContent.profile_image_url.substring(finalContent.profile_image_url.indexOf('public/'));
            await supabase.storage.from('professor-photo').remove([oldPath]);
          }
          const imagePath = `public/professor-photo/${Date.now()}_${sanitizeForStorage(newImage.name)}`;
          const { error: uploadError } = await supabase.storage.from('professor-photo').upload(imagePath, newImage);
          if (uploadError) throw uploadError;
          finalContent.profile_image_url = supabase.storage.from('professor-photo').getPublicUrl(imagePath).data.publicUrl;
        }
      }
      
      if (finalContent.projects) {
        finalContent.projects = finalContent.projects.map((proj: any) => ({
          ...proj,
          tags: typeof proj.tags === 'string' 
            ? proj.tags.split('\n').filter(line => line.trim() !== '') 
            : proj.tags
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
            <>
              {/* --- 교수님 폼 (변경 없음) --- */}
              <div className="space-y-2"><Label>Name</Label><Input name="name" value={content?.name || ''} onChange={handleContentChange} /></div>
              <div className="space-y-2"><Label>Title (e.g., Professor)</Label><Input name="title" value={content?.title || ''} onChange={handleContentChange} /></div>
              <div className="space-y-2"><Label>Department</Label><Input name="department" value={content?.department || ''} onChange={handleContentChange} /></div>
              <div className="space-y-2">
                <Label>Profile Image</Label>
                {content?.profile_image_url && !newImage && (
                  <img src={content.profile_image_url} alt="Current Profile" className="w-40 h-48 object-cover rounded-md border" />
                )}
                {newImage && (
                  <img src={URL.createObjectURL(newImage)} alt="New Profile Preview" className="w-40 h-48 object-cover rounded-md border" />
                )}
                <Input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
              <div className="space-y-2"><Label>Contact - Phone</Label><Input name="phone" value={content?.contact?.phone || ''} onChange={handleContactChange} /></div>
              <div className="space-y-2"><Label>Contact - Email</Label><Input name="email" value={content?.contact?.email || ''} onChange={handleContactChange} /></div>
              <div className="space-y-2"><Label>Contact - Office</Label><Input name="office" value={content?.contact?.office || ''} onChange={handleContactChange} /></div>
              <div className="space-y-2"><Label>Research Interests (한 줄에 하나씩)</Label><Textarea name="research_interests" value={textBlocks.research_interests} onChange={handleTextBlockChange} rows={4} /></div>
              <div className="space-y-2"><Label>Education (형식: 기간 | 내용)</Label><Textarea name="education" value={textBlocks.education} onChange={handleTextBlockChange} rows={4} placeholder="e.g., – 1998 | Ph.D. in Materials Science..." /></div>
              <div className="space-y-2"><Label>Experience (형식: 기간 | 내용)</Label><Textarea name="experience" value={textBlocks.experience} onChange={handleTextBlockChange} rows={8} /></div>
              <div className="space-y-2"><Label>Awards & Honors (형식: 기간 | 내용)</Label><Textarea name="awards_and_honors" value={textBlocks.awards_and_honors} onChange={handleTextBlockChange} rows={5} /></div>
            </>
          ) : (
            // --- 리서치 페이지 폼 ---
            <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>페이지 소개 (상단)</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="space-y-2"><Label>Main Title (h1)</Label><Input name="title" value={content?.title || ''} onChange={handleContentChange} /></div>
                  <div className="space-y-2"><Label>Subtitle (p)</Label><Input name="subtitle" value={content?.subtitle || ''} onChange={handleContentChange} /></div>
                  <div className="space-y-2"><Label>Main Paragraph 1</Label><Textarea name="main_paragraph_1" value={content?.main_paragraph_1 || ''} onChange={handleContentChange} rows={5} /></div>
                  <div className="space-y-2"><Label>Main Paragraph 2</Label><Textarea name="main_paragraph_2" value={content?.main_paragraph_2 || ''} onChange={handleContentChange} rows={5} /></div>
                  
                  {/* --- ⬇️ (요청 2) 단일 이미지 입력을 갤러리 관리로 변경 ⬇️ --- */}
                  <div className="space-y-3 pt-2">
                    <Label className="font-semibold">Image Gallery (상단 이미지 캐러셀)</Label>
                    {(content?.gallery_images || []).map((image: any, index: number) => (
                      <div key={index} className="p-4 border rounded-md space-y-3 relative">
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeItemFromArray('gallery_images', index)}><Trash2 className="h-4 w-4"/></Button>
                        <div className="space-y-2"><Label>Image URL</Label><Input value={image.url || ''} onChange={(e) => handleArrayItemChange('gallery_images', index, 'url', e.target.value)} placeholder="https://..." /></div>
                        <div className="space-y-2"><Label>Alt Text (Optional)</Label><Input value={image.alt || ''} onChange={(e) => handleArrayItemChange('gallery_images', index, 'alt', e.target.value)} placeholder="Image description (for accessibility)" /></div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => addItemToArray('gallery_images', { url: '', alt: '' })}>Add Image to Gallery</Button>
                  </div>
                  {/* --- ⬆️ 변경 완료 ⬆️ --- */}
                  
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>프로젝트 카드 (하단)</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  {/* --- (프로젝트 카드 폼은 변경 없음) --- */}
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
                      
                      <div className="space-y-2">
                        <Label>Tags (한 줄에 하나씩)</Label>
                        <Textarea 
                          value={project.tags || ''} 
                          onChange={(e) => handleArrayItemChange('projects', index, 'tags', e.target.value)} 
                          rows={3} 
                        />
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addItemToArray('projects', {
                    title: '', description: '', person_in_charge: '', logo_url: '', status: 'Active', tags: ''
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