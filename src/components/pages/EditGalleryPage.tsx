import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sanitizeForStorage = (filename: string) => {
  const cleaned = filename.replace(/[^a-zA-Z0-9._-]/g, '');
  if (cleaned.indexOf('.') === -1) {
    const extension = filename.split('.').pop();
    return `${cleaned}.${extension}`;
  }
  return cleaned;
};

export function EditGalleryPage() {
  const { id } = useParams();
  const postId = Number(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [titleKo, setTitleKo] = useState(''); // 추가
  const [content, setContent] = useState('');
  const [contentKo, setContentKo] = useState(''); // 추가
  const [author, setAuthor] = useState('');
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);
  const [existingThumbUrl, setExistingThumbUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  const quillRef = useRef<ReactQuill>(null);
  const quillRefKo = useRef<ReactQuill>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      setLoading(true);
      const { data, error } = await supabase.from('gallery').select('*').eq('id', postId).single();
      if (data) {
        setTitle(data.title);
        setTitleKo(data.title_ko || ''); // 로드
        setContent(data.content);
        setContentKo(data.content_ko || ''); // 로드
        setAuthor(data.author);
        setExistingThumbUrl(data.thumbnail_url);
      } else if (error) {
        setMessage(`게시물 로딩 오류: ${error.message}`);
      }
      setLoading(false);
    };
    fetchPost();
  }, [postId]);
  
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files.length > 0) setNewThumbnail(e.target.files[0]); };
  
  const modules = useMemo(() => {
    const imageHandler = () => {
      const input = document.createElement('input'); input.setAttribute('type', 'file'); input.setAttribute('accept', 'image/*'); input.click();
      input.onchange = async () => {
        if (input.files && input.files.length > 0) {
          const file = input.files[0]; setMessage('이미지 업로드 중...');
          const storageFileName = sanitizeForStorage(file.name);
          const filePath = `public/images/${Date.now()}_${storageFileName}`;
          const { error: uploadError } = await supabase.storage.from('notice-attachments').upload(filePath, file);
          if (uploadError) { setMessage(`이미지 업로드 오류: ${uploadError.message}`); return; }
          const { data: urlData } = supabase.storage.from('notice-attachments').getPublicUrl(filePath);
          const editor = quillRef.current?.getEditor();
          if (editor) { const range = editor.getSelection(true); editor.insertEmbed(range?.index || 0, 'image', urlData.publicUrl); }
          setMessage('이미지 업로드 완료.');
        }
      };
    };
    return { toolbar: { container: [[{ 'header': [1, 2, 3, false] }], ['bold', 'italic', 'underline', 'strike'], [{'align': []}], [{'list': 'ordered'}, {'list': 'bullet'}], ['link', 'image'], ['clean']], handlers: { image: imageHandler }, }, imageResize: { parchment: Quill.import('parchment'), modules: ['Resize', 'DisplaySize'] } };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMessage('');
    try {
      let finalThumbnailUrl = existingThumbUrl;
      if (newThumbnail) {
        if (existingThumbUrl) {
          const oldFilePath = existingThumbUrl.substring(existingThumbUrl.indexOf('public/'));
          await supabase.storage.from('notice-attachments').remove([oldFilePath]);
        }
        const thumbName = sanitizeForStorage(newThumbnail.name);
        const thumbPath = `public/gallery/thumbnails/${Date.now()}_${thumbName}`;
        const { error: thumbError } = await supabase.storage.from('notice-attachments').upload(thumbPath, newThumbnail);
        if (thumbError) throw thumbError;
        const { data: thumbUrlData } = supabase.storage.from('notice-attachments').getPublicUrl(thumbPath);
        finalThumbnailUrl = thumbUrlData.publicUrl;
      }
      
      // Update: _ko 필드 추가
      const { error } = await supabase
        .from('gallery')
        .update({ 
            title, title_ko: titleKo, 
            content, content_ko: contentKo, 
            author, thumbnail_url: finalThumbnailUrl 
        })
        .eq('id', postId);

      if (error) throw error;
      setMessage('성공적으로 수정되었습니다.');
      setTimeout(() => navigate(`/board/gallery/${postId}`), 1000);
    } catch (err: any) {
      setMessage(`오류 발생: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <p className="text-center p-8">Loading editor...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>갤러리 게시물 수정</CardTitle>
          <CardDescription>내용을 수정하고 파일을 관리하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2"><Label htmlFor="author">작성자</Label><Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required /></div>
            
            {/* Tabs 적용 */}
            <Tabs defaultValue="en" className="border p-4 rounded-md">
              <TabsList className="mb-4">
                <TabsTrigger value="en">English (Primary)</TabsTrigger>
                <TabsTrigger value="ko">Korean (Optional)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="en" className="space-y-4">
                <div className="space-y-2"><Label>Title (EN)</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
                <div className="space-y-2"><Label>Content (EN)</Label><ReactQuill ref={quillRef} theme="snow" value={content} onChange={setContent} modules={modules} className="bg-background"/></div>
              </TabsContent>

              <TabsContent value="ko" className="space-y-4">
                <div className="space-y-2"><Label>제목 (KO)</Label><Input value={titleKo} onChange={(e) => setTitleKo(e.target.value)} placeholder="한글 제목" /></div>
                <div className="space-y-2"><Label>내용 (KO)</Label><ReactQuill ref={quillRefKo} theme="snow" value={contentKo} onChange={setContentKo} modules={modules} className="bg-background"/></div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2 mt-4">
              <Label htmlFor="thumbnail-input">대표 이미지 변경</Label>
              {existingThumbUrl && (
                <div className="mt-2"><p className="text-sm font-medium mb-2">현재 이미지:</p><img src={existingThumbUrl} alt="Current thumbnail" className="rounded-md border max-w-xs" /></div>
              )}
              <Input id="thumbnail-input" type="file" accept="image/*" onChange={handleThumbnailChange} />
            </div>
            <div className="flex justify-between items-center mt-8">
              <Button type="submit" disabled={loading}>{loading ? '수정 중...' : '수정 완료'}</Button>
              <Button type="button" variant="outline" onClick={() => navigate(`/board/gallery/${postId}`)}>취소</Button>
            </div>
            {message && <p className="pt-2 text-sm text-muted-foreground">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}