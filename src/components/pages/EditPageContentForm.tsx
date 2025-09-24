import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';

interface EditPageContentFormProps {
  pageKey: string;
  onBack: () => void;
}

export function EditPageContentForm({ pageKey, onBack }: EditPageContentFormProps) {
  const [content, setContent] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // 1. 폼의 내용을 텍스트 형태로 다루기 위한 별도의 state 추가
  //    (Education, Experience 등을 Textarea에서 편집하기 위함)
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
        // 2. 'professor' 페이지인 경우, DB의 배열 데이터를 Textarea에 표시할 문자열로 변환
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

  // 일반 텍스트 필드 변경 핸들러
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContent(prev => (prev ? { ...prev, [name]: value } : { [name]: value }));
  };
  
  // 교수님 정보의 중첩 객체(contact) 변경 핸들러
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContent(prev => (prev ? { ...prev, contact: { ...prev.contact, [name]: value } } : {}));
  };

  // Textarea 블록 변경 핸들러
  const handleTextBlockChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTextBlocks(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      let finalContent = { ...content };

      // 3. 'professor' 페이지 저장 시, Textarea의 문자열을 다시 JSON 배열 구조로 변환
      if (pageKey === 'professor') {
        finalContent.education = textBlocks.education.split('\n').filter(line => line.includes('|')).map(line => ({ period: line.split('|')[0].trim(), description: line.split('|')[1].trim() }));
        finalContent.experience = textBlocks.experience.split('\n').filter(line => line.includes('|')).map(line => ({ period: line.split('|')[0].trim(), description: line.split('|')[1].trim() }));
        finalContent.awards_and_honors = textBlocks.awards_and_honors.split('\n').filter(line => line.includes('|')).map(line => ({ period: line.split('|')[0].trim(), description: line.split('|')[1].trim() }));
        finalContent.research_interests = textBlocks.research_interests.split('\n').filter(line => line.trim() !== '');
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

  // 4. pageKey에 따라 다른 폼을 렌더링
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
              <div className="space-y-2"><Label>Name</Label><Input name="name" value={content?.name || ''} onChange={handleContentChange} /></div>
              <div className="space-y-2"><Label>Title (e.g., Professor)</Label><Input name="title" value={content?.title || ''} onChange={handleContentChange} /></div>
              <div className="space-y-2"><Label>Department</Label><Input name="department" value={content?.department || ''} onChange={handleContentChange} /></div>
              <div className="space-y-2"><Label>Profile Image URL</Label><Input name="profile_image_url" value={content?.profile_image_url || ''} onChange={handleContentChange} /></div>
              <div className="space-y-2"><Label>Contact - Phone</Label><Input name="phone" value={content?.contact?.phone || ''} onChange={handleContactChange} /></div>
              <div className="space-y-2"><Label>Contact - Email</Label><Input name="email" value={content?.contact?.email || ''} onChange={handleContactChange} /></div>
              <div className="space-y-2"><Label>Contact - Office</Label><Input name="office" value={content?.contact?.office || ''} onChange={handleContactChange} /></div>
              
              <div className="space-y-2">
                <Label>Research Interests (한 줄에 하나씩)</Label>
                <Textarea name="research_interests" value={textBlocks.research_interests} onChange={handleTextBlockChange} rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Education (형식: 기간 | 내용)</Label>
                <Textarea name="education" value={textBlocks.education} onChange={handleTextBlockChange} rows={4} placeholder="e.g., 1998.3. – 2002.2. | Ph.D. in Materials Science..." />
              </div>
              <div className="space-y-2">
                <Label>Experience (형식: 기간 | 내용)</Label>
                <Textarea name="experience" value={textBlocks.experience} onChange={handleTextBlockChange} rows={8} />
              </div>
              <div className="space-y-2">
                <Label>Awards & Honors (형식: 기간 | 내용)</Label>
                <Textarea name="awards_and_honors" value={textBlocks.awards_and_honors} onChange={handleTextBlockChange} rows={5} />
              </div>
            </>
          ) : (
            // 기존 리서치 페이지 폼
            <>
              <div className="space-y-2"><Label>Main Title (h1)</Label><Input name="title" value={content?.title || ''} onChange={handleContentChange} /></div>
              <div className="space-y-2"><Label>Subtitle (p)</Label><Input name="subtitle" value={content?.subtitle || ''} onChange={handleContentChange} /></div>
              <div className="space-y-2"><Label>Main Paragraph 1</Label><Textarea name="main_paragraph_1" value={content?.main_paragraph_1 || ''} onChange={handleContentChange} rows={5} /></div>
              <div className="space-y-2"><Label>Main Paragraph 2</Label><Textarea name="main_paragraph_2" value={content?.main_paragraph_2 || ''} onChange={handleContentChange} rows={5} /></div>
              <div className="space-y-2"><Label>Main Image URL</Label><Input name="main_image_url" value={content?.main_image_url || ''} onChange={handleContentChange} placeholder="https://..."/></div>
            </>
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