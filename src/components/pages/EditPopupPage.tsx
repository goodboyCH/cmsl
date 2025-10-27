import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';
import { Checkbox } from '@/components/ui/checkbox';
import { Label as CheckboxLabel } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // 1. Select 컴포넌트 import

const sanitizeForStorage = (filename: string) => filename.replace(/[^a-zA-Z0-9._-]/g, '');

interface EditPopupPageProps {
  popupId?: number;
  onBack: () => void;
}

// 2. 스타일의 기본값을 정의합니다.
const defaultStyles = {
  popupSize: 'md', // sm, md, lg
  imageSize: 'full', // full, contain
  textSize: 'base', // sm, base, lg
};

export function EditPopupPage({ popupId, onBack }: EditPopupPageProps) {
  const [formData, setFormData] = useState({
    title: '', content: '', link_url: '', is_active: false
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [styles, setStyles] = useState(defaultStyles); // 3. 스타일 state 추가
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (popupId) {
      const fetchPopup = async () => {
        setLoading(true);
        const { data } = await supabase.from('popups').select('*').eq('id', popupId).single();
        if (data) {
          setFormData({ title: data.title, content: data.content, link_url: data.link_url, is_active: data.is_active });
          setExistingImageUrl(data.image_url);
          setStyles(data.styles || defaultStyles); // 4. DB에서 스타일 로드
        }
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
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleStyleChange = (field: string, value: string) => {
    setStyles(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMessage('');
    try {
      let finalImageUrl = existingImageUrl;
      if (newImage) {
        if (existingImageUrl) {
          const oldPath = existingImageUrl.substring(existingImageUrl.indexOf('public/'));
          await supabase.storage.from('notice-attachments').remove([oldPath]);
        }
        const imagePath = `public/popups/${Date.now()}_${sanitizeForStorage(newImage.name)}`;
        const { error: uploadError } = await supabase.storage.from('notice-attachments').upload(imagePath, newImage);
        if (uploadError) throw uploadError;
        finalImageUrl = supabase.storage.from('notice-attachments').getPublicUrl(imagePath).data.publicUrl;
      }
      
      const finalData = { ...formData, image_url: finalImageUrl, styles: styles };

      if (popupId) {
        const { error } = await supabase.from('popups').update(finalData).eq('id', popupId);
        if (error) throw error;
        setMessage('팝업이 성공적으로 수정되었습니다.');
      } else {
        const { error } = await supabase.from('popups').insert([finalData]);
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
  
  const previewImageUrl = newImage ? URL.createObjectURL(newImage) : existingImageUrl;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{popupId ? '팝업 수정' : '새 팝업 추가'}</CardTitle>
          <CardDescription>팝업 내용을 입력하세요. 'Active'로 체크된 팝업만 홈페이지에 표시됩니다.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 2. ⬇️ 이전에 누락되었던 폼 입력 필드들입니다. ⬇️ */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Title (필수)</Label><Input name="title" value={formData.title} onChange={handleChange} required /></div>
            <div className="space-y-2"><Label>Content (설명)</Label><Textarea name="content" value={formData.content || ''} onChange={handleChange} rows={3} /></div>
            <div className="space-y-2">
              <Label>Popup Image</Label>
              {previewImageUrl && (
                <img src={previewImageUrl} alt="Popup preview" className="w-full max-w-sm object-cover rounded-md border" />
              )}
              <Input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            <div className="space-y-2"><Label>Link URL (클릭 시 이동할 주소)</Label><Input name="link_url" value={formData.link_url || ''} onChange={handleChange} placeholder="https://..." /></div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="is_active" checked={formData.is_active} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: !!checked }))} />
              <CheckboxLabel htmlFor="is_active">이 팝업을 홈페이지에 표시 (Active)</CheckboxLabel>
            </div>

            {/* 7. ⬇️ 스타일 편집 UI 추가 ⬇️ */}
            <div className="p-4 border rounded-lg space-y-4">
              <h4 className="font-medium text-primary">디자인 설정</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>팝업 크기</Label>
                  <Select value={styles.popupSize} onValueChange={(v) => handleStyleChange('popupSize', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium (Default)</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>이미지 크기</Label>
                  <Select value={styles.imageSize} onValueChange={(v) => handleStyleChange('imageSize', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Width</SelectItem>
                      <SelectItem value="contain">Contain (Fit)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>텍스트 크기</Label>
                  <Select value={styles.textSize} onValueChange={(v) => handleStyleChange('textSize', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="base">Base (Default)</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {/* ⬆️ 스타일 편집 UI 끝 ⬆️ */}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onBack}>목록으로</Button>
              <Button type="button" variant="secondary" onClick={() => setIsPreviewOpen(true)}>미리보기</Button>
              <Button type="submit" disabled={loading}>{loading ? '저장 중...' : '저장'}</Button>
            </div>
            {message && <p className="text-sm text-center pt-2">{message}</p>}
          </form>
        </CardContent>
      </Card>

      {/* 8. ⬇️ 미리보기 팝업에도 스타일 적용 ⬇️ */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className={`
          ${styles.popupSize === 'sm' && 'sm:max-w-sm'}
          ${styles.popupSize === 'md' && 'sm:max-w-md'}
          ${styles.popupSize === 'lg' && 'sm:max-w-lg'}
        `}>
          <DialogHeader>
            <DialogTitle className={`${styles.textSize === 'lg' && 'text-2xl'}`}>{formData.title || '제목 없음'}</DialogTitle>
            <DialogDescription className={`${styles.textSize === 'sm' && 'text-xs'}`}>{formData.content}</DialogDescription>
          </DialogHeader>
          {previewImageUrl && (
            <div className="py-4">
              <img src={previewImageUrl} alt="Popup preview" className={`w-full rounded-md ${styles.imageSize === 'contain' && 'object-contain h-64'}`} />
            </div>
          )}
          <DialogFooter className="sm:justify-between gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsPreviewOpen(false)}>
              오늘 하루 보지 않기
            </Button>
            <Button type="button" onClick={() => setIsPreviewOpen(false)} disabled={!formData.link_url}>
              자세히 보기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}