'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TiptapEditor } from '@/components/ui/tiptap-editor';

const sanitizeForStorage = (filename: string) => {
  const cleaned = filename.replace(/[^a-zA-Z0-9._-]/g, '');
  if (cleaned.indexOf('.') === -1) {
    const extension = filename.split('.').pop();
    return `${cleaned}.${extension}`;
  }
  return cleaned;
};

interface EditGalleryPageProps {
  id: string;
}

export function EditGalleryPage({ id }: EditGalleryPageProps) {
  const postId = Number(id);
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [titleKo, setTitleKo] = useState('');
  const [content, setContent] = useState('');
  const [contentKo, setContentKo] = useState('');
  const [author, setAuthor] = useState('');
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);
  const [existingThumbUrl, setExistingThumbUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      setLoading(true);
      const { data, error } = await supabase.from('gallery').select('*').eq('id', postId).single();
      if (data) {
        setTitle(data.title);
        setTitleKo(data.title_ko || '');
        setContent(data.content);
        setContentKo(data.content_ko || '');
        setAuthor(data.author);
        setExistingThumbUrl(data.thumbnail_url);
      } else if (error) {
        setMessage(`게시물 로딩 오류: ${error.message}`);
      }
      setLoading(false);
    };
    fetchPost();
  }, [postId]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setNewThumbnail(e.target.files[0]);
  };

  const handleImageUpload = useCallback(async (editor: any) => {
    if (!editor) return;

    // 1. input 태그 생성
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    // [핵심 수정] input을 body에 강제로 붙여야 브라우저가 이벤트를 정상 처리합니다.
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    document.body.appendChild(input);

    input.onchange = async () => {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        try {
          setMessage('이미지 업로드 중...');

          const storageFileName = sanitizeForStorage(file.name);
          const filePath = `public/images/${Date.now()}_${storageFileName}`;

          const { error: uploadError } = await supabase.storage.from('notice-attachments').upload(filePath, file);
          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage.from('notice-attachments').getPublicUrl(filePath);

          // 2. 에디터 포커스 및 이미지 삽입
          // focus()를 먼저 호출해 '작업 중' 상태로 만듭니다.
          editor.chain().focus().setImage({ src: urlData.publicUrl }).run();

          // 메시지 업데이트 (리렌더링 유발)
          setTimeout(() => setMessage('이미지 업로드 완료.'), 100);

        } catch (error: any) {
          console.error(error);
          setMessage(`업로드 실패: ${error.message}`);
        } finally {
          // [중요] 사용이 끝난 태그 제거
          if (document.body.contains(input)) {
            document.body.removeChild(input);
          }
        }
      } else {
        // 파일 선택 취소 시에도 제거
        if (document.body.contains(input)) {
          document.body.removeChild(input);
        }
      }
    };

    // 3. 파일 탐색기 열기
    input.click();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // Sanitize content before saving
      const sanitizeContent = (html: string) => html.replace(/(&nbsp;|&#160;|&#xA0;|\u00A0|&amp;nbsp;)/gi, ' ');
      const cleanContent = sanitizeContent(content);
      const cleanContentKo = sanitizeContent(contentKo);

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

      const { error } = await supabase
        .from('gallery')
        .update({
          title, title_ko: titleKo,
          content: cleanContent, content_ko: cleanContentKo,
          author, thumbnail_url: finalThumbnailUrl
        })
        .eq('id', postId);

      if (error) throw error;
      setMessage('성공적으로 수정되었습니다.');
      setTimeout(() => router.push(`/board/gallery/${postId}`), 1000);
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
            <div className="space-y-2">
              <Label htmlFor="author">작성자</Label>
              <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
            </div>

            <Tabs defaultValue="en" className="border p-4 rounded-md">
              <TabsList className="mb-4">
                <TabsTrigger value="en">English (Primary)</TabsTrigger>
                <TabsTrigger value="ko">Korean (Optional)</TabsTrigger>
              </TabsList>

              <TabsContent value="en" className="space-y-4">
                <div className="space-y-2">
                  <Label>Title (EN)</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Content (EN)</Label>
                  <TiptapEditor key="en" value={content} onChange={setContent} onImageUpload={handleImageUpload} />
                </div>
              </TabsContent>

              <TabsContent value="ko" className="space-y-4">
                <div className="space-y-2">
                  <Label>제목 (KO)</Label>
                  <Input value={titleKo} onChange={(e) => setTitleKo(e.target.value)} placeholder="한글 제목" />
                </div>
                <div className="space-y-2">
                  <Label>내용 (KO)</Label>
                  <TiptapEditor key="ko" value={contentKo} onChange={setContentKo} onImageUpload={handleImageUpload} />
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2 mt-4">
              <Label htmlFor="thumbnail-input">대표 이미지 변경</Label>
              {existingThumbUrl && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-2">현재 이미지:</p>
                  <img src={existingThumbUrl} alt="Current thumbnail" className="rounded-md border max-w-xs" />
                </div>
              )}
              <Input id="thumbnail-input" type="file" accept="image/*" onChange={handleThumbnailChange} />
            </div>
            <div className="flex justify-between items-center mt-8">
              <Button type="submit" disabled={loading}>{loading ? '수정 중...' : '수정 완료'}</Button>
              <Button type="button" variant="outline" onClick={() => router.push(`/board/gallery/${postId}`)}>취소</Button>
            </div>
            {message && <p className="pt-2 text-sm text-muted-foreground">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
