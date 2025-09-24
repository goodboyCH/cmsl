import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import { X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const sanitizeForStorage = (filename: string) => {
  const cleaned = filename.replace(/[^a-zA-Z0-9._-]/g, '');
  if (cleaned.indexOf('.') === -1) {
    const extension = filename.split('.').pop();
    return `${cleaned}.${extension}`;
  }
  return cleaned;
};

interface Attachment { name: string; url: string; }

export function EditNoticePage() {
  const { id } = useParams();
  const noticeId = Number(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>([]);
  const [initialAttachments, setInitialAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    const fetchNotice = async () => {
      if (!noticeId) return;
      setLoading(true);
      const { data } = await supabase.from('notices').select('*').eq('id', noticeId).single();
      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setAuthor(data.author);
        setExistingAttachments(data.attachments || []);
        setInitialAttachments(data.attachments || []);
      }
      setLoading(false);
    };
    fetchNotice();
  }, [noticeId]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setNewAttachments(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const removeNewAttachment = (index: number) => {
    setNewAttachments(newAttachments.filter((_, i) => i !== index));
  };
  
  const removeExistingAttachment = (index: number) => {
    setExistingAttachments(existingAttachments.filter((_, i) => i !== index));
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
      imageResize: { parchment: Quill.import('parchment'), modules: ['Resize', 'DisplaySize'] }
    };
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const attachmentsToDelete = initialAttachments.filter(
        initialFile => !existingAttachments.some(existingFile => existingFile.url === initialFile.url)
      );
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
      const { error: updateError } = await supabase.from('notices').update({ title, content, author, attachments: finalAttachments }).eq('id', noticeId);
      if (updateError) throw updateError;
      setMessage('성공적으로 수정되었습니다.');
      setTimeout(() => navigate(`/board/news/${noticeId}`), 1500);
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
            <div className="space-y-2"><Label htmlFor="title">제목</Label><Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="author">작성자</Label><Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required /></div>
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
              <Button type="button" variant="outline" onClick={() => navigate(`/board/news/${noticeId}`)}>취소</Button>
            </div>
            {message && <p className="pt-2">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}