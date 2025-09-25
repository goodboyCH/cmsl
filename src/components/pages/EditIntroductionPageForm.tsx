import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2 } from 'lucide-react';

interface EditIntroductionPageFormProps { onBack: () => void; }

export function EditIntroductionPageForm({ onBack }: EditIntroductionPageFormProps) {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data } = await supabase.from('pages').select('content').eq('page_key', 'introduction').single();
      setContent(data?.content || {});
      setLoading(false);
    };
    fetchContent();
  }, []);

  const handleNestedChange = (section: string, field: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleArrayItemChange = (section: string, index: number, field: string, value: string) => {
    const updatedItems = [...content[section].values];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setContent({ ...content, [section]: { ...content[section], values: updatedItems } });
  };
  
  const addItemToArray = (section: string, newItem: object) => {
    const currentSection = content[section] || { values: [] };
    setContent({ ...content, [section]: { ...currentSection, values: [...(currentSection.values || []), newItem] }});
  };
  
  const removeItemFromArray = (section: string, indexToRemove: number) => {
    setContent({ ...content, [section]: { ...content[section], values: content[section].values.filter((_: any, index: number) => index !== indexToRemove) }});
  };

  const handleVisionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const paragraphs = e.target.value.split('\n');
    setContent({ ...content, vision_section: { ...content.vision_section, paragraphs } });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.from('pages').update({ content }).eq('page_key', 'introduction');
      if (error) throw error;
      setMessage('소개 페이지 콘텐츠가 성공적으로 저장되었습니다.');
      setTimeout(onBack, 1500);
    } catch (err: any) {
      setMessage(`오류 발생: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center p-8">Loading Introduction Page Editor...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Introduction 페이지 수정</CardTitle>
        <CardDescription>페이지의 각 섹션별 내용을 수정합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Section 1: Mission</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="space-y-2"><Label>Background Image URL</Label><Input value={content?.mission_section?.image_url || ''} onChange={(e) => handleNestedChange('mission_section', 'image_url', e.target.value)} /></div>
                <div className="space-y-2"><Label>Title</Label><Input value={content?.mission_section?.title || ''} onChange={(e) => handleNestedChange('mission_section', 'title', e.target.value)} /></div>
                <div className="space-y-2"><Label>Korean Mission</Label><Textarea value={content?.mission_section?.korean_mission || ''} onChange={(e) => handleNestedChange('mission_section', 'korean_mission', e.target.value)} /></div>
                <div className="space-y-2"><Label>English Mission</Label><Textarea value={content?.mission_section?.english_mission || ''} onChange={(e) => handleNestedChange('mission_section', 'english_mission', e.target.value)} /></div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Section 2: Core Values</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="space-y-2"><Label>Section Title</Label><Input value={content?.core_values_section?.title || ''} onChange={(e) => handleNestedChange('core_values_section', 'title', e.target.value)} /></div>
                {(content?.core_values_section?.values || []).map((item: any, index: number) => (
                  <div key={index} className="p-3 border rounded-md space-y-2 relative">
                    <Label>Value #{index + 1}</Label>
                    <Input placeholder="Icon Name (e.g., Clarity, Atom)" value={item.icon} onChange={(e) => handleArrayItemChange('core_values_section', index, 'icon', e.target.value)} />
                    <Input placeholder="Title" value={item.title} onChange={(e) => handleArrayItemChange('core_values_section', index, 'title', e.target.value)} />
                    <Textarea placeholder="Description" value={item.description} onChange={(e) => handleArrayItemChange('core_values_section', index, 'description', e.target.value)} />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeItemFromArray('core_values_section', index)}><Trash2 className="h-4 w-4"/></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addItemToArray('core_values_section', {icon: '', title: '', description: ''})}>Add Value</Button>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Section 3: Vision</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="space-y-2"><Label>Section Title</Label><Input value={content?.vision_section?.title || ''} onChange={(e) => handleNestedChange('vision_section', 'title', e.target.value)} /></div>
                <div className="space-y-2">
                  <Label>Paragraphs (한 줄에 한 문단씩)</Label>
                  <Textarea value={(content?.vision_section?.paragraphs || []).join('\n')} onChange={handleVisionChange} rows={6} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onBack}>취소</Button>
            <Button type="submit" disabled={loading}>{loading ? '저장 중...' : '페이지 저장'}</Button>
          </div>
          {message && <p className="text-sm text-center pt-2">{message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}