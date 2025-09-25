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

interface EditIntroductionPageFormProps { onBack: () => void; }

// 사용 가능한 아이콘 목록을 늘립니다.
const iconOptions = ["Cpu", "Atom", "FlaskConical", "TestTube2", "BrainCircuit", "Car", "Film", "HeartPulse", "Magnet", "Building", "Users"];

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

  const handleSectionChange = (section: string, field: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleArrayItemChange = (section: string, arrayName: string, index: number, field: string, value: string) => {
    const updatedItems = [...(content[section]?.[arrayName] || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    handleSectionChange(section, arrayName, updatedItems);
  };
  
  const addItemToArray = (section: string, arrayName: string, newItem: object) => {
    const updatedItems = [...(content[section]?.[arrayName] || []), newItem];
    handleSectionChange(section, arrayName, updatedItems);
  };
  
  const removeItemFromArray = (section: string, arrayName: string, indexToRemove: number) => {
    const updatedItems = (content[section]?.[arrayName] || []).filter((_: any, index: number) => index !== indexToRemove);
    handleSectionChange(section, arrayName, updatedItems);
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

  if (loading) return <p className="text-center p-8">Loading Editor...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Introduction 페이지 수정</CardTitle>
        <CardDescription>페이지의 각 섹션별 내용을 수정합니다. (Scrollytelling 버전)</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
            
            <AccordionItem value="item-1">
              {/* Mission 섹션 폼은 이전과 동일 */}
              <AccordionTrigger>Section 1: Mission</AccordionTrigger>
               <AccordionContent className="space-y-4 pt-2">
                <div className="space-y-2"><Label>Background Video URL</Label><Input value={content?.mission?.video_url || ''} onChange={(e) => handleSectionChange('mission', 'video_url', e.target.value)} /></div>
                <div className="space-y-2"><Label>Korean Mission</Label><Textarea value={content?.mission?.korean_mission || ''} onChange={(e) => handleSectionChange('mission', 'korean_mission', e.target.value)} /></div>
                <div className="space-y-2"><Label>English Mission</Label><Textarea value={content?.mission?.english_mission || ''} onChange={(e) => handleSectionChange('mission', 'english_mission', e.target.value)} /></div>
              </AccordionContent>
            </AccordionItem>

            {/* Core Capabilities 섹션 폼 */}
            <AccordionItem value="item-2">
              <AccordionTrigger>Section 2: Core Capabilities</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="space-y-2"><Label>Section Title</Label><Input value={content?.capabilities?.title || ''} onChange={(e) => handleSectionChange('capabilities', 'title', e.target.value)} /></div>
                {(content?.capabilities?.items || []).map((item: any, index: number) => (
                  <div key={index} className="p-4 border rounded-md space-y-3 relative">
                     <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeItemFromArray('capabilities', 'items', index)}><Trash2 className="h-4 w-4"/></Button>
                    <div className="space-y-2"><Label>Icon</Label><Select value={item.icon} onValueChange={(value) => handleArrayItemChange('capabilities', 'items', index, 'icon', value)}><SelectTrigger><SelectValue placeholder="Select an icon" /></SelectTrigger><SelectContent>{iconOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-2"><Label>Title</Label><Input value={item.title} onChange={(e) => handleArrayItemChange('capabilities', 'items', index, 'title', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Description</Label><Textarea value={item.description} onChange={(e) => handleArrayItemChange('capabilities', 'items', index, 'description', e.target.value)} /></div>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addItemToArray('capabilities', 'items', {icon: 'Cpu', title: '', description: ''})}>Add Capability</Button>
              </AccordionContent>
            </AccordionItem>

            {/* Research Areas 섹션 폼 */}
            <AccordionItem value="item-3">
              <AccordionTrigger>Section 3: Research Areas</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="space-y-2"><Label>Section Title</Label><Input value={content?.research?.title || ''} onChange={(e) => handleSectionChange('research', 'title', e.target.value)} /></div>
                {(content?.research?.items || []).map((item: any, index: number) => (
                  <div key={index} className="p-4 border rounded-md space-y-3 relative">
                     <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeItemFromArray('research', 'items', index)}><Trash2 className="h-4 w-4"/></Button>
                     <div className="space-y-2"><Label>Icon</Label><Select value={item.icon} onValueChange={(value) => handleArrayItemChange('research', 'items', index, 'icon', value)}><SelectTrigger><SelectValue placeholder="Select an icon" /></SelectTrigger><SelectContent>{iconOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-2"><Label>Title</Label><Input value={item.title} onChange={(e) => handleArrayItemChange('research', 'items', index, 'title', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Description</Label><Textarea value={item.description} onChange={(e) => handleArrayItemChange('research', 'items', index, 'description', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Image URL (Optional)</Label><Input value={item.imageUrl} onChange={(e) => handleArrayItemChange('research', 'items', index, 'imageUrl', e.target.value)} /></div>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addItemToArray('research', 'items', {icon: 'Car', title: '', description: '', imageUrl: ''})}>Add Research Area</Button>
              </AccordionContent>
            </AccordionItem>

            {/* Impact 섹션 폼 */}
            <AccordionItem value="item-4">
              <AccordionTrigger>Section 4: Impact</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-2">
                <div>
                  <Label className="text-lg font-semibold">Impact Points</Label>
                  <div className="space-y-4 mt-2">
                    {(content?.impact?.items || []).map((item: any, index: number) => (
                      <div key={index} className="p-4 border rounded-md space-y-3 relative">
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeItemFromArray('impact', 'items', index)}><Trash2 className="h-4 w-4"/></Button>
                        <div className="space-y-2"><Label>Icon</Label><Select value={item.icon} onValueChange={(value) => handleArrayItemChange('impact', 'items', index, 'icon', value)}><SelectTrigger><SelectValue placeholder="Select an icon" /></SelectTrigger><SelectContent>{iconOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
                        <div className="space-y-2"><Label>Title</Label><Input value={item.title} onChange={(e) => handleArrayItemChange('impact', 'items', index, 'title', e.target.value)} /></div>
                        <div className="space-y-2"><Label>Description</Label><Textarea value={item.description} onChange={(e) => handleArrayItemChange('impact', 'items', index, 'description', e.target.value)} /></div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => addItemToArray('impact', 'items', {icon: 'Building', title: '', description: ''})}>Add Impact Point</Button>
                  </div>
                </div>
                <div>
                  <Label className="text-lg font-semibold">Partner Logos</Label>
                  <div className="space-y-4 mt-2">
                    {(content?.impact?.logos || []).map((logo: any, index: number) => (
                      <div key={index} className="p-4 border rounded-md space-y-3 relative">
                         <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeItemFromArray('impact', 'logos', index)}><Trash2 className="h-4 w-4"/></Button>
                        <div className="space-y-2"><Label>Partner Name</Label><Input value={logo.name} onChange={(e) => handleArrayItemChange('impact', 'logos', index, 'name', e.target.value)} /></div>
                        <div className="space-y-2"><Label>Logo Image URL</Label><Input value={logo.url} onChange={(e) => handleArrayItemChange('impact', 'logos', index, 'url', e.target.value)} /></div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => addItemToArray('impact', 'logos', {name: '', url: ''})}>Add Partner Logo</Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onBack}>취소</Button>
            <Button type="submit" disabled={loading}>{loading ? '저장 중...' : '페이지 저장'}</Button>
          </div>
          {message && <p className="text-sm text-center pt-2 text-green-600">{message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}