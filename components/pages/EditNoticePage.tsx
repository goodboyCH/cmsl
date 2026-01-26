'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import { X } from 'lucide-react';
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

interface Attachment { name: string; url: string; }

interface EditNoticePageProps {
  id: string;
}

export function EditNoticePage({ id }: EditNoticePageProps) {
  const noticeId = Number(id);
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [titleKo, setTitleKo] = useState('');
  const [content, setContent] = useState('');
  const [contentKo, setContentKo] = useState('');
  const [author, setAuthor] = useState('');
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>([]);
  const [initialAttachments, setInitialAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchNotice = async () => {
      if (!noticeId) return;
      setLoading(true);
      const { data } = await supabase.from('notices').select('*').eq('id', noticeId).single();
      if (data) {
        setTitle(data.title);
        setTitleKo(data.title_ko || '');
        setContent(data.content);
        setContentKo(data.content_ko || '');
        setAuthor(data.author);
        setExistingAttachments(data.attachments || []);
        setInitialAttachments(data.attachments || []);
      }
      setLoading(false);
    };
    fetchNotice();
  }, [noticeId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setNewAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
  };
  const removeNewAttachment = (index: number) => {
    setNewAttachments(newAttachments.filter((_, i) => i !== index));
  };
  const removeExistingAttachment = (index: number) => {
    setExistingAttachments(existingAttachments.filter((_, i) => i !== index));
  };

  const handleImageUpload = useCallback(async (editor: any) => {
    if (!editor) {
      console.error("Editor instance not found");
      return;
    }

    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        try {
          setMessage('이미지 업로드 중...');
          const storageFileName = sanitizeForStorage(file.name);
          const filePath = `public/images/${Date.now()}_${storageFileName}`;
          const { error: uploadError } = await supabase.storage.from('notice-attachments').upload(filePath, file);
          if (uploadError) {
            setMessage(`이미지 업로드 오류: ${uploadError.message}`);
            return;
          }
          const { data: urlData } = supabase.storage.from('notice-attachments').getPublicUrl(filePath);

          editor.chain().focus().setImage({ src: urlData.publicUrl }).run();
          setMessage('이미지 업로드 완료.');
        } catch (error: any) {
          setMessage(`업로드 중 예외 발생: ${error.message}`);
        } finally {
          input.value = ''; // Reset input
        }
      }
    };
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

      const attachmentsToDelete = initialAttachments.filter(initial => !existingAttachments.some(existing => existing.url === initial.url));
      if (attachmentsToDelete.length > 0) {
        const filePaths = attachmentsToDelete.map(file => new URL(file.url).pathname.substring(new URL(file.url).pathname.indexOf('public/')));
        await supabase.storage.from('notice-attachments').remove(filePaths);
      }
      let uploadedAttachments: Attachment[] = [];
      for (const file of newAttachments) {
        const filePath = `public/files/${Date.now()}_${sanitizeForStorage(file.name)}`;
        const { error } = await supabase.storage.from('notice-attachments').upload(filePath, file);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('notice-attachments').getPublicUrl(filePath);
        uploadedAttachments.push({ name: file.name, url: urlData.publicUrl });
      }
      const finalAttachments = [...existingAttachments, ...uploadedAttachments];

      const { error: updateError } = await supabase
        .from('notices')
        .update({
          title, title_ko: titleKo,
          content: cleanContent, content_ko: cleanContentKo,
          author, attachments: finalAttachments
        })
        .eq('id', noticeId);

      if (updateError) throw updateError;
      setMessage('성공적으로 수정되었습니다.');
      setTimeout(() => router.push(`/board/news/${noticeId}`), 1500);
    } catch (err: any) {
      setMessage(`수정 중 오류 발생: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center p-8">Loading editor...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>공지사항 수정</CardTitle>
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
              <Label htmlFor="attachment-input">첨부파일</Label>
              {existingAttachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm font-medium">현재 파일:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {existingAttachments.map((file, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{file.name}</a>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeExistingAttachment(index)}><X className="h-4 w-4" /></Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Input id="attachment-input" type="file" multiple onChange={handleFileChange} />
              {newAttachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm font-medium">새로 추가할 파일:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {newAttachments.map((file, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{file.name}</span>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeNewAttachment(index)}><X className="h-4 w-4" /></Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-8">
              <Button type="submit" disabled={loading}>{loading ? '수정 중...' : '수정 완료'}</Button>
              <Button type="button" variant="outline" onClick={() => router.push(`/board/news/${noticeId}`)}>취소</Button>
            </div>
            {message && <p className="pt-2">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
