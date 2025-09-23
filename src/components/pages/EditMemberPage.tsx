import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabaseClient';

const sanitizeForStorage = (filename: string) => filename.replace(/[^a-zA-Z0-9._-]/g, '');

interface EditMemberPageProps {
  memberId?: number; // memberId가 없으면 '생성' 모드
  onBack: () => void;
}

export function EditMemberPage({ memberId, onBack }: EditMemberPageProps) {
  const [formData, setFormData] = useState({
    name: '', position: 'M.S. Student', year: '', research_focus: '', email: '',
    education: '', awards: '', display_order: 99
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (memberId) { // 수정 모드일 때만 데이터 로드
      const fetchMember = async () => {
        setLoading(true);
        const { data } = await supabase.from('members').select('*').eq('id', memberId).single();
        if (data) {
          setFormData({
            name: data.name || '',
            position: data.position || 'M.S. Student',
            year: data.year || '',
            research_focus: data.research_focus || '',
            email: data.email || '',
            education: (data.education || []).join('\n'),
            awards: (data.awards || []).join('\n'),
            display_order: data.display_order || 99
          });
          setExistingImageUrl(data.image_url);
        }
        setLoading(false);
      };
      fetchMember();
    } else {
      setLoading(false); // 생성 모드이므로 로딩할 데이터 없음
    }
  }, [memberId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value, 10) || 0 : value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      let finalImageUrl = existingImageUrl;
      if (newImage) {
        if (existingImageUrl) {
          const oldPath = existingImageUrl.substring(existingImageUrl.indexOf('public/'));
          await supabase.storage.from('member-photos').remove([oldPath]);
        }
        const imagePath = `public/member-photos/${Date.now()}_${sanitizeForStorage(newImage.name)}`;
        const { error } = await supabase.storage.from('member-photos').upload(imagePath, newImage);
        if (error) throw error;
        finalImageUrl = supabase.storage.from('member-photos').getPublicUrl(imagePath).data.publicUrl;
      }

      const finalData = {
        ...formData,
        image_url: finalImageUrl,
        education: formData.education.split('\n').filter(line => line.trim() !== ''),
        awards: formData.awards.split('\n').filter(line => line.trim() !== ''),
      };

      if (memberId) { // Update
        const { error } = await supabase.from('members').update(finalData).eq('id', memberId);
        if (error) throw error;
        setMessage('멤버 정보가 성공적으로 수정되었습니다.');
      } else { // Insert
        const { error } = await supabase.from('members').insert([finalData]);
        if (error) throw error;
        setMessage('새 멤버가 성공적으로 추가되었습니다.');
      }
      setTimeout(onBack, 1000); // 1초 후 목록으로 돌아가기
    } catch (error: any) {
      setMessage(`오류 발생: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center p-8">Loading...</p>;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{memberId ? '멤버 정보 수정' : '새 멤버 추가'}</CardTitle>
          <CardDescription>멤버의 상세 정보를 입력해주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Name</Label><Input name="name" value={formData.name} onChange={handleChange} required /></div>
              <div className="space-y-2"><Label>Position</Label><Select value={formData.position} onValueChange={(val) => setFormData(p => ({...p, position: val}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Postdoctoral Researcher">Postdoctoral Researcher</SelectItem><SelectItem value="Ph.D. Student">Ph.D. Student</SelectItem><SelectItem value="M.S. Student">M.S. Student</SelectItem><SelectItem value="Undergraduate Student">Undergraduate Student</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Year</Label><Input name="year" value={formData.year} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" value={formData.email} onChange={handleChange} /></div>
            </div>
            <div className="space-y-2"><Label>Research Focus</Label><Input name="research_focus" value={formData.research_focus} onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Display Order (낮을수록 위)</Label><Input name="display_order" type="number" value={formData.display_order} onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Education (한 줄에 하나씩)</Label><Textarea name="education" value={formData.education} onChange={handleChange} rows={3} /></div>
            <div className="space-y-2"><Label>Awards (한 줄에 하나씩)</Label><Textarea name="awards" value={formData.awards} onChange={handleChange} rows={3} /></div>
            <div className="space-y-2"><Label>Profile Image</Label>{existingImageUrl && <img src={existingImageUrl} alt="Current" className="w-24 h-24 object-cover rounded-md border" />}<Input type="file" accept="image/*" onChange={handleImageChange} /></div>
            <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onBack}>목록으로</Button><Button type="submit" disabled={loading}>{loading ? '저장 중...' : '저장'}</Button></div>
            {message && <p className="text-sm text-center pt-2">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}