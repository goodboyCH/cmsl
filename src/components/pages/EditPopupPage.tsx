import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
// 1. Select 관련 import 제거 (사용하지 않음)
// import { ... } from "@/components/ui/select";
import ReactQuill, { Quill } from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';

interface EditPopupPageProps {
  popupId?: number;
  onBack: () => void;
}

// 2. defaultStyles 상수 제거
// const defaultStyles = { ... };

const sanitizeForStorage = (filename: string) => filename.replace(/[^a-zA-Z0-9._-]/g, '');

export function EditPopupPage({ popupId, onBack }: EditPopupPageProps) {
  const [formData, setFormData] = useState({
    title: '', 
    content: '',
    link_url: '', 
    is_active: false
  });
  
  // 3. styles state 제거
  // const [styles, setStyles] = useState(defaultStyles); 
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (popupId) {
      const fetchPopup = async () => {
        setLoading(true);
        const { data } = await supabase.from('popups').select('*').eq('id', popupId).single();
        if (data) {
          setFormData({ 
            title: data.title, 
            content: data.content,
            link_url: data.link_url, 
            is_active: data.is_active 
          });
          // 4. setStyles 로직 제거
          // setStyles(data.styles || defaultStyles); 
        }
        setLoading(false);
      };
      fetchPopup();
    } else {
      setLoading(false);
    }
  }, [popupId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 5. handleStyleChange 함수 제거
  // const handleStyleChange = (field: string, value: string) => { ... };
  
  const modules = useMemo(() => {
    const imageHandler = () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();
      input.onchange = async () => {
        if (input.files && input.files.length > 0) {
          const file = input.files[0];
          setMessage('이미지 업로드 중...');
          const storageFileName = sanitizeForStorage(file.name);
          const filePath = `public/popups/content-images/${Date.now()}_${storageFileName}`;
          const { error: uploadError } = await supabase.storage.from('notice-attachments').upload(filePath, file);
          if (uploadError) {
            setMessage(`이미지 업로드 오류: ${uploadError.message}`);
            return;
          }
          const { data: urlData } = supabase.storage.from('notice-attachments').getPublicUrl(filePath);
          const editor = quillRef.current?.getEditor();
          if (editor) {
            const range = editor.getSelection(true);
            editor.insertEmbed(range.index, 'image', urlData.publicUrl);
            editor.setSelection(range.index + 1, 0);
          }
          setMessage('이미지 업로드 완료.');
        }
      };
    };
    return {
      toolbar: {
        container: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'], [{'align': []}],
          [{'list': 'ordered'}, {'list': 'bullet'}], ['link', 'image'], ['clean']
        ],
        handlers: { image: imageHandler },
      },
      imageResize: { parchment: Quill.import('parchment'), modules: ['Resize', 'DisplaySize'] }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMessage('');
    try {
      // 6. ⬇️ finalStyles 로직 및 styles 필드 제거 ⬇️
      const finalData = { 
        ...formData, 
        image_url: null, 
        // styles: finalStyles 
      };

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
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{popupId ? '팝업 수정' : '새 팝업 추가'}</CardTitle>
          <CardDescription>팝업 내용을 입력하세요. 'Active'로 체크된 팝업만 홈페이지에 표시됩니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title (필수)</Label>
              <Input name="title" value={formData.title} onChange={handleChange} required />
            </div>
            
            <div className="space-y-2">
              <Label>Content (내용 및 이미지)</Label>
              <ReactQuill 
                ref={quillRef}
                theme="snow" 
                value={formData.content || ''} 
                onChange={(content) => setFormData(prev => ({ ...prev, content: content }))}
                modules={modules} 
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Link URL (클릭 시 이동할 주소)</Label>
              <Input name="link_url" value={formData.link_url || ''} onChange={handleChange} placeholder="https://..." />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="is_active" checked={formData.is_active} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: !!checked }))} />
              <CheckboxLabel htmlFor="is_active">이 팝업을 홈페이지에 표시 (Active)</CheckboxLabel>
            </div>

            {/* 7. ⬇️ "디자인 설정" UI 블록 전체 제거 ⬇️ */}
            {/* <div className="p-4 border rounded-lg space-y-4">
              ...
            </div> */}
            {/* ⬆️ 제거 완료 ⬆️ */}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onBack}>목록으로</Button>
              <Button type="button" variant="secondary" onClick={() => setIsPreviewOpen(true)}>미리보기</Button>
              <Button type="submit" disabled={loading}>{loading ? '저장 중...' : '저장'}</Button>
            </div>
            {message && <p className="text-sm text-center pt-2">{message}</p>}
          </form>
        </CardContent>
      </Card>

      {/* 8. ⬇️ 미리보기 팝업 (className 수정) ⬇️ */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="w-auto max-w-[90vw] sm:max-w-3xl">
          <DialogHeader>
            {/* 8-1. className 제거 */}
            <DialogTitle>{formData.title || '제목 없음'}</DialogTitle>
          </DialogHeader>

          <div className="py-4 ql-snow">
            <div 
              className="ql-editor" 
              dangerouslySetInnerHTML={{ __html: formData.content }} 
            />
          </div>
          
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