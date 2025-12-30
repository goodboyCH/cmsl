import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2, Plus } from 'lucide-react';
// Select 등 사용하지 않는 import 제거 가능

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
        <CardDescription>페이지의 각 섹션별 내용을 수정합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-4']} className="w-full">

            {/* --- 다른 섹션들은 생략하거나 기존 유지 --- */}

            {/* Research Areas 섹션 수정됨 */}
            {/* Research Areas 섹션 수정됨 */}
            <AccordionItem value="item-3">
              <AccordionTrigger>Section 3: Research Areas</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input value={content?.research?.title || ''} onChange={(e) => handleSectionChange('research', 'title', e.target.value)} />
                </div>
                
                {(content?.research?.items || []).map((item: any, index: number) => (
                  <div key={index} className="p-4 border rounded-md space-y-3 relative bg-slate-50 dark:bg-slate-900">
                     <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeItemFromArray('research', 'items', index)}>
                       <Trash2 className="h-4 w-4"/>
                     </Button>
                    
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={item.title} onChange={(e) => handleArrayItemChange('research', 'items', index, 'title', e.target.value)} />
                    </div>
                    
                    {/* 🟢 [수정됨] Description을 한/영 두 개로 분리 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Description (Korean)</Label>
                        <Textarea 
                          // 기존 데이터가 문자열일 경우를 대비해 안전하게 처리
                          value={typeof item.description === 'string' ? item.description : (item.description?.ko || '')} 
                          onChange={(e) => {
                            // 기존 값이 객체가 아니면 새로 만들고, 객체면 유지하면서 ko 업데이트
                            const currentDesc = typeof item.description === 'object' ? item.description : { ko: item.description, en: '' };
                            handleArrayItemChange('research', 'items', index, 'description', { ...currentDesc, ko: e.target.value });
                          }} 
                          placeholder="한글 설명을 입력하세요"
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Description (English)</Label>
                        <Textarea 
                          value={typeof item.description === 'string' ? '' : (item.description?.en || '')} 
                          onChange={(e) => {
                            const currentDesc = typeof item.description === 'object' ? item.description : { ko: item.description, en: '' };
                            handleArrayItemChange('research', 'items', index, 'description', { ...currentDesc, en: e.target.value });
                          }} 
                          placeholder="Enter English description"
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Image URL (Optional)</Label>
                      <Input value={item.imageUrl} onChange={(e) => handleArrayItemChange('research', 'items', index, 'imageUrl', e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label>Link URL (페이지 이동 주소)</Label>
                      <Input 
                        placeholder="https://... 또는 /research/..." 
                        value={item.link || ''} 
                        onChange={(e) => handleArrayItemChange('research', 'items', index, 'link', e.target.value)} 
                      />
                    </div>

                  </div>
                ))}
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  // 🟢 [수정됨] 새 항목 추가 시 description을 객체 { ko, en } 형태로 초기화
                  onClick={() => addItemToArray('research', 'items', {
                    icon: 'Car', 
                    title: '', 
                    description: { ko: '', en: '' }, 
                    imageUrl: '', 
                    link: ''
                  })}
                >
                  Add Research Area
                </Button>
              </AccordionContent>
            </AccordionItem>

          <AccordionItem value="item-4">
              <AccordionTrigger>Section 4: Demo Videos</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                
                {/* 메인 타이틀 및 설명 */}
                <div className="space-y-4 border-b pb-4">
                  <div className="space-y-2">
                    <Label>Main Section Title</Label>
                    <Input 
                      value={content?.demo?.title || ''} 
                      onChange={(e) => handleSectionChange('demo', 'title', e.target.value)} 
                      placeholder="e.g., Innovative Simulation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Main Description</Label>
                    <Textarea 
                      value={content?.demo?.description || ''} 
                      onChange={(e) => handleSectionChange('demo', 'description', e.target.value)} 
                      placeholder="섹션 전체에 대한 설명을 입력하세요."
                    />
                  </div>
                </div>

                {/* 비디오 리스트 관리 */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Video List</Label>
                  
                  {(content?.demo?.items || []).map((item: any, index: number) => (
                    <div key={index} className="p-4 border rounded-md space-y-3 relative bg-slate-50 dark:bg-slate-900">
                       <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 h-7 w-7" 
                        onClick={() => removeItemFromArray('demo', 'items', index)}
                       >
                         <Trash2 className="h-4 w-4"/>
                       </Button>
                      
                      <div className="space-y-2">
                        <Label>Video Title ({index + 1})</Label>
                        <Input 
                          value={item.title || ''} 
                          onChange={(e) => handleArrayItemChange('demo', 'items', index, 'title', e.target.value)} 
                          placeholder="e.g., KKS Model Simulation"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Video URL ({index + 1})</Label>
                        <Input 
                          value={item.videoUrl || ''} 
                          onChange={(e) => handleArrayItemChange('demo', 'items', index, 'videoUrl', e.target.value)} 
                          placeholder="/videos/demo.mp4 or External Link"
                        />
                        <p className="text-xs text-muted-foreground">public/videos 폴더 내의 경로 혹은 외부 URL</p>
                      </div>
                    </div>
                  ))}

                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full border-dashed"
                    onClick={() => addItemToArray('demo', 'items', {
                      title: 'New Video Title', 
                      videoUrl: ''
                    })}
                  >
                    <Plus className="mr-2 h-4 w-4"/> Add Video
                  </Button>
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