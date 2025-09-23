import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';

interface EditAlumniPageProps {
  alumniId?: number;
  onBack: () => void;
}

export function EditAlumniPage({ alumniId, onBack }: EditAlumniPageProps) {
  const [formData, setFormData] = useState({
    name: '', degree: '', thesis: '', current_position: '',
    achievements: '', year_range: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (alumniId) {
      const fetchAlumni = async () => {
        setLoading(true);
        const { data } = await supabase.from('alumni').select('*').eq('id', alumniId).single();
        if (data) {
          setFormData({
            name: data.name || '',
            degree: data.degree || '',
            thesis: data.thesis || '',
            current_position: data.current_position || '',
            achievements: (data.achievements || []).join('\n'),
            year_range: data.year_range || ''
          });
        }
        setLoading(false);
      };
      fetchAlumni();
    } else {
      setLoading(false);
    }
  }, [alumniId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMessage('');
    try {
      const finalData = {
        ...formData,
        achievements: formData.achievements.split('\n').filter(line => line.trim() !== ''),
      };

      if (alumniId) {
        const { error } = await supabase.from('alumni').update(finalData).eq('id', alumniId);
        if (error) throw error;
        setMessage('졸업생 정보가 성공적으로 수정되었습니다.');
      } else {
        const { error } = await supabase.from('alumni').insert([finalData]);
        if (error) throw error;
        setMessage('새 졸업생이 성공적으로 추가되었습니다.');
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
        <CardTitle>{alumniId ? '졸업생 정보 수정' : '새 졸업생 추가'}</CardTitle>
        <CardDescription>졸업생의 상세 정보를 입력해주세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Name</Label><Input name="name" value={formData.name} onChange={handleChange} required /></div>
            <div className="space-y-2"><Label>Degree</Label><Input name="degree" value={formData.degree} onChange={handleChange} placeholder="e.g., Ph.D. (2023)" /></div>
            <div className="space-y-2"><Label>Current Position</Label><Input name="current_position" value={formData.current_position} onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Year Range</Label><Input name="year_range" value={formData.year_range} onChange={handleChange} placeholder="e.g., 2018-2023" /></div>
          </div>
          <div className="space-y-2"><Label>Thesis</Label><Textarea name="thesis" value={formData.thesis} onChange={handleChange} rows={2} /></div>
          <div className="space-y-2"><Label>Achievements (한 줄에 하나씩)</Label><Textarea name="achievements" value={formData.achievements} onChange={handleChange} rows={3} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onBack}>목록으로</Button><Button type="submit" disabled={loading}>{loading ? '저장 중...' : '저장'}</Button></div>
          {message && <p className="text-sm text-center pt-2">{message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}