import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EditPageContentFormProps {
  pageKey: string;
  onBack: () => void;
}

const sanitizeForStorage = (filename: string) => filename.replace(/[^a-zA-Z0-9._-]/g, '');

export function EditPageContentForm({ pageKey, onBack }: EditPageContentFormProps) {
  const [content, setContent] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [allPublications, setAllPublications] = useState<any[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);

  // Professor 전용 상태
  const [textBlocks, setTextBlocks] = useState({
    education: '', experience: '', awards_and_honors: '', research_interests: ''
  });

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);

      // Fetch publications
      if (pageKey !== 'professor') {
        const { data: pubData } = await supabase.from('publications').select('id, title, year, journal').order('year', { ascending: false });
        if (pubData) setAllPublications(pubData);
      }

      const { data } = await supabase.from('pages').select('content').eq('page_key', pageKey).single();

      if (data?.content) {
        const processedContent = { ...data.content };

        // 🆕 Research Page: 섹션 배열 초기화 (없으면 빈 배열)
        if (!processedContent.research_sections) {
          processedContent.research_sections = [];
        }

        // Representative Media Init
        if (!processedContent.representative_media) {
          processedContent.representative_media = { url: '', type: 'image', alt: '' };
        }

        setContent(processedContent);

        // Professor Page Handling
        if (pageKey === 'professor') {
          setTextBlocks({
            education: (data.content.education || []).map((item: any) => `${item.period} | ${item.description}`).join('\n'),
            experience: (data.content.experience || []).map((item: any) => `${item.period} | ${item.description}`).join('\n'),
            awards_and_honors: (data.content.awards_and_honors || []).map((item: any) => `${item.period} | ${item.description}`).join('\n'),
            research_interests: (data.content.research_interests || []).join('\n')
          });
        }
      } else {
        setContent({ research_sections: [] });
      }
      setLoading(false);
    };
    fetchContent();
  }, [pageKey]);

  // --- Common Handlers ---
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContent(prev => (prev ? { ...prev, [name]: value } : { [name]: value }));
  };

  const handleRepresentativeChange = (field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      representative_media: { ...prev?.representative_media, [field]: value }
    }));
  };

  // --- Research Section Handlers (New Structure) ---
  
  // 1. 섹션 추가
  const addSection = () => {
    setContent(prev => ({
      ...prev,
      research_sections: [
        ...(prev?.research_sections || []),
        { heading: 'New Section', content: '', images: [] } // 기본 템플릿
      ]
    }));
  };

  // 2. 섹션 삭제
  const removeSection = (index: number) => {
    setContent(prev => ({
      ...prev,
      research_sections: prev?.research_sections.filter((_: any, i: number) => i !== index)
    }));
  };

  // 3. 섹션 내용 수정 (제목, 본문)
  const handleSectionChange = (index: number, field: string, value: string) => {
    const updatedSections = [...(content?.research_sections || [])];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setContent(prev => ({ ...prev, research_sections: updatedSections }));
  };

  // 4. 섹션 내부 이미지 추가
  const addImageToSection = (sectionIndex: number) => {
    const updatedSections = [...(content?.research_sections || [])];
    const currentImages = updatedSections[sectionIndex].images || [];
    updatedSections[sectionIndex].images = [...currentImages, { url: '', type: 'image', alt: '' }];
    setContent(prev => ({ ...prev, research_sections: updatedSections }));
  };

  // 5. 섹션 내부 이미지 수정
  const handleSectionImageChange = (sectionIndex: number, imageIndex: number, field: string, value: string) => {
    const updatedSections = [...(content?.research_sections || [])];
    const updatedImages = [...updatedSections[sectionIndex].images];
    updatedImages[imageIndex] = { ...updatedImages[imageIndex], [field]: value };
    updatedSections[sectionIndex].images = updatedImages;
    setContent(prev => ({ ...prev, research_sections: updatedSections }));
  };

  // 6. 섹션 내부 이미지 삭제
  const removeImageFromSection = (sectionIndex: number, imageIndex: number) => {
    const updatedSections = [...(content?.research_sections || [])];
    updatedSections[sectionIndex].images = updatedSections[sectionIndex].images.filter((_: any, i: number) => i !== imageIndex);
    setContent(prev => ({ ...prev, research_sections: updatedSections }));
  };

  // --- Professor & Submit Handlers ---
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContent(prev => (prev ? { ...prev, contact: { ...prev.contact, [name]: value } } : {}));
  };
  
  const handleTextBlockChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTextBlocks(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      let finalContent = { ...content };

      if (pageKey === 'professor') {
        // Professor 데이터 가공 로직 (기존 유지)
        finalContent.education = textBlocks.education.split('\n').filter(line => line.includes('|')).map(line => ({ period: line.split('|')[0].trim(), description: line.split('|')[1].trim() }));
        finalContent.experience = textBlocks.experience.split('\n').filter(line => line.includes('|')).map(line => ({ period: line.split('|')[0].trim(), description: line.split('|')[1].trim() }));
        finalContent.awards_and_honors = textBlocks.awards_and_honors.split('\n').filter(line => line.includes('|')).map(line => ({ period: line.split('|')[0].trim(), description: line.split('|')[1].trim() }));
        finalContent.research_interests = textBlocks.research_interests.split('\n').filter(line => line.trim() !== '');

        if (newImage) {
           const imagePath = `public/professor-photo/${Date.now()}_${sanitizeForStorage(newImage.name)}`;
           const { error: uploadError } = await supabase.storage.from('professor-photo').upload(imagePath, newImage);
           if (uploadError) throw uploadError;
           finalContent.profile_image_url = supabase.storage.from('professor-photo').getPublicUrl(imagePath).data.publicUrl;
        }
      }

      const { error } = await supabase.from('pages').update({ content: finalContent }).eq('page_key', pageKey);
      if (error) throw error;
      setMessage('페이지가 성공적으로 저장되었습니다.');
      setTimeout(onBack, 1500);
    } catch (err: any) {
      setMessage(`오류 발생: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center p-8">Loading...</p>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>페이지 콘텐츠 수정</CardTitle>
        <CardDescription>'{pageKey}' 페이지의 내용을 수정합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          {pageKey === 'professor' ? (
             // ... Professor Form (기존과 동일, 생략 없이 유지 필요시 위 코드 참고) ...
             // 코드 간결화를 위해 여기서는 Research Page에 집중합니다.
             // 실제 적용 시에는 기존 Professor 폼 코드를 여기에 그대로 두세요.
             <div className="text-muted-foreground">Professor Page Editing... (기존 코드 유지)</div>
          ) : (
            // =======================================================
            // 🆕 Research Page 편집 (Dynamic Sections)
            // =======================================================
            <Accordion type="multiple" defaultValue={['main-info', 'sections']} className="w-full">
              
              {/* 1. 기본 정보 (타이틀/서브타이틀/대표이미지) */}
              <AccordionItem value="main-info">
                <AccordionTrigger>페이지 기본 정보</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="border p-4 rounded-md">
                    <Label className="mb-2 block font-semibold text-base">Main Titles</Label>
                    <Tabs defaultValue="en">
                      <TabsList><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="ko">Korean</TabsTrigger></TabsList>
                      <TabsContent value="en" className="space-y-2">
                        <div className="space-y-1"><Label>Title</Label><Input name="title" value={content?.title || ''} onChange={handleContentChange} /></div>
                        <div className="space-y-1"><Label>Subtitle</Label><Input name="subtitle" value={content?.subtitle || ''} onChange={handleContentChange} /></div>
                      </TabsContent>
                      <TabsContent value="ko" className="space-y-2">
                        <div className="space-y-1"><Label>제목 (KO)</Label><Input name="title_ko" value={content?.title_ko || ''} onChange={handleContentChange} /></div>
                        <div className="space-y-1"><Label>부제목 (KO)</Label><Input name="subtitle_ko" value={content?.subtitle_ko || ''} onChange={handleContentChange} /></div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="p-4 border rounded-md space-y-3 bg-muted/20">
                    <Label className="font-bold text-primary">Representative Figure (Top)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>URL</Label>
                        <Input value={content?.representative_media?.url || ''} onChange={(e) => handleRepresentativeChange('url', e.target.value)} placeholder="Image/Video URL" />
                      </div>
                      <div className="space-y-1">
                        <Label>Type</Label>
                        <Select value={content?.representative_media?.type || 'image'} onValueChange={(val) => handleRepresentativeChange('type', val)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="image">Image</SelectItem><SelectItem value="video">Video</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 2. 연구 섹션 (제목 > 내용 > 캐러셀) */}
              <AccordionItem value="sections">
                <AccordionTrigger className="text-lg font-bold text-primary">연구 섹션 관리 (Content Blocks)</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    각 섹션은 [소제목(강조) - 본문 - 개별 이미지 캐러셀]로 구성됩니다. 원하는 만큼 추가하세요.
                  </p>

                  {content?.research_sections?.map((section: any, idx: number) => (
                    <div key={idx} className="border-2 border-dashed border-primary/20 rounded-xl p-4 md:p-6 space-y-4 bg-background relative">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg">Section #{idx + 1}</h3>
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeSection(idx)}>
                          <Trash2 className="w-4 h-4 mr-1" /> 섹션 삭제
                        </Button>
                      </div>

                      {/* 섹션 내용 (소제목/본문) */}
                      <Tabs defaultValue="en">
                        <TabsList><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="ko">Korean</TabsTrigger></TabsList>
                        
                        <TabsContent value="en" className="space-y-3">
                          <div className="space-y-1">
                            <Label>Sub-Heading (Bold)</Label>
                            <Input 
                              value={section.heading || ''} 
                              onChange={(e) => handleSectionChange(idx, 'heading', e.target.value)} 
                              placeholder="e.g. Microstructure Analysis"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Paragraph Content</Label>
                            <Textarea 
                              value={section.content || ''} 
                              onChange={(e) => handleSectionChange(idx, 'content', e.target.value)} 
                              rows={5}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="ko" className="space-y-3">
                          <div className="space-y-1">
                            <Label>소제목 (KO)</Label>
                            <Input 
                              value={section.heading_ko || ''} 
                              onChange={(e) => handleSectionChange(idx, 'heading_ko', e.target.value)} 
                              placeholder="예: 미세조직 분석"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>본문 (KO)</Label>
                            <Textarea 
                              value={section.content_ko || ''} 
                              onChange={(e) => handleSectionChange(idx, 'content_ko', e.target.value)} 
                              rows={5}
                            />
                          </div>
                        </TabsContent>
                      </Tabs>

                      {/* 섹션별 이미지 캐러셀 관리 */}
                      <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                        <Label className="font-semibold block">Images for this Section (Carousel)</Label>
                        {(section.images || []).map((img: any, imgIdx: number) => (
                          <div key={imgIdx} className="flex gap-2 items-end border-b pb-2 mb-2">
                              <div className="grid grid-cols-12 gap-2 flex-1">
                                
                                {/* 1. 타입 선택 (Image / Video) - 🆕 추가된 부분 */}
                                <div className="col-span-3 space-y-1">
                                    <span className="text-xs text-muted-foreground">Type</span>
                                    <Select 
                                      value={img.type || 'image'} 
                                      onValueChange={(val) => handleSectionImageChange(idx, imgIdx, 'type', val)}
                                    >
                                      <SelectTrigger className="h-8 bg-background"><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="image">Image</SelectItem>
                                          <SelectItem value="video">Video</SelectItem>
                                      </SelectContent>
                                    </Select>
                                </div>

                                {/* 2. URL 입력 */}
                                <div className="col-span-5 space-y-1">
                                    <span className="text-xs text-muted-foreground">URL</span>
                                    <Input 
                                      value={img.url} 
                                      onChange={(e) => handleSectionImageChange(idx, imgIdx, 'url', e.target.value)} 
                                      className="h-8 bg-background" 
                                      placeholder="https://..."
                                    />
                                </div>

                                {/* 3. Alt Text 입력 */}
                                <div className="col-span-4 space-y-1">
                                    <span className="text-xs text-muted-foreground">Alt Text</span>
                                    <Input 
                                      value={img.alt} 
                                      onChange={(e) => handleSectionImageChange(idx, imgIdx, 'alt', e.target.value)} 
                                      className="h-8 bg-background" 
                                      placeholder="Description"
                                    />
                                </div>
                              </div>

                              {/* 삭제 버튼 */}
                              <Button type="button" variant="ghost" size="icon" className="text-destructive h-8 w-8 mb-0.5" onClick={() => removeImageFromSection(idx, imgIdx)}>
                                <Trash2 className="w-4 h-4"/>
                              </Button>
                          </div>
                        ))}
                        
                        <Button type="button" variant="outline" size="sm" onClick={() => addImageToSection(idx)} className="w-full">
                          + Add Media Item
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button type="button" onClick={addSection} className="w-full py-6 text-lg border-2 border-dashed" variant="outline">
                    <Plus className="mr-2 h-5 w-5" /> Add New Section Block
                  </Button>
                </AccordionContent>
              </AccordionItem>

              {/* 3. 논문 필터링 (기존 유지) */}
              <AccordionItem value="publications">
                <AccordionTrigger>Publication Filtering</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="border p-4 rounded-md mb-4">
                    <Label className="mb-2 block font-semibold text-base">Section Title</Label>
                    <Input name="related_publications_title" value={content?.related_publications_title || ''} onChange={handleContentChange} />
                  </div>
                  
                  {/* Selector Logic (기존과 동일하게 유지하거나 필요시 간소화) */}
                  <div className="space-y-2">
                    <Label>Select Publications (ID Selection)</Label>
                    <Select onValueChange={(val) => {
                      const newId = parseInt(val);
                      if (content?.related_publication_ids?.includes(newId)) return;
                      setContent(prev => ({ ...prev, related_publication_ids: [...(prev?.related_publication_ids || []), newId] }));
                    }}>
                      <SelectTrigger><SelectValue placeholder="Add publication..." /></SelectTrigger>
                      <SelectContent>
                        {allPublications.map(pub => (
                           <SelectItem key={pub.id} value={pub.id.toString()}>[{pub.year}] {pub.title.substring(0, 40)}...</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="mt-2 space-y-1">
                      {content?.related_publication_ids?.map((id: number) => (
                        <div key={id} className="flex justify-between items-center bg-muted px-3 py-2 rounded text-sm">
                           <span>ID: {id}</span>
                           <Button type="button" variant="ghost" size="sm" onClick={() => setContent(prev => ({ ...prev, related_publication_ids: prev.related_publication_ids.filter((pid: number) => pid !== id) }))}>
                             <Trash2 className="w-4 h-4" />
                           </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          <div className="flex justify-end gap-4 pt-6 border-t mt-6">
            <Button type="button" variant="outline" onClick={onBack} className="w-32">취소</Button>
            <Button type="submit" disabled={loading} className="w-32">{loading ? '저장 중...' : '저장하기'}</Button>
          </div>
          {message && <p className="text-center pt-2">{message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}