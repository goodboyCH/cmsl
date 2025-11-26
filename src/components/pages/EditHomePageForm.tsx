import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/lib/supabaseClient';

interface EditHomePageFormProps {
  onBack: () => void;
}

export function EditHomePageForm({ onBack }: EditHomePageFormProps) {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // 초기 데이터 로드
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('pages')
        .select('content')
        .eq('page_key', 'home')
        .single();
      
      // 데이터가 없으면 빈 객체로 초기화하여 오류 방지
      setContent(data?.content || {});
      setLoading(false);
    };
    fetchContent();
  }, []);

  // 배열 데이터 수정 핸들러 (Capabilities, Topics, Highlights 등)
  const handleInputChange = (section: string, index: number, field: string, value: string) => {
    if (!content[section]) return;
    const updatedSection = [...content[section]];
    updatedSection[index] = { ...updatedSection[index], [field]: value };
    setContent({ ...content, [section]: updatedSection });
  };

  // 단순 필드 수정 핸들러 (Hero, Video 등)
  const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section?: string) => {
    const { name, value } = e.target;
    if (section) {
      setContent({ ...content, [section]: { ...content[section], [name]: value } });
    } else {
      setContent({ ...content, [name]: value });
    }
  };

  // Research Highlight 추가
  const addHighlight = () => {
    const newHighlight = { 
      title: "", authors: "", journal: "", year: "", 
      description: "", description_ko: "", // 한국어 필드 초기화
      category: "", image: "", doi: "" 
    };
    setContent({ 
      ...content, 
      research_highlights: [...(content.research_highlights || []), newHighlight] 
    });
  };

  // Research Highlight 삭제
  const removeHighlight = (indexToRemove: number) => {
    setContent({ 
      ...content, 
      research_highlights: content.research_highlights.filter((_: any, index: number) => index !== indexToRemove) 
    });
  };

  // 저장 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase
        .from('pages')
        .update({ content })
        .eq('page_key', 'home');
      
      if (error) throw error;
      
      setMessage('메인 페이지 콘텐츠가 성공적으로 저장되었습니다.');
      // 저장 후 잠시 대기했다가 뒤로가기 (선택사항)
      setTimeout(onBack, 1500);
    } catch (err: any) {
      setMessage(`오류 발생: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center p-8">Loading Home Page Editor...</p>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>메인 페이지 콘텐츠 수정</CardTitle>
        <CardDescription>
          각 섹션별로 영어(English)와 한국어(Korean) 탭을 전환하여 내용을 입력해주세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* -------------------------------------------------------
              1. Hero Section 
          ------------------------------------------------------- */}
          <div className="space-y-4 p-4 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold border-b pb-2">1. Hero Section (메인 상단)</h3>
            
            {/* 공통 요소 */}
            <div className="space-y-2">
              <Label>배경 비디오/GIF URL (Common)</Label>
              <Input 
                name="background_gif_url" 
                value={content?.hero?.background_gif_url || ''} 
                onChange={(e) => handleSimpleChange(e, 'hero')} 
                placeholder="/videos/bg1.mp4"
              />
            </div>
            
            {/* 언어별 탭 */}
            <Tabs defaultValue="en" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="en">English (Primary)</TabsTrigger>
                <TabsTrigger value="ko">한국어 (Optional)</TabsTrigger>
              </TabsList>

              <TabsContent value="en" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Main Title</Label>
                  <Textarea name="title" value={content?.hero?.title || ''} onChange={(e) => handleSimpleChange(e, 'hero')} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Textarea name="subtitle" value={content?.hero?.subtitle || ''} onChange={(e) => handleSimpleChange(e, 'hero')} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Capabilities Text (Small)</Label>
                  <Input name="capabilities_text" value={content?.hero?.capabilities_text || ''} onChange={(e) => handleSimpleChange(e, 'hero')} />
                </div>
                <div className="space-y-2">
                  <Label>Recruitment Text (Button)</Label>
                  <Input name="recruitment_text" value={content?.hero?.recruitment_text || ''} onChange={(e) => handleSimpleChange(e, 'hero')} />
                </div>
              </TabsContent>

              <TabsContent value="ko" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>메인 타이틀 (KO)</Label>
                  <Textarea name="title_ko" value={content?.hero?.title_ko || ''} onChange={(e) => handleSimpleChange(e, 'hero')} rows={2} placeholder="한글 타이틀 입력" />
                </div>
                <div className="space-y-2">
                  <Label>서브 타이틀 (KO)</Label>
                  <Textarea name="subtitle_ko" value={content?.hero?.subtitle_ko || ''} onChange={(e) => handleSimpleChange(e, 'hero')} rows={3} placeholder="한글 서브설명 입력" />
                </div>
                <div className="space-y-2">
                  <Label>핵심 역량 텍스트 (KO)</Label>
                  <Input name="capabilities_text_ko" value={content?.hero?.capabilities_text_ko || ''} onChange={(e) => handleSimpleChange(e, 'hero')} placeholder="예: Phase-Field, CALPHAD..." />
                </div>
                <div className="space-y-2">
                  <Label>채용 버튼 텍스트 (KO)</Label>
                  <Input name="recruitment_text_ko" value={content?.hero?.recruitment_text_ko || ''} onChange={(e) => handleSimpleChange(e, 'hero')} placeholder="예: 인턴 모집 중" />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* -------------------------------------------------------
              2. Core Capabilities 
          ------------------------------------------------------- */}
          <div className="space-y-4 p-4 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold border-b pb-2">2. Core Capabilities (핵심 역량)</h3>
            
            {(content?.capabilities || []).map((item: any, index: number) => (
              <div key={item.id || index} className="p-4 border rounded-md bg-muted/20 space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="font-bold text-base">Capability #{index + 1}</Label>
                </div>
                
                {/* 공통 요소 */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Background Image URL</Label>
                  <Input value={item.bgImage} onChange={(e) => handleInputChange('capabilities', index, 'bgImage', e.target.value)} />
                </div>

                <Tabs defaultValue="en" className="mt-2">
                  <TabsList><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="ko">Korean</TabsTrigger></TabsList>
                  
                  <TabsContent value="en" className="space-y-3 mt-2">
                    <div className="space-y-1">
                      <Label>Title</Label>
                      <Input value={item.title} onChange={(e) => handleInputChange('capabilities', index, 'title', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label>Description</Label>
                      <Textarea value={item.description} onChange={(e) => handleInputChange('capabilities', index, 'description', e.target.value)} rows={4} />
                    </div>
                  </TabsContent>

                  <TabsContent value="ko" className="space-y-3 mt-2">
                    <div className="space-y-1">
                      <Label>제목 (KO)</Label>
                      <Input value={item.title_ko || ''} onChange={(e) => handleInputChange('capabilities', index, 'title_ko', e.target.value)} placeholder="한글 제목" />
                    </div>
                    <div className="space-y-1">
                      <Label>설명 (KO)</Label>
                      <Textarea value={item.description_ko || ''} onChange={(e) => handleInputChange('capabilities', index, 'description_ko', e.target.value)} rows={4} placeholder="한글 설명" />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ))}
          </div>

          {/* -------------------------------------------------------
              3. Research Topics 
          ------------------------------------------------------- */}
          <div className="space-y-4 p-4 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold border-b pb-2">3. Research Topics (연구 주제)</h3>
            
             {(content?.research_topics || []).map((item: any, index: number) => (
              <div key={item.path || index} className="p-4 border rounded-md bg-muted/20 space-y-3">
                <Label className="font-bold text-base">Topic #{index + 1}</Label>
                
                {/* 공통 요소 */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Background Image URL</Label>
                  <Input value={item.bgImage} onChange={(e) => handleInputChange('research_topics', index, 'bgImage', e.target.value)} />
                </div>

                <Tabs defaultValue="en" className="mt-2">
                  <TabsList><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="ko">Korean</TabsTrigger></TabsList>
                  
                  <TabsContent value="en" className="space-y-3 mt-2">
                    <Input placeholder="Title" value={item.title} onChange={(e) => handleInputChange('research_topics', index, 'title', e.target.value)} />
                    <Textarea placeholder="Description" value={item.description} onChange={(e) => handleInputChange('research_topics', index, 'description', e.target.value)} rows={2} />
                  </TabsContent>

                  <TabsContent value="ko" className="space-y-3 mt-2">
                    <Input placeholder="제목 (KO)" value={item.title_ko || ''} onChange={(e) => handleInputChange('research_topics', index, 'title_ko', e.target.value)} />
                    <Textarea placeholder="설명 (KO)" value={item.description_ko || ''} onChange={(e) => handleInputChange('research_topics', index, 'description_ko', e.target.value)} rows={2} />
                  </TabsContent>
                </Tabs>
              </div>
            ))}
          </div>
          
          {/* -------------------------------------------------------
              4. Research Highlights 
          ------------------------------------------------------- */}
          <div className="space-y-4 p-4 border rounded-lg bg-card">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-semibold">4. Research Highlights (주요 논문)</h3>
              <Button type="button" size="sm" onClick={addHighlight} variant="outline">
                + Add Highlight
              </Button>
            </div>

             {(content?.research_highlights || []).map((item: any, index: number) => (
              <div key={index} className="p-4 border rounded-md bg-muted/20 space-y-4 relative">
                <div className="flex justify-between items-center">
                  <Label className="font-bold text-base">Highlight #{index + 1}</Label>
                  <Button type="button" variant="destructive" size="sm" className="h-8" onClick={() => removeHighlight(index)}>삭제</Button>
                </div>

                <Tabs defaultValue="en">
                  <TabsList><TabsTrigger value="en">English (Metadata)</TabsTrigger><TabsTrigger value="ko">Korean (Description)</TabsTrigger></TabsList>
                  
                  <TabsContent value="en" className="space-y-3 mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1"><Label>Title</Label><Input value={item.title} onChange={(e) => handleInputChange('research_highlights', index, 'title', e.target.value)} /></div>
                      <div className="space-y-1"><Label>Journal</Label><Input value={item.journal} onChange={(e) => handleInputChange('research_highlights', index, 'journal', e.target.value)} /></div>
                      <div className="space-y-1"><Label>Authors</Label><Input value={item.authors} onChange={(e) => handleInputChange('research_highlights', index, 'authors', e.target.value)} /></div>
                      <div className="space-y-1"><Label>Year</Label><Input value={item.year} onChange={(e) => handleInputChange('research_highlights', index, 'year', e.target.value)} /></div>
                      <div className="space-y-1"><Label>Image URL</Label><Input value={item.image} onChange={(e) => handleInputChange('research_highlights', index, 'image', e.target.value)} /></div>
                      <div className="space-y-1"><Label>DOI Link</Label><Input value={item.doi} onChange={(e) => handleInputChange('research_highlights', index, 'doi', e.target.value)} /></div>
                    </div>
                    <div className="space-y-1">
                      <Label>Description (English)</Label>
                      <Textarea value={item.description} onChange={(e) => handleInputChange('research_highlights', index, 'description', e.target.value)} rows={3} />
                    </div>
                  </TabsContent>

                  <TabsContent value="ko" className="space-y-3 mt-2">
                    <div className="p-3 bg-blue-50/50 text-blue-800 rounded-md text-sm border border-blue-100">
                      ℹ️ 논문 제목, 저자 등은 국제 표준(영어)을 유지하며, <strong>설명(Description)</strong> 부분만 한글로 번역하여 제공하는 것을 권장합니다.
                    </div>
                    <div className="space-y-1">
                      <Label>Description (Korean Translation)</Label>
                      <Textarea 
                        value={item.description_ko || ''} 
                        onChange={(e) => handleInputChange('research_highlights', index, 'description_ko', e.target.value)} 
                        rows={4} 
                        placeholder="이 논문의 주요 성과를 한글로 요약해서 입력하세요."
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ))}
          </div>
          
          {/* -------------------------------------------------------
              5. Video Section 
          ------------------------------------------------------- */}
          <div className="space-y-4 p-4 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold border-b pb-2">5. Research Video</h3>
            <div className="space-y-2">
              <Label>Youtube Embed URL</Label>
              <Input 
                name="video_src" 
                value={content?.video_src || ''} 
                onChange={(e) => handleSimpleChange(e)} 
                placeholder="https://www.youtube.com/embed/..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onBack} className="w-32">
              취소
            </Button>
            <Button type="submit" disabled={loading} className="w-32">
              {loading ? '저장 중...' : '저장하기'}
            </Button>
          </div>
          
          {message && (
            <div className={`p-4 rounded-md text-center ${message.includes('오류') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}