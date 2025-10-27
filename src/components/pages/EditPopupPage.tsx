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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactQuill, { Quill } from 'react-quill'; // 'react-ill'이 아닌 'react-quill'입니다.
import 'react-quill/dist/quill.snow.css';

interface EditPopupPageProps {
  popupId?: number;
  onBack: () => void;
}

const defaultStyles = {
  popupSize: 'md', 
  // 제거된 필드들 (DB 호환성을 위해 기본값은 유지)
  imageSize: 'full',
  textSize: 'base',
};

const sanitizeForStorage = (filename: string) => filename.replace(/[^a-zA-Z0-9._-]/g, '');

export function EditPopupPage({ popupId, onBack }: EditPopupPageProps) {
  const [formData, setFormData] = useState({
    title: '', 
    content: '',
    link_url: '', 
    is_active: false
  });
  
  const [styles, setStyles] = useState(defaultStyles); 
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
          // DB에 저장된 스타일을 로드하되, 없는 경우 기본값 사용
          setStyles(data.styles || defaultStyles); 
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
  
  const handleStyleChange = (field: string, value: string) => {
    setStyles(prev => ({ ...prev, [field]: value }));
  };
  
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
      // 저장 시점의 스타일 객체를 만듭니다 (popupSize만 사용됨)
      const finalStyles = {
        ...defaultStyles, // 기본값 보장
        popupSize: styles.popupSize, // 현재 선택된 popupSize 적용
      };

      const finalData = { 
        ...formData, 
        image_url: null, 
        styles: finalStyles // 정리된 스타일 객체 저장
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

            {/* ⬇️ 스타일 편집 UI (Legacy 옵션 제거됨) ⬇️ */}
            <div className="p-4 border rounded-lg space-y-4">
              <h4 className="font-medium text-primary">디자인 설정</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>팝업 크기 (최대 너비)</Label>
                  <Select value={styles.popupSize} onValueChange={(v) => handleStyleChange('popupSize', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium (Default)</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* imageSize와 textSize Select 컴포넌트 제거됨 */}
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

      {/* ⬇️ 미리보기 팝업 (정상) ⬇️ */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className={`
          ${styles.popupSize === 'sm' && 'sm:max-w-sm'}
          ${styles.popupSize === 'md' && 'sm:max-w-md'}
          ${styles.popupSize === 'lg' && 'sm:max-w-lg'}
        `}>
          <DialogHeader>
            {/* 미리보기에서는 에디터의 폰트 크기를 반영하지 않고, 
              팝업 타이틀 기본 스타일을 따르도록 textSize 관련 클래스를 제거합니다.
            */}
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