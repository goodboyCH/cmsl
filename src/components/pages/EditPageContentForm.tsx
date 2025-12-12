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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // 1. Tabs 컴포넌트 import

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

  // Professor 페이지 편집을 위한 텍스트 블록 상태
  const [textBlocks, setTextBlocks] = useState({
    education: '',
    experience: '',
    awards_and_honors: '',
    research_interests: ''
  });

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);

      // Fetch all publications for the selector (if not professor page)
      if (pageKey !== 'professor') {
        const { data: pubData } = await supabase
          .from('publications')
          .select('id, title, year, journal')
          .order('year', { ascending: false });
        if (pubData) setAllPublications(pubData);
      }

      const { data } = await supabase.from('pages').select('content').eq('page_key', pageKey).single();

      if (data?.content) {
        const processedContent = { ...data.content };

        // projects 태그 배열 -> 문자열 변환 (줄바꿈으로 표시)
        if (processedContent.projects) {
          processedContent.projects = processedContent.projects.map((proj: any) => ({
            ...proj,
            tags: Array.isArray(proj.tags) ? proj.tags.join('\n') : (proj.tags || '')
          }));
        }

        // 갤러리 이미지 타입 기본값 설정
        if (processedContent.gallery_images) {
          processedContent.gallery_images = processedContent.gallery_images.map((item: any) => ({
            ...item,
            type: item.type || 'image'
          }));
        } else {
          processedContent.gallery_images = [];
        }

        // 대표 미디어 초기화
        if (!processedContent.representative_media) {
          processedContent.representative_media = {
            url: processedContent.main_image_url || '',
            type: 'image',
            alt: ''
          };
        }

        setContent(processedContent);

        // Professor 페이지 데이터 처리
        if (pageKey === 'professor') {
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

  // 배열 내 항목 수정 핸들러 (프로젝트, 갤러리 등)
  const handleArrayItemChange = (arrayName: string, index: number, field: string, value: string) => {
    if (!content) return;
    const updatedItems = [...(content[arrayName] || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setContent(prev => (prev ? { ...prev, [arrayName]: updatedItems } : { [arrayName]: updatedItems }));
  };

  // 배열에 새 항목 추가 핸들러
  const addItemToArray = (arrayName: string, newItem: object) => {
    if (!content) return;
    const updatedItems = [...(content[arrayName] || []), newItem];
    setContent(prev => (prev ? { ...prev, [arrayName]: updatedItems } : { [arrayName]: updatedItems }));
  };

  // 배열 항목 삭제 핸들러
  const removeItemFromArray = (arrayName: string, indexToRemove: number) => {
    if (!content) return;
    const updatedItems = (content[arrayName] || []).filter((_: any, index: number) => index !== indexToRemove);
    setContent(prev => (prev ? { ...prev, [arrayName]: updatedItems } : { [arrayName]: updatedItems }));
  };

  // 기본 텍스트 필드 수정 핸들러
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContent(prev => (prev ? { ...prev, [name]: value } : { [name]: value }));
  };

  // 대표 미디어(Representative Media) 수정 핸들러
  const handleRepresentativeChange = (field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      representative_media: {
        ...prev?.representative_media,
        [field]: value
      }
    }));
  };

  // Professor 페이지용 연락처 수정 핸들러
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContent(prev => (prev ? { ...prev, contact: { ...prev.contact, [name]: value } } : {}));
  };

  // Professor 페이지용 텍스트 블록 수정 핸들러
  const handleTextBlockChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTextBlocks(prev => ({ ...prev, [name]: value }));
  };

  // 이미지 파일 선택 핸들러
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

      // Professor 페이지 데이터 가공
      if (pageKey === 'professor') {
        finalContent.education = textBlocks.education.split('\n').filter(line => line.includes('|')).map(line => ({ period: line.split('|')[0].trim(), description: line.split('|')[1].trim() }));
        finalContent.experience = textBlocks.experience.split('\n').filter(line => line.includes('|')).map(line => ({ period: line.split('|')[0].trim(), description: line.split('|')[1].trim() }));
        finalContent.awards_and_honors = textBlocks.awards_and_honors.split('\n').filter(line => line.includes('|')).map(line => ({ period: line.split('|')[0].trim(), description: line.split('|')[1].trim() }));
        finalContent.research_interests = textBlocks.research_interests.split('\n').filter(line => line.trim() !== '');

        // 교수 프로필 이미지 업로드
        if (newImage) {
          if (finalContent.profile_image_url) {
            // 기존 이미지가 Supabase 스토리지에 있다면 삭제 시도 (선택 사항)
            const oldPath = finalContent.profile_image_url.substring(finalContent.profile_image_url.indexOf('public/'));
            // await supabase.storage.from('professor-photo').remove([oldPath]); // 필요시 주석 해제
          }
          const imagePath = `public/professor-photo/${Date.now()}_${sanitizeForStorage(newImage.name)}`;
          const { error: uploadError } = await supabase.storage.from('professor-photo').upload(imagePath, newImage);
          if (uploadError) throw uploadError;
          finalContent.profile_image_url = supabase.storage.from('professor-photo').getPublicUrl(imagePath).data.publicUrl;
        }
      }

      // Projects 태그 처리 (줄바꿈 -> 배열)
      if (finalContent.projects) {
        finalContent.projects = finalContent.projects.map((proj: any) => ({
          ...proj,
          tags: typeof proj.tags === 'string'
            ? proj.tags.split('\n').filter(line => line.trim() !== '')
            : proj.tags
        }));
      }

      // main_image_url 동기화 (하위 호환성 유지용)
      if (finalContent.representative_media?.url) {
        finalContent.main_image_url = finalContent.representative_media.url;
      }

      // DB 업데이트
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>페이지 콘텐츠 수정</CardTitle>
        <CardDescription>'{pageKey}' 페이지의 내용을 수정합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">

          {pageKey === 'professor' ? (
            // -------------------------------------------------------
            // Professor 페이지 편집 폼 (기존 유지)
            // -------------------------------------------------------
            <>
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
            // -------------------------------------------------------
            // Research Pages 편집 폼 (Casting, Films, Biodegradable)
            // -------------------------------------------------------
            <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>페이지 소개 및 대표 미디어</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">

                  {/* 🌍 1. 메인 텍스트 (한/영 탭 적용) */}
                  <div className="border p-4 rounded-md">
                    <Label className="mb-2 block font-semibold text-base">Main Content</Label>
                    <Tabs defaultValue="en">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="en">English (Primary)</TabsTrigger>
                        <TabsTrigger value="ko">Korean (Optional)</TabsTrigger>
                      </TabsList>

                      <TabsContent value="en" className="space-y-4">
                        <div className="space-y-2"><Label>Main Title (h1)</Label><Input name="title" value={content?.title || ''} onChange={handleContentChange} /></div>
                        <div className="space-y-2"><Label>Subtitle (p)</Label><Input name="subtitle" value={content?.subtitle || ''} onChange={handleContentChange} /></div>
                        <div className="space-y-2"><Label>Main Paragraph 1</Label><Textarea name="main_paragraph_1" value={content?.main_paragraph_1 || ''} onChange={handleContentChange} rows={5} /></div>
                        <div className="space-y-2"><Label>Main Paragraph 2</Label><Textarea name="main_paragraph_2" value={content?.main_paragraph_2 || ''} onChange={handleContentChange} rows={5} /></div>
                      </TabsContent>

                      <TabsContent value="ko" className="space-y-4">
                        <div className="space-y-2"><Label>메인 타이틀 (KO)</Label><Input name="title_ko" value={content?.title_ko || ''} onChange={handleContentChange} placeholder="한글 제목" /></div>
                        <div className="space-y-2"><Label>서브 타이틀 (KO)</Label><Input name="subtitle_ko" value={content?.subtitle_ko || ''} onChange={handleContentChange} placeholder="한글 부제목" /></div>
                        <div className="space-y-2"><Label>메인 본문 1 (KO)</Label><Textarea name="main_paragraph_1_ko" value={content?.main_paragraph_1_ko || ''} onChange={handleContentChange} rows={5} placeholder="한글 본문 1" /></div>
                        <div className="space-y-2"><Label>메인 본문 2 (KO)</Label><Textarea name="main_paragraph_2_ko" value={content?.main_paragraph_2_ko || ''} onChange={handleContentChange} rows={5} placeholder="한글 본문 2" /></div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* 2. Representative Media (공통) */}
                  {/* Representative Media Section */}
                  <div className="p-4 border rounded-md space-y-3 bg-muted/20">
                    <Label className="font-bold text-primary text-base">Representative Figure (Top Section)</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label>Media URL</Label>
                        <Input
                          value={content?.representative_media?.url || ''}
                          onChange={(e) => handleRepresentativeChange('url', e.target.value)}
                          placeholder="https://... (Image or Video URL)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={content?.representative_media?.type || 'image'}
                          onValueChange={(val) => handleRepresentativeChange('type', val)}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Alt Text with Tabs */}
                    <div className="space-y-1">
                      <Label>Description (Alt Text)</Label>
                      <Tabs defaultValue="en" className="mt-1">
                        <TabsList className="h-8">
                          <TabsTrigger value="en" className="text-xs h-7">Alt Text (EN)</TabsTrigger>
                          <TabsTrigger value="ko" className="text-xs h-7">Alt Text (KO)</TabsTrigger>
                        </TabsList>
                        <TabsContent value="en">
                          <Input
                            value={content?.representative_media?.alt || ''}
                            onChange={(e) => handleRepresentativeChange('alt', e.target.value)}
                            placeholder="Description in English"
                          />
                        </TabsContent>
                        <TabsContent value="ko">
                          <Input
                            value={content?.representative_media?.alt_ko || ''}
                            onChange={(e) => handleRepresentativeChange('alt_ko', e.target.value)}
                            placeholder="한글 설명 (캡션)"
                          />
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>

                  {/* Media Gallery Section */}
                  <div className="space-y-3 pt-4">
                    <Label className="font-semibold text-base">Media Gallery (Bottom Carousel)</Label>
                    {(content?.gallery_images || []).map((item: any, index: number) => (
                      <div key={index} className="p-4 border rounded-md space-y-3 relative bg-white/50">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7"
                          onClick={() => removeItemFromArray('gallery_images', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2 space-y-2">
                            <Label>Media URL</Label>
                            <Input
                              value={item.url || ''}
                              onChange={(e) => handleArrayItemChange('gallery_images', index, 'url', e.target.value)}
                              placeholder="https://..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                              value={item.type || 'image'}
                              onValueChange={(val) => handleArrayItemChange('gallery_images', index, 'type', val)}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="image">Image</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Alt Text with Tabs for Gallery Items */}
                        <div className="space-y-1">
                          <Label>Description (Alt Text)</Label>
                          <Tabs defaultValue="en" className="mt-1">
                            <TabsList className="h-8">
                              <TabsTrigger value="en" className="text-xs h-7">Alt (EN)</TabsTrigger>
                              <TabsTrigger value="ko" className="text-xs h-7">Alt (KO)</TabsTrigger>
                            </TabsList>
                            <TabsContent value="en">
                              <Input
                                value={item.alt || ''}
                                onChange={(e) => handleArrayItemChange('gallery_images', index, 'alt', e.target.value)}
                                placeholder="Description"
                              />
                            </TabsContent>
                            <TabsContent value="ko">
                              <Input
                                value={item.alt_ko || ''}
                                onChange={(e) => handleArrayItemChange('gallery_images', index, 'alt_ko', e.target.value)}
                                placeholder="설명"
                              />
                            </TabsContent>
                          </Tabs>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addItemToArray('gallery_images', { url: '', type: 'image', alt: '', alt_ko: '' })}
                    >
                      + Add Media Item
                    </Button>
                  </div>

                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Publication Filtering (Keywords)</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-2">

                  {/* 4. 섹션 타이틀 (한/영 탭) */}
                  <div className="border p-4 rounded-md">
                    <Label className="mb-2 block font-semibold text-base">Section Title</Label>
                    <Tabs defaultValue="en">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="en">English</TabsTrigger>
                        <TabsTrigger value="ko">Korean</TabsTrigger>
                      </TabsList>
                      <TabsContent value="en" className="space-y-2">
                        <div className="space-y-1"><Label>Title</Label><Input name="related_publications_title" value={content?.related_publications_title || ''} onChange={handleContentChange} /></div>
                      </TabsContent>
                      <TabsContent value="ko" className="space-y-2">
                        <div className="space-y-1"><Label>섹션 제목 (KO)</Label><Input name="related_publications_title_ko" value={content?.related_publications_title_ko || ''} onChange={handleContentChange} placeholder="관련 연구 논문" /></div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* 5. 관련 논문 수동 선택 (최대 5개) */}
                  <div className="p-4 border rounded-md space-y-4 bg-muted/10">
                    <div className="space-y-2">
                      <Label className="font-bold text-primary">Select Related Publications (Max 5)</Label>
                      <p className="text-sm text-muted-foreground">
                        Please select up to 5 publications to display on this research page.
                      </p>

                      {/* Selector */}
                      <div className="flex gap-2">
                        <Select onValueChange={(val) => {
                          const newId = parseInt(val);
                          const currentIds = content?.related_publication_ids || [];
                          if (currentIds.length >= 5) {
                            alert("You can only select up to 5 publications.");
                            return;
                          }
                          if (!currentIds.includes(newId)) {
                            setContent(prev => ({
                              ...prev,
                              related_publication_ids: [...currentIds, newId]
                            }));
                          }
                        }}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a publication to add..." />
                          </SelectTrigger>
                          <SelectContent>
                            {allPublications.map(pub => (
                              <SelectItem key={pub.id} value={pub.id.toString()}>
                                [{pub.year}] {pub.title.substring(0, 50)}...
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Selected List */}
                      <div className="space-y-2 mt-4">
                        <Label className="text-sm font-semibold">Selected Publications:</Label>
                        {(!content?.related_publication_ids || content?.related_publication_ids.length === 0) && (
                          <p className="text-sm text-muted-foreground italic">No publications selected.</p>
                        )}
                        <div className="space-y-2">
                          {(content?.related_publication_ids || []).map((id: number) => {
                            const pub = allPublications.find(p => p.id === id);
                            if (!pub) return null;
                            return (
                              <div key={id} className="flex items-center justify-between p-3 bg-background border rounded-md shadow-sm">
                                <div className="text-sm">
                                  <span className="font-bold mr-2 text-primary">{pub.year}</span>
                                  <span className="line-clamp-1">{pub.title}</span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                                  onClick={() => {
                                    setContent(prev => ({
                                      ...prev,
                                      related_publication_ids: prev?.related_publication_ids.filter((pid: number) => pid !== id)
                                    }));
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                  </div> {/* Closing div for line 428 */}

                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          <div className="flex justify-end gap-4 pt-6 border-t mt-6">
            <Button type="button" variant="outline" onClick={onBack} className="w-32">취소</Button>
            <Button type="submit" disabled={loading} className="w-32">{loading ? '저장 중...' : '저장하기'}</Button>
          </div>
          {message && <p className={`text-sm text-center pt-2 ${message.includes('오류') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}