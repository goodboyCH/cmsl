import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

    // ⬇️ Research Highlights 항목 추가/삭제를 위한 함수 ⬇️
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

  if (loading) return <p className="text-center p-8">Loading Home Page Editor...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>메인 페이지 콘텐츠 수정</CardTitle>
        <CardDescription>메인 페이지의 모든 텍스트와 이미지 경로를 수정합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Hero Section */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">Hero Section</h3>
            <div className="space-y-2"><Label>Background GIF URL</Label><Input name="background_gif_url" value={content?.hero?.background_gif_url || ''} onChange={(e) => handleSimpleChange(e, 'hero')} /></div>
            <div className="space-y-2"><Label>Main Title</Label><Textarea name="title" value={content?.hero?.title || ''} onChange={(e) => handleSimpleChange(e, 'hero')} rows={2} /></div>
            <div className="space-y-2"><Label>Subtitle</Label><Textarea name="subtitle" value={content?.hero?.subtitle || ''} onChange={(e) => handleSimpleChange(e, 'hero')} rows={3} /></div>
            <div className="space-y-2"><Label>Capabilities Text</Label><Input name="capabilities_text" value={content?.hero?.capabilities_text || ''} onChange={(e) => handleSimpleChange(e, 'hero')} /></div>
            <div className="space-y-2"><Label>Recruitment Text</Label><Input name="recruitment_text" value={content?.hero?.recruitment_text || ''} onChange={(e) => handleSimpleChange(e, 'hero')} /></div>
          </div>

          {/* Core Capabilities */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">Core Capabilities Section</h3>
            {(content?.capabilities || []).map((item: any, index: number) => (
              <div key={item.id} className="p-2 border-t space-y-2">
                <Label>Capability #{index + 1}</Label>
                <Input placeholder="Title" value={item.title} onChange={(e) => handleInputChange('capabilities', index, 'title', e.target.value)} />
                <Textarea placeholder="Description" value={item.description} onChange={(e) => handleInputChange('capabilities', index, 'description', e.target.value)} />
                <Input placeholder="Background Image URL" value={item.bgImage} onChange={(e) => handleInputChange('capabilities', index, 'bgImage', e.target.value)} />
              </div>
            ))}
          </div>

          {/* Research Topics */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">Research Topics Section</h3>
             {(content?.research_topics || []).map((item: any, index: number) => (
              <div key={item.path} className="p-2 border-t space-y-2">
                <Label>Topic #{index + 1}</Label>
                <Input placeholder="Title" value={item.title} onChange={(e) => handleInputChange('research_topics', index, 'title', e.target.value)} />
                <Textarea placeholder="Description" value={item.description} onChange={(e) => handleInputChange('research_topics', index, 'description', e.target.value)} />
                <Input placeholder="Background Image URL" value={item.bgImage} onChange={(e) => handleInputChange('research_topics', index, 'bgImage', e.target.value)} />
              </div>
            ))}
          </div>
          
          {/* Research Highlights Section */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Research Highlights Section</h3>
              <Button type="button" size="sm" onClick={addHighlight}>하이라이트 추가</Button>
            </div>
             {(content?.research_highlights || []).map((item: any, index: number) => (
              <div key={index} className="p-4 border-t space-y-2 relative">
                <Label>Highlight #{index + 1}</Label>
                <Input placeholder="Title" value={item.title} onChange={(e) => handleInputChange('research_highlights', index, 'title', e.target.value)} />
                <Input placeholder="Authors" value={item.authors} onChange={(e) => handleInputChange('research_highlights', index, 'authors', e.target.value)} />
                <Input placeholder="Journal" value={item.journal} onChange={(e) => handleInputChange('research_highlights', index, 'journal', e.target.value)} />
                <Input placeholder="Year" value={item.year} onChange={(e) => handleInputChange('research_highlights', index, 'year', e.target.value)} />
                <Textarea placeholder="Description" value={item.description} onChange={(e) => handleInputChange('research_highlights', index, 'description', e.target.value)} />
                <Input placeholder="Image URL" value={item.image} onChange={(e) => handleInputChange('research_highlights', index, 'image', e.target.value)} />
                <Input placeholder="DOI Link" value={item.doi} onChange={(e) => handleInputChange('research_highlights', index, 'doi', e.target.value)} />
                <Button type="button" variant="destructive" size="sm" className="absolute top-4 right-4" onClick={() => removeHighlight(index)}>삭제</Button>
              </div>
            ))}
          </div>
          
          {/* Video Section */}
          <div className="space-y-2 p-4 border rounded-lg">
            <Label className="text-lg font-semibold">Video Section</Label>
            <Input name="video_src" value={content?.video_src || ''} onChange={(e) => handleSimpleChange(e)} placeholder="https://www.youtube.com/embed/..."/>
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