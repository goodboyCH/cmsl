import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabaseClient';

const sanitizeForStorage = (filename: string) => filename.replace(/[^a-zA-Z0-9._-]/g, '');

interface EditPublicationPageProps { publicationId: number; onBack: () => void; }

export function EditPublicationPage({ publicationId, onBack }: EditPublicationPageProps) {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [pubData, setPubData] = useState({
    title: '',
    authors: '',
    journal: '',
    year: new Date().getFullYear(),
    doi_link: '',
    abstract: '',
    is_featured: false,
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublication = async () => {
      const { data } = await supabase.from('publications').select('*').eq('id', publicationId).single();
      if (data) {
        setPubData({
          title: data.title || '',
          authors: data.authors || '',
          journal: data.journal || '',
          year: data.year || 2024,
          doi_link: data.doi_link || '',
          abstract: data.abstract || '',
          is_featured: data.is_featured || false,
        });
        setExistingImageUrl(data.image_url);
      }
      setLoading(false);
    };
    fetchPublication();
  }, [publicationId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setPubData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value, 10) || 0 : value }));
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
        // 기존 이미지가 있으면 삭제
        if (existingImageUrl) {
          try {
            const oldPath = existingImageUrl.substring(existingImageUrl.indexOf('public/'));
            await supabase.storage.from('publication-images').remove([oldPath]);
          } catch (removeError) {
             console.warn("기존 이미지 삭제 실패(무시하고 진행):", removeError);
          }
        }
        
        // 새 이미지 업로드
        const imagePath = `public/publication-images/${Date.now()}_${sanitizeForStorage(newImage.name)}`;
        const { error: uploadError } = await supabase.storage.from('publication-images').upload(imagePath, newImage);
        
        // ⬇️ 주요 변경점: 업로드 오류를 명시적으로 확인 ⬇️
        if (uploadError) {
          throw uploadError; // 오류가 있으면 즉시 중단
        }
        
        const { data: urlData } = supabase.storage.from('publication-images').getPublicUrl(imagePath);
        finalImageUrl = urlData.publicUrl;
      }

      const { error: updateError } = await supabase.from('publications').update({ ...pubData, image_url: finalImageUrl }).eq('id', publicationId);

      // ⬇️ DB 업데이트 오류 확인 ⬇️
      if (updateError) {
        throw updateError;
      }

      setMessage('성공적으로 수정되었습니다.');
      setTimeout(onBack, 1000);
    } catch (err: any) {
      setMessage(`오류: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center p-8">Loading editor...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader><CardTitle>Publication 수정</CardTitle><CardDescription>논문 정보를 수정하세요.</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="title">제목 (Title)</Label><Input id="title" name="title" value={pubData.title} onChange={handleChange} required /></div>
              <div className="space-y-2"><Label htmlFor="authors">저자 (Authors)</Label><Input id="authors" name="authors" value={pubData.authors} onChange={handleChange} required /></div>
              <div className="space-y-2"><Label htmlFor="journal">학술지 (Journal)</Label><Input id="journal" name="journal" value={pubData.journal} onChange={handleChange} /></div>
              <div className="space-y-2"><Label htmlFor="year">연도 (Year)</Label><Input id="year" name="year" type="number" value={pubData.year} onChange={handleChange} required /></div>
              <div className="space-y-2"><Label htmlFor="doi_link">DOI 링크</Label><Input id="doi_link" name="doi_link" value={pubData.doi_link} onChange={handleChange} /></div>
            </div>
            <div className="space-y-2"><Label>초록 (Abstract)</Label><Textarea name="abstract" value={pubData.abstract} onChange={handleChange} rows={6} /></div>
            <div className="space-y-2">
              <Label htmlFor="pub-image-input">썸네일 이미지</Label>
              {existingImageUrl && <img src={existingImageUrl} alt="Current thumbnail" className="rounded-md border max-w-xs my-2" />}
              <Input id="pub-image-input" type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            <div className="flex items-center space-x-2 pt-2"><Checkbox id="is_featured" checked={pubData.is_featured} onCheckedChange={(checked) => setPubData(prev => ({ ...prev, is_featured: !!checked }))} /><Label htmlFor="is_featured">Featured Publication으로 지정</Label></div>
            
            <div className="flex justify-between items-center mt-8">
              <Button type="submit" disabled={loading}>{loading ? '수정 중...' : '수정 완료'}</Button>
              <Button type="button" variant="outline" onClick={onBack}>취소</Button>
            </div>
            {message && <p className="text-sm pt-2">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}