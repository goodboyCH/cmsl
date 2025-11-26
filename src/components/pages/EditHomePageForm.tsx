import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // 1. Tabs Import
import { supabase } from '@/lib/supabaseClient';

interface EditHomePageFormProps { onBack: () => void; }

export function EditHomePageForm({ onBack }: EditHomePageFormProps) {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data } = await supabase.from('pages').select('content').eq('page_key', 'home').single();
      setContent(data?.content || {});
      setLoading(false);
    };
    fetchContent();
  }, []);

  const handleInputChange = (section: string, index: number, field: string, value: string) => {
    const updatedSection = [...content[section]];
    updatedSection[index] = { ...updatedSection[index], [field]: value };
    setContent({ ...content, [section]: updatedSection });
  };

  const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section?: string) => {
    const { name, value } = e.target;
    if (section) {
      setContent({ ...content, [section]: { ...content[section], [name]: value } });
    } else {
      setContent({ ...content, [name]: value });
    }
  };

  // ... addHighlight, removeHighlight 로직 (기존 유지)
  const addHighlight = () => {
    const newHighlight = { title: "", authors: "", journal: "", year: "", description: "", category: "", image: "", doi: "" };
    setContent({ ...content, research_highlights: [...(content.research_highlights || []), newHighlight] });
  };
  const removeHighlight = (indexToRemove: number) => {
    setContent({ ...content, research_highlights: content.research_highlights.filter((_: any, index: number) => index !== indexToRemove) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.from('pages').update({ content }).eq('page_key', 'home');
      if (error) throw error;
      setMessage('메인 페이지 콘텐츠가 성공적으로 저장되었습니다.');
      setTimeout(onBack, 1500);
    } catch (err: any) {
      setMessage(`오류 발생: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center p-8">Loading...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>메인 페이지 콘텐츠 수정</CardTitle>
        <CardDescription>각 섹션별로 영어와 한국어 내용을 입력해주세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 📺 Hero Section */}
          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">1. Hero Section</h3>
            <div className="space-y-2"><Label>Background Video URL</Label><Input name="background_gif_url" value={content?.hero?.background_gif_url || ''} onChange={(e) => handleSimpleChange(e, 'hero')} /></div>
            
            <Tabs defaultValue="en">
              <TabsList><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="ko">Korean</TabsTrigger></TabsList>
              <TabsContent value="en" className="space-y-3">
                <div className="space-y-1"><Label>Main Title</Label><Textarea name="title" value={content?.hero?.title || ''} onChange={(e) => handleSimpleChange(e, 'hero')} rows={2} /></div>
                <div className="space-y-1"><Label>Subtitle</Label><Textarea name="subtitle" value={content?.hero?.subtitle || ''} onChange={(e) => handleSimpleChange(e, 'hero')} rows={3} /></div>
                <div className="space-y-1"><Label>Capabilities Text</Label><Input name="capabilities_text" value={content?.hero?.capabilities_text || ''} onChange={(e) => handleSimpleChange(e, 'hero')} /></div>
                <div className="space-y-1"><Label>Recruitment Text</Label><Input name="recruitment_text" value={content?.hero?.recruitment_text || ''} onChange={(e) => handleSimpleChange(e, 'hero')} /></div>
              </TabsContent>
              <TabsContent value="ko" className="space-y-3">
                <div className="space-y-1"><Label>메인 타이틀 (KO)</Label><Textarea name="title_ko" value={content?.hero?.title_ko || ''} onChange={(e) => handleSimpleChange(e, 'hero')} rows={2} /></div>
                <div className="space-y-1"><Label>서브 타이틀 (KO)</Label><Textarea name="subtitle_ko" value={content?.hero?.subtitle_ko || ''} onChange={(e) => handleSimpleChange(e, 'hero')} rows={3} /></div>
                <div className="space-y-1"><Label>핵심 역량 텍스트 (KO)</Label><Input name="capabilities_text_ko" value={content?.hero?.capabilities_text_ko || ''} onChange={(e) => handleSimpleChange(e, 'hero')} /></div>
                <div className="space-y-1"><Label>채용 텍스트 (KO)</Label><Input name="recruitment_text_ko" value={content?.hero?.recruitment_text_ko || ''} onChange={(e) => handleSimpleChange(e, 'hero')} /></div>
              </TabsContent>
            </Tabs>
          </div>

          {/* ⚡ Core Capabilities */}
          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">2. Core Capabilities</h3>
            {(content?.capabilities || []).map((item: any, index: number) => (
              <div key={item.id} className="p-4 border rounded-md bg-muted/10 space-y-3">
                <div className="flex justify-between"><Label className="font-bold">Capability #{index + 1}</Label></div>
                <div className="space-y-1"><Label>Background Image URL</Label><Input value={item.bgImage} onChange={(e) => handleInputChange('capabilities', index, 'bgImage', e.target.value)} /></div>
                
                <Tabs defaultValue="en" className="mt-2">
                  <TabsList><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="ko">Korean</TabsTrigger></TabsList>
                  <TabsContent value="en" className="space-y-2">
                    <Input placeholder="Title" value={item.title} onChange={(e) => handleInputChange('capabilities', index, 'title', e.target.value)} />
                    <Textarea placeholder="Description" value={item.description} onChange={(e) => handleInputChange('capabilities', index, 'description', e.target.value)} rows={3} />
                  </TabsContent>
                  <TabsContent value="ko" className="space-y-2">
                    <Input placeholder="제목 (KO)" value={item.title_ko || ''} onChange={(e) => handleInputChange('capabilities', index, 'title_ko', e.target.value)} />
                    <Textarea placeholder="설명 (KO)" value={item.description_ko || ''} onChange={(e) => handleInputChange('capabilities', index, 'description_ko', e.target.value)} rows={3} />
                  </TabsContent>
                </Tabs>
              </div>
            ))}
          </div>

          {/* 🔬 Research Topics */}
          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">3. Research Topics</h3>
             {(content?.research_topics || []).map((item: any, index: number) => (
              <div key={item.path} className="p-4 border rounded-md bg-muted/10 space-y-3">
                <Label className="font-bold">Topic #{index + 1}</Label>
                <div className="space-y-1"><Label>Background Image URL</Label><Input value={item.bgImage} onChange={(e) => handleInputChange('research_topics', index, 'bgImage', e.target.value)} /></div>
                
                <Tabs defaultValue="en" className="mt-2">
                  <TabsList><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="ko">Korean</TabsTrigger></TabsList>
                  <TabsContent value="en" className="space-y-2">
                    <Input placeholder="Title" value={item.title} onChange={(e) => handleInputChange('research_topics', index, 'title', e.target.value)} />
                    <Textarea placeholder="Description" value={item.description} onChange={(e) => handleInputChange('research_topics', index, 'description', e.target.value)} rows={2} />
                  </TabsContent>
                  <TabsContent value="ko" className="space-y-2">
                    <Input placeholder="제목 (KO)" value={item.title_ko || ''} onChange={(e) => handleInputChange('research_topics', index, 'title_ko', e.target.value)} />
                    <Textarea placeholder="설명 (KO)" value={item.description_ko || ''} onChange={(e) => handleInputChange('research_topics', index, 'description_ko', e.target.value)} rows={2} />
                  </TabsContent>
                </Tabs>
              </div>
            ))}
          </div>
          
          {/* Research Highlights & Video Section은 그대로 유지 (필요시 동일한 Tabs 패턴 적용) */}
          {/* ... 생략 (Research Highlights는 주로 논문이라 제목 번역을 잘 안하지만 필요하면 추가 가능) ... */}
          <div className="space-y-2 p-4 border rounded-lg">
            <Label className="text-lg font-semibold">Video Section</Label>
            <Input name="video_src" value={content?.video_src || ''} onChange={(e) => handleSimpleChange(e)} placeholder="YouTube Embed URL"/>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onBack}>취소</Button>
            <Button type="submit" disabled={loading}>{loading ? '저장 중...' : '메인 페이지 저장'}</Button>
          </div>
          {message && <p className="text-sm text-center pt-2">{message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}