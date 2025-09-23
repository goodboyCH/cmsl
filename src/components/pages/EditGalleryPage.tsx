import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

const sanitizeForStorage = (filename: string) => {
  const cleaned = filename.replace(/[^a-zA-Z0-9._-]/g, '');
  if (cleaned.indexOf('.') === -1) {
    const extension = filename.split('.').pop();
    return `${cleaned}.${extension}`;
  }
  return cleaned;
};

interface EditGalleryPageProps {
  postId: number;
  onBack: () => void;
}

export function EditGalleryPage({ postId, onBack }: EditGalleryPageProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);
  const [existingThumbUrl, setExistingThumbUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    const fetchPost = async () => {
      // setLoading(true)는 초기값이 true이므로 생략 가능
      const { data, error } = await supabase.from('gallery').select('*').eq('id', postId).single();
      
      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setAuthor(data.author);
        setExistingThumbUrl(data.thumbnail_url);
      } else if (error) {
        setMessage(`게시물 로딩 오류: ${error.message}`);
      }
      setLoading(false); // 데이터 로딩 완료
    };
    fetchPost();
  }, [postId]);
  
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewThumbnail(e.target.files[0]);
    }
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
          const filePath = `public/images/${Date.now()}_${storageFileName}`;
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
      imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize']
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      let finalThumbnailUrl = existingThumbUrl;

      if (newThumbnail) {
        if (existingThumbUrl) {
          try {
            const oldFilePath = existingThumbUrl.substring(existingThumbUrl.indexOf('public/'));
            await supabase.storage.from('notice-attachments').remove([oldFilePath]);
          } catch (removeError) {
            console.warn("기존 썸네일 삭제 실패 (무시하고 진행):", removeError);
          }
        }
        
        const thumbName = sanitizeForStorage(newThumbnail.name);
        const thumbPath = `public/gallery/thumbnails/${Date.now()}_${thumbName}`;
        const { error: thumbError } = await supabase.storage.from('notice-attachments').upload(thumbPath, newThumbnail);
        if (thumbError) throw thumbError;

        const { data: thumbUrlData } = supabase.storage.from('notice-attachments').getPublicUrl(thumbPath);
        finalThumbnailUrl = thumbUrlData.publicUrl;
      }
      
      const { error } = await supabase
        .from('gallery')
        .update({ title, content, author, thumbnail_url: finalThumbnailUrl })
        .eq('id', postId);
      if (error) throw error;

      setMessage('성공적으로 수정되었습니다.');
      setTimeout(onBack, 1000);

    } catch (err: any) {
      console.error("Submit Error:", err);
      setMessage(`오류 발생: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 데이터 로딩 중이거나, 데이터를 불러왔지만 content가 아직 없을 경우 로딩 화면 표시
  if (loading) {
    return <p className="text-center p-8">Loading editor...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>갤러리 게시물 수정</CardTitle>
          <CardDescription>내용을 수정하고 파일을 관리하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">작성자</Label>
              <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>내용</Label>
              <ReactQuill 
                ref={quillRef} 
                theme="snow" 
                value={content} 
                onChange={setContent}
                modules={modules} 
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail-input">대표 이미지 변경</Label>
              {existingThumbUrl && (
                <div className="mt-2">
                    <p className="text-sm font-medium mb-2">현재 이미지:</p>
                    <img src={existingThumbUrl} alt="Current thumbnail" className="rounded-md border max-w-xs" />
                </div>
              )}
              <Input id="thumbnail-input" type="file" accept="image/*" onChange={handleThumbnailChange} />
              <p className="text-xs text-muted-foreground">새 이미지를 선택하면 기존 이미지가 교체됩니다.</p>
            </div>
            <div className="flex justify-between items-center mt-8">
              <Button type="submit" disabled={loading}>{loading ? '수정 중...' : '수정 완료'}</Button>
              <Button type="button" variant="outline" onClick={onBack}>취소</Button>
            </div>
            {message && <p className="pt-2 text-sm text-muted-foreground">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}