import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';
import { Checkbox } from '@/components/ui/checkbox';
import { Label as CheckboxLabel } from '@/components/ui/label';
// 1. 팝업 미리보기를 위해 Dialog 컴포넌트를 import 합니다.
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const sanitizeForStorage = (filename: string) => filename.replace(/[^a-zA-Z0-9._-]/g, '');

interface EditPopupPageProps {
  popupId?: number;
  onBack: () => void;
}

export function EditPopupPage({ popupId, onBack }: EditPopupPageProps) {
  const [formData, setFormData] = useState({
    title: '', content: '', link_url: '', is_active: false
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // 2. 팝업 미리보기 창을 제어할 state 추가
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (popupId) {
      const fetchPopup = async () => {
        setLoading(true);
        const { data } = await supabase.from('popups').select('*').eq('id', popupId).single();
        if (data) {
          setFormData({ title: data.title, content: data.content, link_url: data.link_url, is_active: data.is_active });
          setExistingImageUrl(data.image_url);
        }
        setLoading(false);
      };
      fetchPopup();
    } else {
      setLoading(false);
    }
  }, [popupId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { /* ... */ };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => { /* ... */ };
  const handleSubmit = async (e: React.FormEvent) => { /* ... */ };

  if (loading) return <p className="text-center p-8">Loading...</p>;

  // 3. 현재 폼의 이미지 URL을 결정하는 변수
  const previewImageUrl = newImage ? URL.createObjectURL(newImage) : existingImageUrl;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{popupId ? '팝업 수정' : '새 팝업 추가'}</CardTitle>
          <CardDescription>팝업 내용을 입력하세요. 'Active'로 체크된 팝업만 홈페이지에 표시됩니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... (폼 입력 필드들은 기존과 동일) ... */}
            
            {/* 4. ⬇️ 버튼 영역 수정: '미리보기' 버튼 추가 ⬇️ */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onBack}>목록으로</Button>
              <Button type="button" variant="secondary" onClick={() => setIsPreviewOpen(true)}>
                미리보기
              </Button>
              <Button type="submit" disabled={loading}>{loading ? '저장 중...' : '저장'}</Button>
            </div>
            {message && <p className="text-sm text-center pt-2">{message}</p>}
          </form>
        </CardContent>
      </Card>

      {/* 5. ⬇️ 팝업 미리보기를 위한 Dialog 컴포넌트 추가 ⬇️ */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{formData.title || '제목 없음'}</DialogTitle>
            {formData.content && (
              <DialogDescription>{formData.content}</DialogDescription>
            )}
          </DialogHeader>
          {previewImageUrl && (
            <div className="py-4">
              <img src={previewImageUrl} alt="Popup preview" className="w-full rounded-md" />
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