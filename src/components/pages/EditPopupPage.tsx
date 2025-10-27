import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';
import { Checkbox } from '@/components/ui/checkbox';
import { Label as CheckboxLabel } from '@/components/ui/label'; // 이름 충돌 방지

interface EditPopupPageProps {
  popupId?: number; // ID가 없으면 '생성' 모드
  onBack: () => void;
}

export function EditPopupPage({ popupId, onBack }: EditPopupPageProps) {
  const [formData, setFormData] = useState({
    title: '', content: '', image_url: '', link_url: '', is_active: false
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (popupId) {
      const fetchPopup = async () => {
        setLoading(true);
        const { data } = await supabase.from('popups').select('*').eq('id', popupId).single();
        if (data) setFormData(data);
        setLoading(false);
      };
      fetchPopup();
    } else {
      setLoading(false);
    }
  }, [popupId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMessage('');
    try {
      if (popupId) { // 수정 모드
        const { error } = await supabase.from('popups').update(formData).eq('id', popupId);
        if (error) throw error;
        setMessage('팝업이 성공적으로 수정되었습니다.');
      } else { // 생성 모드
        const { error } = await supabase.from('popups').insert([formData]);
        if (error) throw error;
        setMessage('새 팝업이 성공적으로 추가되었습니다.');
      }
      setTimeout(onBack, 1000);
    } catch (error: any) {
      setMessage(`오류 발생: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center p-8">Loading...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{popupId ? '팝업 수정' : '새 팝업 추가'}</CardTitle>
        <CardDescription>팝업 내용을 입력하세요. 'Active'로 체크된 팝업만 홈페이지에 표시됩니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label>Title (필수)</Label><Input name="title" value={formData.title} onChange={handleChange} required /></div>
          <div className="space-y-2"><Label>Content (설명)</Label><Textarea name="content" value={formData.content} onChange={handleChange} rows={3} /></div>
          <div className="space-y-2"><Label>Image URL (이미지 주소)</Label><Input name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." /></div>
          <div className="space-y-2"><Label>Link URL (클릭 시 이동할 주소)</Label><Input name="link_url" value={formData.link_url} onChange={handleChange} placeholder="https://..." /></div>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="is_active" checked={formData.is_active} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: !!checked }))} />
            <CheckboxLabel htmlFor="is_active">이 팝업을 홈페이지에 표시 (Active)</CheckboxLabel>
          </div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onBack}>목록으로</Button><Button type="submit" disabled={loading}>{loading ? '저장 중...' : '저장'}</Button></div>
          {message && <p className="text-sm text-center pt-2">{message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}